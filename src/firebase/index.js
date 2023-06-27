import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FieldValue } from "firebase/firestore";
const firebaseConfig = {
  //Firebase config
};

initializeApp(firebaseConfig);

const auth=getAuth();
const db=getFirestore();
const timestamp=FieldValue.serverTimestamp;

export {auth, db}
