var firebase = require('firebase');

const firebaseConfig = {
  apiKey: "AIzaSyCmhdiTsK3CeQkQjDCUo0dv8e-vyiS66CI",
  authDomain: "reviewyourcollege-28526.firebaseapp.com",
  projectId: "reviewyourcollege-28526",
  storageBucket: "reviewyourcollege-28526.appspot.com",
  messagingSenderId: "713887718176",
  appId: "1:713887718176:web:9a13db3e0dbdc3ff7a1545",
  measurementId: "G-DNKPBB83HP"
};

export var app = firebase.default.initializeApp(firebaseConfig);
