import { listContent } from '$lib/server/content';
import { ContentType } from '$lib/types';
/**
 * @type {import('./$types').LayoutServerLoad}
 * */
export async function load() {
	return {
		course: await listContent(ContentType.post, 3),
		tutorial: await listContent(ContentType.tutorial, 3),
		// podcast: await listContent(ContentType.podcast, 3),
		post: await listContent(ContentType.post, 3)
	};
}
