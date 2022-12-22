import { getContentBySlug } from '$lib/server/content';
import { ContentType } from '$lib/types';

/**
 * @type {import('./$types').PageServerLoad}
 * */
export async function load({ params }) {
	return {
		content: await getContentBySlug(ContentType.post, params.slug)
	};
}
