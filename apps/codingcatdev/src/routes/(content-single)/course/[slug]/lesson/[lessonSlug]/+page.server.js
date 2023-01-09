import { getLessonBySlug } from '$lib/server/content';
import { ContentType } from '$lib/types';

const contentType = ContentType.lesson;

/**
 * @type {import('./$types').PageServerLoad}
 * */
export async function load({ params }) {
	return {
		contentType,
		content: await getLessonBySlug(params.slug, params.lessonSlug)
	};
}
