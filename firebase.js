import firebase from "firebase/app";
import { firebaseConfig } from "./config";

export const firebaseapp = firebase.initializeApp(firebaseConfig);
