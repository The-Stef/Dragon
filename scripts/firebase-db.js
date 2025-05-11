import { auth, db } from "./firebase-init.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

let currentUID = null;

onAuthStateChanged(auth, (user) => {
    try{
        if (user) {
        currentUID = user.uid;
        console.log("User authenticated:", currentUserUID);
        } else {
            console.warn("No authenticated user. Redirecting to login.");
            window.location.href = "../auth_pages/login_page.html";
        }
    } catch(e) {
        console.log("ERROR: " + e);
    }
    
});

async function createCourse(courseName, objective, desiredLength, learningStyle, userGoals, curriculum) {
    try {
        const course = await addDoc(collection(db, "courses"), {
            course_name: courseName,
            course_objective: objective,
            desired_length: desiredLength,
            learning_style: learningStyle,
            user_goals: userGoals,
            curriculum: curriculum,
            created_by_user: currentUID
        });
        console.log("Course created! ID: ", course.id);
        window.location.href = "../../acc_pages/user_dashboard.html"
        return course.id;
    } catch (e) {
        console.log("ERROR:");
        console.error(e);
    }
}

async function getCourseList() {

}

export { createCourse };