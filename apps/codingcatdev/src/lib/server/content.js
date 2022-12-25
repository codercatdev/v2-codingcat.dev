import { PUBLIC_FB_PROJECT_ID } from '$env/static/public';
import { PRIVATE_FB_PRIVATE_KEY, PRIVATE_FB_CLIENT_EMAIL } from '$env/static/private';

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { compile } from 'mdsvex';
import { ContentType } from '$lib/types';

const LIMIT = 20;

if (!PUBLIC_FB_PROJECT_ID || !PRIVATE_FB_CLIENT_EMAIL || !PRIVATE_FB_PRIVATE_KEY) {
	throw new Error('Missing Firebase Admin Environment Varialbles');
}
let app = getApps().at(0);
if (!app) {
	app = initializeApp({
		credential: cert({
			projectId: PUBLIC_FB_PROJECT_ID,
			clientEmail: PRIVATE_FB_CLIENT_EMAIL,
			privateKey: PRIVATE_FB_PRIVATE_KEY
		})
	});
}

const firestore = getFirestore(app);

/**
 * Represents the Content of Pages
 * @typedef {import('$lib/types').Content} Content
 * */

/**
 * List all content from specified content type
 * allows for optionally sending after object
 * @typedef {import('$lib/types').ContentType} contentType
 * @param {{contentType: contentType, after?: {start: Date, season: number, episode: number}, limit?: number}} params
 * @returns {Promise<{
 * next: any,
 * content: import('$lib/types').Content[] | import('$lib/types').Podcast[]}>}
 * */
export const listContent = async ({ contentType, after, limit }) => {
	console.log(`List for type: ${contentType}`);

	let query = firestore
		.collection(contentType)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc')
		.orderBy('title', 'asc')
		.where('published', '==', 'published')
		.limit(limit || LIMIT);

	if (contentType === ContentType.podcast) {
		query = firestore
			.collection(contentType)
			.where('status', '==', 'released')
			.where('start', '<=', Timestamp.fromDate(new Date()))
			.orderBy('start', 'desc')
			.orderBy('season', 'desc')
			.orderBy('episode', 'desc')
			.limit(limit || LIMIT);
		if (after) {
			console.log(`after: ${JSON.stringify(after)}`);
			query = query.startAfter(new Date(after.start), after.season, after.episode);
		}
	}
	const querySnapshot = await query.get();

	let next = {};
	if (!querySnapshot.empty) {
		const last = await querySnapshot.docs[querySnapshot.docs.length - 1].data();

		contentType === ContentType.podcast
			? (next = {
					start: last.start.toDate(),
					season: last.season,
					episode: last.episode
			  })
			: (next = {
					start: last.start.toDate(),
					title: last.title
			  });
	}
	return {
		next,
		content: querySnapshot.docs.map((doc) => {
			return {
				id: doc.id,
				...doc.data(),
				start: doc.data().start ? doc.data().start.toDate() : doc.data().start
			};
		})
	};
};

/**
 * Get content type by slug
 * @param {import('$lib/types').ContentType} contentType
 * @param {string} slug
 * @returns {Promise<Content | null>}
 * */
export const getContentBySlug = async (contentType, slug) => {
	console.debug(`Searching for content type: ${contentType} slug: ${slug}`);

	let query = firestore
		.collection(contentType)
		.where('slug', '==', slug)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc')
		.where('published', '==', 'published')
		.limit(1);

	if (contentType === ContentType.podcast) {
		query = firestore
			.collection(contentType)
			.where('slug', '==', slug)
			.where('start', '<=', Timestamp.fromDate(new Date()))
			.orderBy('start', 'desc')
			.where('status', '==', 'released')
			.limit(1);
	}
	const querySnapshot = await query.get();

	const doc = querySnapshot?.docs?.at(0);
	if (!doc) {
		return null;
	}

	const markdown = doc.data().content || '';
	const compiled = await compile(markdown);

	let content = '';
	if (compiled) {
		// https://github.com/pngwn/MDsveX/issues/392
		content = compiled.code
			.replace(/>{@html `<code class="language-/g, '><code class="language-')
			.replace(/<\/code>`}<\/pre>/g, '</code></pre>');
	}

	return {
		id: doc.id,
		...doc.data(),
		content,
		start: doc.data().start ? doc.data().start.toDate() : doc.data().start
	};
};
