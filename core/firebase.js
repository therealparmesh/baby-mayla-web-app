import firebase from 'firebase/app';
import 'firebase/firestore';

try {
  firebase.initializeApp(JSON.parse(process.env.FIREBASE_CONFIG));
} catch (e) {
  console.error(e.message);
}

export { firebase };
