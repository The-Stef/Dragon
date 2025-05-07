import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import firebaseConfig from "../config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function createCourse(course_id, ) {
    const database = getDatabase(app);
    set(ref(db, 'courses/' + course_id), {
        
    });    
}
