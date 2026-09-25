

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getFirestore
} from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {

    apiKey: "AIzaSyDQDs2SSBA9plVkfe0Sc7LTtD-OX_Vqf9E",

    authDomain:
    "meetpoint-007.firebaseapp.com",

    projectId:
    "meetpoint-007",

    storageBucket:
    "meetpoint-007.firebasestorage.app",

    messagingSenderId:
    "715755665227",

    appId:
    "1:715755665227:web:89d298868b93504cf09ace"
};

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

export { db };