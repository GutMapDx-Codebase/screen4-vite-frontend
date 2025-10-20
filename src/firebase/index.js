import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCzOTliKqjNZeZ-NLZqdV-_3miXolgLb88",
    authDomain: "your-gut-map-fa-lab.firebaseapp.com",
    projectId: "your-gut-map-fa-lab",
    storageBucket: "your-gut-map-fa-lab.appspot.com",
    messagingSenderId: "676426580196",
    appId: "1:676426580196:web:9ae513007b748f9323acf1",
    measurementId: "G-0LVJ73NLJF"
};

const app = initializeApp(firebaseConfig);
export const imageDb = getStorage(app)