import { PUBLIC_FB_PROJECT_ID } from '$env/static/public';
import { PRIVATE_FB_PRIVATE_KEY, PRIVATE_FB_CLIENT_EMAIL } from '$env/static/private';

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { compile } from 'mdsvex';
import { ContentType } from '$lib/types';

import prism from 'prismjs';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-dart.js';
import 'prismjs/components/prism-diff.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-jsx';
import 'prism-svelte';
console.debug('Available Prism Languages: ', prism.languages);

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
 * @param {{contentType: contentType, after?: {start: Date, season?: number, episode?: number, title?: string}, limit?: number}} params
 * @returns {Promise<{
 * next: any,
 * content: import('$lib/types').Content[] | import('$lib/types').Podcast[]}>}
 * */
export const listContent = async ({ contentType, after, limit }) => {
	const theLimit = limit || LIMIT;
	console.log(`List for type: ${contentType}, limit of ${theLimit}`);

	// All query need a start date
	let query = firestore
		.collection(contentType)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc');

	if (contentType === ContentType.podcast) {
		query = query
			.where('status', '==', 'released')
			.orderBy('season', 'desc')
			.orderBy('episode', 'desc')
			.limit(theLimit);
		if (after) {
			console.log(`after: ${JSON.stringify(after)}`);
			query = query.startAfter(new Date(after.start), after.season, after.episode);
		}
	} else {
		query = query.orderBy('title', 'asc').where('published', '==', 'published').limit(theLimit);
		if (after) {
			console.log(`after: ${JSON.stringify(after)}`);
			query = query.startAfter(new Date(after.start), after.title);
		}
	}
	const querySnapshot = await query.get();

	let next = {};
	if (!querySnapshot.empty) {
		const last = await querySnapshot.docs[querySnapshot.docs.length - 1].data();

		if (querySnapshot.docs.length < theLimit) {
			next = {};
		} else {
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

	/**
	 *  @type import('$lib/types').Content[]}>}
	 */
	let lesson = [];
	if (contentType === ContentType.course) {
		const lessonQuery = doc.ref
			.collection('lesson')
			.where('start', '<=', Timestamp.fromDate(new Date()))
			.orderBy('start', 'desc')
			.orderBy('weight')
			.where('published', '==', 'published');
		const lessonSnapshot = await lessonQuery.get();
		lesson = lessonSnapshot.docs.map((doc) => {
			return {
				id: doc.id,
				...doc.data(),
				start: doc.data().start ? doc.data().start.toDate() : doc.data().start
			};
		});
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
		lesson,
		start: doc.data().start ? doc.data().start.toDate() : doc.data().start
	};
};

/**
 * Get lesson by course and slug
 * @param {string} courseSlug
 * @param {string} slug
 * @returns {Promise<Content | null>}
 * */
export const getLessonBySlug = async (courseSlug, slug) => {
	console.debug(`Searching for course: ${courseSlug} lesson slug: ${slug}`);

	let courseQuery = firestore
		.collection(ContentType.course)
		.where('slug', '==', courseSlug)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc')
		.where('published', '==', 'published')
		.limit(1);

	const courseSnapshot = await courseQuery.get();

	const course = courseSnapshot?.docs?.at(0);
	if (!course) {
		console.debug(`course not found`);
		return null;
	}

	let query = firestore
		.collection(ContentType.course)
		.doc(course.id)
		.collection(ContentType.lesson)
		.where('slug', '==', slug)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc')
		.where('published', '==', 'published')
		.limit(1);

	const querySnapshot = await query.get();

	const doc = querySnapshot?.docs?.at(0);
	if (!doc) {
		return null;
	}

	const lessonQuery = firestore
		.collection(ContentType.course)
		.doc(course.id)
		.collection(ContentType.lesson)
		.where('start', '<=', Timestamp.fromDate(new Date()))
		.orderBy('start', 'desc')
		.orderBy('weight')
		.where('published', '==', 'published');

	const lessonSnapshot = await lessonQuery.get();
	const lesson = lessonSnapshot.docs.map((doc) => {
		return {
			id: doc.id,
			...doc.data(),
			start: doc.data().start ? doc.data().start.toDate() : doc.data().start
		};
	});

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
		lesson,
		courseSlug: course.data().slug,
		start: doc.data().start ? doc.data().start.toDate() : doc.data().start
	};
};
