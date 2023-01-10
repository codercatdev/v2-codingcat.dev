/**
 * @typedef {Object} Content
 * @property {string} id
 * @property {Author[]=} authors
 * @property {boolean=} cloudinary_convert
 * @property {string=} content
 * @property {string=} courseSlug
 * @property {string=} cover
 * @property {string=} devto
 * @property {string=} excerpt
 * @property {string=} hashnode
 * @property {Content[]=} lesson
 * @property {string=} preview
 * @property {typeof ContentPublished= } published
 * @property {string=} section
 * @property {string=} slug
 * @property {Date} start
 * @property {string=} title
 * @property {number=} weight
 * @property {string=} youtube
 */

/**
 * @typedef {Content[]} ContentList
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
 * Array of ContentTypes
 * @readonly
 * @return {string[]}
 */
export const getContentTypes = () => {
	return Object.keys(ContentType);
};

/**
 * Array of ContentTypes Plural
 * @readonly
 * @return {Map<string,string>}
 */
export const getContentTypePlurals = () => {
	const map = new Map();
	Object.keys(ContentType).map((t) => map.set(t, t === ContentType.post ? 'blog' : t + 's'));
	return map;
};

/**
 * Array of ContentTypes Plural
 * @readonly
 * @param {string} contentType
 * @return {string | undefined}
 */
export const getContentTypePlural = (contentType) => {
	return getContentTypePlurals().get(contentType);
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
