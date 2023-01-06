import { getContentBySlug } from '$lib/server/content';
import { ContentType } from '$lib/types';

const contentType = ContentType.framework;

/**
 * @type {import('./$types').PageServerLoad}
 * */
export async function load({ params }) {
	return {
		contentType,
		content: await getContentBySlug(contentType, params.slug)
	};
}
