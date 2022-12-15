const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Octokit } = require("octokit");
const { sendTopic } = require("../utils/pubsub");
const slugify = require("slugify");

const topic = "GitHubUpdateFirestore";

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
	functions.logger.info("Hello logs!", { structuredData: true });
	response.send("Hello from Firebase!");
});

exports.addBlog = functions.https.onRequest(async (request, response) => {
	// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
	const octokit = new Octokit({
		auth: process.env.SECRET_NAME,
	});

	// Find all the content to send to firestore
	const { data } = await octokit.rest.repos.getContent({
		owner: "codingcatdev",
		repo: "v2-codingcat.dev",
		path: "content/blog",
	});
	functions.logger.info(`Found ${data?.length} blogs to check.`);

	// trigger pubsub to scale this update all at once
	for (const d of data) {
		await sendTopic(topic, { type: "post", content: d });
	}
	response.status(200).send("Successfully added blog");
});

exports.addItemToFirestore = functions.pubsub
	.topic(topic)
	.onPublish(async (message, context) => {
		functions.logger.info("Checking if content exists for payload.");
		const payload = JSON.parse(JSON.stringify(message.json));
		functions.logger.info(payload);

		if (!payload?.type) {
			functions.logger.error(`Missing Type for content update.`);
		}

		const fileSlug = slugify(payload.content.name);
		const ref = admin.firestore().collection(payload.type).doc(fileSlug);

		// Check if this file already exists
		const doc = await ref.get();

		let update = false;

		if (doc.exists) {
			functions.logger.info(`Document already exists, checking sha...`);
			if (doc.data()?.sha == payload?.content?.sha) {
				functions.logger.info(`sha matches no need to continue`);
			}
			update = true;
		} else {
			update = true;
		}
		if (!update) {
			return false;
		}

		ref.set(payload.content, { merge: true });
	});
