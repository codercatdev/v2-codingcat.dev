import { listContent } from '$lib/server/content';
import { ContentType } from '$lib/types';
/**
 * @type {import('./$types').PageServerLoad}
 * */
export async function load() {
	return {
		...(await listContent({ contentType: ContentType.framework }))
	};
}
