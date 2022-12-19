const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = initializeApp();

const { Timestamp } = require("firebase-admin/firestore");
const { Octokit } = require("octokit");
const { sendTopic } = require("../utils/pubsub");
const slugify = require("slugify");
const matter = require("gray-matter");

const topic = "GitHubUpdateFirestore";
const owner = "codingcatdev";
const repo = "v2-codingcat.dev";

// Initialize Firebase admin
admin.initializeApp();

exports.health = functions.https.onRequest(async (request, response) => {
	response
		.status(200)
		.send(
			`<div>Timestamp: ${JSON.stringify(
				Timestamp.now()
			)}</div><div>Date: ${Timestamp.now().toDate()}</div>`
		);
});

exports.addContent = functions
	.runWith({ secrets: ["GH_TOKEN"] })
	.https.onCall(async (data, context) => {
		if (!process.env.GH_TOKEN) {
			throw new functions.https.HttpsError(
				"failed-precondition",
				"Missing GitHub Personal Token"
			);
		}
		// Checking that the user is authenticated.
		if (!context.auth) {
			// Throwing an HttpsError so that the client gets the error details.
			throw new functions.https.HttpsError(
				"failed-precondition",
				"The function must be called while authenticated."
			);
		}
		try {
			await updateContentFromGitHub();
			functions.logger.info(`Successfully added content for pubsub`);
		} catch (error) {
			functions.logger.error(`Failed to load cron data`);
		}
	});

exports.addContentNightly = functions
	.runWith({ secrets: ["GH_TOKEN"] })
	.pubsub.schedule("0 0 * * *")
	.timeZone("America/New_York")
	.onRun(async (context) => {
		if (!process.env.GH_TOKEN) {
			throw new functions.https.HttpsError(
				"failed-precondition",
				"Missing GitHub Personal Token"
			);
		}
		try {
			await updateContentFromGitHub();
		} catch (error) {
			throw new functions.https.HttpsError("unknown");
		}
	});

/*
 * Adds file data to firestore from GitHub content
 */
exports.addItemToFirestore = functions
	.runWith({ secrets: ["GH_TOKEN"] })
	.pubsub.topic(topic)
	.onPublish(async (message, context) => {
		if (!process.env.GH_TOKEN) {
			response.status(401).send("Missing GitHub Personal Token");
			return false;
		}
		/** @type {{type: string, content: Object}} payload */
		const payload = JSON.parse(JSON.stringify(message.json));
		functions.logger.debug(payload);

		if (!payload?.type) {
			functions.logger.error(`Missing Type for content update.`);
		}

		const fileSlug = slugify(payload.content.name);
		const ref = admin.firestore().collection(payload.type).doc(fileSlug);

		// Check if this file already exists
		const doc = await ref.get();

		if (doc.exists) {
			functions.logger.info(
				`Document ${fileSlug} already exists, checking sha...`
			);
			if (doc.data()?.sha == payload?.content?.sha) {
				functions.logger.info(`sha matches no need to continue`);
				return false;
			}
		}

		// Get raw file
		const gitHubContent = await getGitHubContent(payload.content.path);
		functions.logger.info(
			`${payload.content.path} github file content`,
			gitHubContent
		);

		// Get commit
		const gitHubCommit = await getGitHubCommit(payload.content.path);

		// Convert encoded file
		const bufferObj = Buffer.from(
			gitHubContent.content,
			gitHubContent.encoding
		);
		const decodedFile = bufferObj.toString();
		// Decode markdown and get frontmatter
		const mdObject = matter(decodedFile);

		/**
		 * Update Firestore with the github data, frontmatter, and markdown.
		 * Flatten the Author data for easier searches
		 */
		ref.set(
			{
				github: {
					content: gitHubContent,
					commit: gitHubCommit,
				},
				content: mdObject.content,
				...mdObject.data,
				start: mdObject?.data?.start
					? Timestamp.fromDate(new Date(mdObject?.data?.start))
					: null,
				end: mdObject?.data?.end
					? Timestamp.fromDate(new Date(mdObject?.data?.end))
					: null,
			},
			{ merge: true }
		);
	});

/**
 * Set Octokit instance and return  */
const createOctokit = () => {
	// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
	return new Octokit({
		auth: process.env.GH_TOKEN,
	});
};
/**
 * Returns GitHub's version of content, including encoded file
 * @param {string} path */
const getGitHubContent = async (path) => {
	const octokit = createOctokit();
	const { data, headers } = await octokit.rest.repos.getContent({
		owner,
		repo,
		path,
	});
	functions.logger.debug(data);
	functions.logger.debug(
		"x-ratelimit-remaining",
		headers["x-ratelimit-remaining"]
	);
	return data;
};

/**
 * Returns GitHub's version of content, including encoded file
 * @param {string} path */
const getGitHubCommit = async (path) => {
	const octokit = createOctokit();
	const { data, headers } = await octokit.rest.repos.listCommits({
		owner,
		repo,
		path,
	});
	functions.logger.debug(data);
	functions.logger.debug(
		"x-ratelimit-remaining",
		headers["x-ratelimit-remaining"]
	);
	return data;
};

/**
 * Triggers the lookup of content from GitHub
 * and updates Firestore based on latest content
 */
const updateContentFromGitHub = async () => {
	// Find all the content to send to firestore
	for (const type of ["page", "post", "tutorial"]) {
		const octokit = createOctokit();
		const { data, headers } = await octokit.rest.repos.getContent({
			owner,
			repo,
			path: `content/${type}`,
		});
		functions.logger.info(`Found ${data?.length} ${type} to check.`);
		functions.logger.debug(headers["x-ratelimit-remaining"]);

		// trigger pubsub to scale this update all at once
		// TODO: recursive for directories
		for (const d of data) {
			await sendTopic(topic, { type, content: d });
		}
	}
};
