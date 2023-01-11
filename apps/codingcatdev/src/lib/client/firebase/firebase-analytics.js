import app from '$lib/client/firebase/firebase-app';
import { getAnalytics } from 'firebase/analytics';

export const firebaseAnalytics = () => {
	return getAnalytics(app);
};
