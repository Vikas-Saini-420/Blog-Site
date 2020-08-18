//jshint esversion :8
const firebase = require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyAoTD_f2lrOkYLpcnNTCo5ezjAo2FRApYg",
    authDomain: "inner-exchange-279404.firebaseapp.com",
    databaseURL: "https://inner-exchange-279404.firebaseio.com",
    projectId: "inner-exchange-279404",
    storageBucket: "inner-exchange-279404.appspot.com",
    messagingSenderId: "55753799754",
    appId: "1:55753799754:web:54bb4ae1aa7aadabb54eb3",
    measurementId: "G-5J5Z9Q9L4Y"
  };
  const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export {db, auth, storage};
