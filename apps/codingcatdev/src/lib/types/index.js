/**
 * @typedef {Object} Content
 * @property {string} id
 * @property {string=} content
 * @property {string=} cover
 * @property {string=} excerpt
 * @property {string=} preview
 * @property {typeof ContentPublished= } published
 * @property {string=} section
 * @property {string=} slug
 * @property {typeof import("firebase-admin/firestore").Timestamp | null } start
 * @property {typeof import("firebase-admin/firestore").Timestamp | null } end
 * @property {string=} title
 * @property {string=} weight
 * @property {Author[]=} authors
 */

/**
 * @typedef {Object} Author
 * @property {string} id
 * @property {string=} displayName
 * @property {string=} slug
 */

/**
 * Enum for Content Types.
 * @readonly
 * @enum {string}
 */
export const ContentType = {
	post: 'post',
	tutorial: 'tutorial',
	podcast: 'podcast',
	course: 'course',
	lesson: 'lesson',
	page: 'page',
	group: 'group',
	forum: 'forum'
};

/**
 * Enum for Content Types.
 * @readonly
 * @enum {string}
 */
export const ContentPublished = {
	archived: 'archived',
	draft: 'draft',
	published: 'published'
};
