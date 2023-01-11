import { getContentBySlug } from '$lib/server/content';
import { ContentType } from '$lib/types';
import { error } from '@sveltejs/kit';

const contentType = ContentType.tutorial;

/**
 * @type {import('./$types').PageServerLoad}
 * */
export async function load({ params }) {
	const content = await getContentBySlug(ContentType.page, params.slug);
	if (!content) {
		throw error(404, {
			message: 'Not found'
		});
	}
	return {
		contentType,
		content
	};
}
