# Monorepo for CodingCat.dev

## Content

Content is the key component to all of CodingCat.dev. It is what allows us to learn, build and teach in public. By adding to are updating data in the `/content` folder this updates our Firestore instance which the site pulls from its data. We use Firestore as a cache mechanism, as GitHub's API limits would not suffice for running SSR in production at the scale we want to achieve (even with caching).

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) to create content for the site and get data properly merged for production.

## Local Setup

At the root of the project run the command `pnpm install`, this will install for all of the pnpm workspaces.
If you need to add a workspace see `pnpm-workspace.yaml`.

## Local Development

### Emulating Firebase

If you don't need to load data or change the database in anyway you can skip this.
In order to use your personal GitHub Token set `GH_TOKEN` in `apps/firebase/functions/.secret.local`

> Recommended to use separate terminal windows
At the root of the project run the command `pnpm serve`. This will run firestore, pub/sub, and functions locally found in `apps/firebase`. 

### Running SvelteKit

At the root of the project run the command `pnpm dev`. This will start the svelte project located in `apps/codingcatdev`.
If you don't need to use local data and are using the production data for firebase you won't need to change anything.

This will run Vite (which is what SvelteKit uses) on `http://localhost:5173`.

You can update necessary environment variables by using [Vite's Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html)

You can pull the `.env` file from vercel if you have access, using command `vercel env pull`. If you have not linked the command line use `vercel link`.
**Example .env.local**
```
// Firebase
PUBLIC_FB_API_KEY=AIzaSyAH4WJbO4q6weGVfTOEpXIORLM2luvkO6g
PUBLIC_FB_AUTH_DOMAIN=v2-codingcatdev-main.firebaseapp.com
PUBLIC_FB_PROJECT_ID=v2-codingcatdev-main
PUBLIC_FB_STORAGE_BUCKET=v2-codingcatdev-main.appspot.com
PUBLIC_FB_MESSAGE_SENDER_ID=973514708807
PUBLIC_FB_APP_ID=1:973514708807:web:487f024fb4d3b8e94b9e62
PUBLIC_FB_MEASUREMENT_ID=G-08V9BVCSP6
```

## GitHub to Firebase Integration

### github-addContentNightly(us-central1)

Allows for all of the data found in `/content` to be added to Firestore triggering `pub/sub` for `addItemToFirestore`
### github-webhook(us-central1)

Takes payload from GitHub `push` at the org level. Currently filtering on just this repo.
Creates multiple `pub/sub` triggers to either `addItemToFirestoreFromWebhook` or `removeItemFromFirestoreFromWebhook` based on the committed files found only at the `/content` path. This needs to be a fast function and only trigger the other `pub/sub` functions.

### github-addItemToFirestoreFromWebhook(us-central1)

Looks up given file path and passes data to `addItemToFirestore`, can handle multiple commits with multiple files. Currently just using the default 30 from API, so if there is something larger this will hopefully be caught by the nightly routine.
### github-removeItemFromFirestoreFromWebhook(us-central1)

Directly removes firestore documents found at a given path.
### github-addItemToFirestore(us-central1)

Looks up the binary data from the markdown, converts to ASCII and pulls frontmatter into metadata then updates Firestore.
