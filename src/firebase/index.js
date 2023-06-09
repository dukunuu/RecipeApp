import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FieldValue } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAnbXagHX63aQ37r0eRuPfBFCBERUHHxsY",
  authDomain: "recipeapp-b049b.firebaseapp.com",
  projectId: "recipeapp-b049b",
  storageBucket: "recipeapp-b049b.appspot.com",
  messagingSenderId: "819422392044",
  appId: "1:819422392044:web:5c531edc999b237015ffc9",
  measurementId: "G-9X51W8MDM4"
};

initializeApp(firebaseConfig);

const auth=getAuth();
const db=getFirestore();
const timestamp=FieldValue.serverTimestamp;

export {auth, db}
