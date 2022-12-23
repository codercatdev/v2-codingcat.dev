# Making State Management Domain Agnostic with @derxjs

episode: 50
Guest: https://www.notion.so/Zack-DeRose-5206593162664ef5b2bdec518d6da009
recording_date: November 5, 2021 10:00 AM
season: 1
status: released
podcast: CodingCat.dev
streamyard: https://streamyard.com/vsg8x33m3v
chapters_done: true
cloudinary_convert: false
devto: https://dev.to/codingcatdev/150-making-state-management-domain-agnostic-with-derxjs-1dh2
excerpt: We sit down with Zack DeRose to talk all about @derxjs. We also break down RxJS and its ability to elegantly compose domain-agnostic state management code.
hashnode: https://hashnode.codingcat.dev/podcast-1-50-making-state-management-domain-agnostic-with-derxjs
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=podcast&selectionSlug=1-50-making-state-management-domain-agnostic-with-derxjs&_id=fc0e76a0f5c6480f86e30d544cd90d95
slug: 1-50-making-state-management-domain-agnostic-with-derxjs
spotify: https://open.spotify.com/episode/2KyQO8i1jGbn1zQcTxZ5Ho?si=EpqYq5w8Rm6JFe_d5vTbRg
start: December 15, 2021
youtube: https://www.youtube.com/watch?v=o12i7Ijveow

## Questions

1. **First tell us a little about yourself and your background.**
    1. Senior Engineer and Engineering Manager at Nrwl
    2. Father of 6, Grandfather of 2
    3. Enthusiast for writing/podcasting/oss/other forms of communication (tech or otherwise)
    4. Co-founder DeRose Brothers Real Estate
2. What was your motivation to create @derxjs?
    1. I'm extremely "long" on RxJS - in particular in its ability to elegantly compose domain-agnostic state management code.
    2. derxjs is a way of packaging that power in a way that separates "state" concerns with "view" concerns (the `DeRxJSViewModel` interface)
    3. derxjs/reducer is our first package for assisting folks in writing domain agnostic state management (that harnesses the power of RxJS without actually writing any)
    4. derxjs/react is our first package on the other side of the `DeRxJSViewModel` interface - designed to help folks leverage RxJS in their react projects (again, without actually writing any RxJS code)
3. How does this differ from rxjs or Redux?
    1. This is a 'framework' (may be generous) for using RxJS - a 'spiritual successor' to NgRx
    2. derxjs/reducer should feel extremely familiar to anyone that's written NgRx or Redux code.
    3. Exciting things in the pipes from the "framework": declarative testing tools && ai powered code-generation

## Additional Links

- NPM `@derxjs/viewmodel` - [https://www.npmjs.com/package/@derxjs/view-model](https://www.npmjs.com/package/@derxjs/view-model)
- [https://www.npmjs.com/package/@derxjs/react](https://www.npmjs.com/package/@derxjs/react)
- [https://www.npmjs.com/package/@derxjs/reducer](https://www.npmjs.com/package/@derxjs/reducer)
- GitHub - [https://github.com/ZackDeRose/derxjs](https://github.com/ZackDeRose/derxjs)
- Part1 - [https://dev.to/zackderose/the-derxjsviewmodel-pattern-the-e-mc-2-of-state-management-part-1-3dka](https://dev.to/zackderose/the-derxjsviewmodel-pattern-the-e-mc-2-of-state-management-part-1-3dka)
- Part2 - [https://dev.to/zackderose/the-derxjsviewmodel-pattern-the-emc2-of-state-management-part-2-2i73](https://dev.to/zackderose/the-derxjsviewmodel-pattern-the-emc2-of-state-management-part-2-2i73)