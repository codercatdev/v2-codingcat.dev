import { listContent } from '$lib/server/content';
import { ContentType } from '$lib/types';

const contentType = ContentType.language;

/**
 * @type {import('./$types').PageServerLoad}
 * */
export async function load() {
	return {
		contentType,
		...(await listContent({ contentType }))
	};
}
