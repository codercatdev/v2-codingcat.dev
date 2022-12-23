import { PUBLIC_FB_PROJECT_ID } from '$env/static/public';
import { PRIVATE_FB_PRIVATE_KEY, PRIVATE_FB_CLIENT_EMAIL } from '$env/static/private';

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { transform } from '$lib/server/markdown';

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
 * List all content from specified content type.
 * @param {import('$lib/types').ContentType} contentType
 * @returns {Promise<Content[]>}
 * */
export const listContent = async (contentType) => {
	console.log('List for type:', contentType);

	const querySnapshot = await firestore
		.collection(contentType)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc')
		.orderBy('title', 'asc')
		.where('published', '==', 'published')
		.get();

	return querySnapshot.docs.map((doc) => {
		return {
			id: doc.id,
			...doc.data(),
			start: doc.data().start ? doc.data().start.toDate() : doc.data().start,
			end: doc.data().end ? doc.data().end.toDate() : doc.data().end
		};
	});
};

/**
 * Get content type by slug
 * @param {import('$lib/types').ContentType} contentType
 * @param {string} slug
 * @returns {Promise<Content | null>}
 * */
export const getContentBySlug = async (contentType, slug) => {
	console.debug(`Searching for content type: ${contentType} slug: ${slug}`);

	const querySnapshot = await firestore
		.collection(contentType)
		.where('slug', '==', slug)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc')
		.where('published', '==', 'published')
		.get();
	const doc = querySnapshot?.docs?.at(0);
	if (!doc) {
		return null;
	}
	return {
		id: doc.id,
		...doc.data(),
		content: doc.data().content ? transform(doc.data().content, {}) : '',
		start: doc.data().start ? doc.data().start.toDate() : doc.data().start,
		end: doc.data().end ? doc.data().end.toDate() : doc.data().end
	};
};
