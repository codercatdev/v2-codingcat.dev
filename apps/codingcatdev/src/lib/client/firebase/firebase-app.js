import { initializeApp, getApps } from 'firebase/app';
import {
	PUBLIC_FB_API_KEY,
	PUBLIC_FB_AUTH_DOMAIN,
	PUBLIC_FB_PROJECT_ID,
	PUBLIC_FB_STORAGE_BUCKET,
	PUBLIC_FB_MESSAGE_SENDER_ID,
	PUBLIC_FB_APP_ID,
	PUBLIC_FB_MEASUREMENT_ID
} from '$env/static/public';

const firebaseConfig = {
	apiKey: PUBLIC_FB_API_KEY,
	authDomain: PUBLIC_FB_AUTH_DOMAIN,
	projectId: PUBLIC_FB_PROJECT_ID,
	storageBucket: PUBLIC_FB_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FB_MESSAGE_SENDER_ID,
	appId: PUBLIC_FB_APP_ID,
	measurementId: PUBLIC_FB_MEASUREMENT_ID
};

let app = getApps().at(0);
if (!app) {
	app = initializeApp(firebaseConfig);
}
export default app;
