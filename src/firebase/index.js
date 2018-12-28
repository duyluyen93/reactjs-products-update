import * as firebase from 'firebase/app';

const config = {
  apiKey: "AIzaSyCK6oR1ld6t4krLpznmx_02tZPgymws1yo",
  authDomain: "project-1-ba7a7.firebaseapp.com",
  databaseURL: "https://project-1-ba7a7.firebaseio.com",
  projectId: "project-1-ba7a7",
  storageBucket: "project-1-ba7a7.appspot.com",
  messagingSenderId: "938241690600"
};
export const firebaseApp = firebase.initializeApp(config);