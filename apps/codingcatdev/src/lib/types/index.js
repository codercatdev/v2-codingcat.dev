/**
 * @typedef {Object} Content
 * @property {string} id
 * @property {Author[]=} authors
 * @property {boolean} cloudinary_convert
 * @property {string=} content
 * @property {string=} cover
 * @property {string=} devto
 * @property {string=} excerpt
 * @property {string=} hashnode
 * @property {string=} preview
 * @property {typeof ContentPublished= } published
 * @property {string=} section
 * @property {string=} slug
 * @property {typeof import("firebase-admin/firestore").Timestamp | null } start
 * @property {typeof import("firebase-admin/firestore").Timestamp | null } end
 * @property {string=} title
 * @property {number=} weight
 * @property {string=} youtube
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
	course: 'course',
	framework: 'framework',
	forum: 'forum',
	group: 'group',
	language: 'language',
	lesson: 'lesson',
	page: 'page',
	podcast: 'podcast',
	post: 'post',
	tutorial: 'tutorial'
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

/**
 * @typedef {Object} BasePodcast
 * @property {boolean} chapters_done
 * @property {number=} episode
 * @property {string=} recording_date
 * @property {('idea' | 'scheduled' | 'recorded' | 'failed')} status
 * @property {('CodingCat.dev')} podcast
 * @property {number=} season
 * @property {string=} spotify
 */

/**
 * @typedef {Content & BasePodcast} Podcast
 */
