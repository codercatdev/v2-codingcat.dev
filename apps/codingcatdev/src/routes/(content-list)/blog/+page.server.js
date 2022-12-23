import { listContent } from '$lib/server/content';
import { ContentType } from '$lib/types';
/**
 * @type {import('./$types').PageServerLoad}
 * */
export async function load() {
	return {
		list: await listContent(ContentType.post)
	};
}
