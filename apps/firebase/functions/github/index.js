const functions = require("firebase-functions");
const admin = require("firebase-admin");

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

exports.test = functions
	.runWith({ secrets: ["GH_TOKEN"] })
	.https.onRequest(async (request, response) => {
		await updateContentFromGitHub();
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
		functions.logger.debug("payload", payload);

		if (!payload?.type) {
			functions.logger.error(`Missing Type for content update.`);
		}

		let fileSlug = slugify(payload.content.name);
		if (payload.type === "course") {
			// Get the Folder name of course for uniqueness
			fileSlug = slugify(payload.content.path.split("/").at(-2));
		}
		const ref = admin.firestore().collection(payload.type).doc(fileSlug);
		await updateDocumentFromGitHub(ref, payload);

		/**
		 * If this is a course there should be lesson data as well.
		 * */
		if (payload.type === "course" && payload.content.lesson) {
			functions.logger.debug("payload:lesson", payload.content.lesson);
			const lessonSlug = slugify(payload.content.lesson.name);
			const lessonRef = ref.collection("lesson").doc(lessonSlug);
			await updateDocumentFromGitHub(lessonRef, {
				content: payload.content.lesson,
			});
		}
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
	const octokit = createOctokit();

	// // Find all the content to send to firestore
	// for (const type of ["page", "post", "tutorial"]) {
	// 	const { data, headers } = await octokit.rest.repos.getContent({
	// 		owner,
	// 		repo,
	// 		path: `content/${type}`,
	// 	});
	// 	functions.logger.info(`Found ${data?.length} ${type} to check.`);
	// 	functions.logger.debug(headers["x-ratelimit-remaining"]);

	// 	// trigger pubsub to scale this update all at once
	// 	// TODO: recursive for directories
	// 	for (const d of data) {
	// 		await sendTopic(topic, { type, content: d });
	// 	}
	// }

	/**
	 * Find all Course data
	 */
	const { data: courseDirs, headers: courseDirHeaders } =
		await octokit.rest.repos.getContent({
			owner,
			repo,
			path: `content/course`,
		});
	functions.logger.info(`Found ${courseDirs?.length} courses to check.`);
	functions.logger.debug(courseDirHeaders["x-ratelimit-remaining"]);

	// Loop each Course
	for (const course of courseDirs) {
		// Get Course detail from index
		const { data: indexFile, headers: indexFileHeaders } =
			await octokit.rest.repos.getContent({
				owner,
				repo,
				path: `${course.path}/index.md`,
			});
		functions.logger.debug(`Found index for course to check.`);
		functions.logger.debug(indexFileHeaders["x-ratelimit-remaining"]);

		// If there is no course, just bail
		if (!indexFile?.name) {
			continue;
		}

		// Get Course lessons
		const { data: lessonFiles, headers: lessonFilesHeaders } =
			await octokit.rest.repos.getContent({
				owner,
				repo,
				path: `${course.path}/lesson`,
			});
		functions.logger.debug(
			`Found ${lessonFiles?.length} lessons for ${indexFile?.name} to check.`
		);
		functions.logger.debug(lessonFilesHeaders["x-ratelimit-remaining"]);

		for (const lesson of lessonFiles) {
			// Send the details for course with each lesson
			await sendTopic(topic, {
				type: "course",
				content: {
					...indexFile,
					lesson,
				},
			});
		}
	}
};

/**
 * Gets raw markdown file and updates Firestore
 * @param {admin.firestore.DocumentReference<admin.firestore.DocumentData>} ref
 * @param {any} payload
 * @returns Promise<void>
 */
const updateDocumentFromGitHub = async (ref, payload) => {
	// Check if this file already exists
	const doc = await ref.get();

	if (doc.exists) {
		functions.logger.info(`Document already exists, checking sha...`);
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
	const bufferObj = Buffer.from(gitHubContent.content, gitHubContent.encoding);
	const decodedFile = bufferObj.toString();
	// Decode markdown and get frontmatter
	const mdObject = matter(decodedFile);

	/**
	 * Update Firestore with the github data, frontmatter, and markdown.
	 * Flatten the Author data for easier searches
	 */
	await ref.set(
		{
			github: {
				content: gitHubContent,
				commit: gitHubCommit,
			},
			content: mdObject.content,
			...mdObject.data,
			weight: mdObject?.data?.weight ? mdObject?.data?.weight : 0,
			start: mdObject?.data?.start
				? Timestamp.fromDate(new Date(mdObject?.data?.start))
				: null,
			end: mdObject?.data?.end
				? Timestamp.fromDate(new Date(mdObject?.data?.end))
				: null,
		},
		{ merge: true }
	);
};
