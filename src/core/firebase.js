import firebase from '@firebase/app/dist/index.esm';
import '@firebase/firestore/dist/index.esm';

firebase.initializeApp(JSON.parse(process.env.FIREBASE_CONFIG));

export { firebase };
