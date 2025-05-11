import { db } from "./firebase-init.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

async function createCourse(courseName, objective, desiredLength, learningStyle, userGoals, curriculum) {
    try {
        const course = await addDoc(collection(db, "courses"), {
            course_name: courseName,
            course_objective: objective,
            desired_length: desiredLength,
            learning_style: learningStyle,
            user_goals: userGoals,
            curriculum: curriculum
        });
        console.log("Course created! ID: ", course.id);
        return course.id;
    } catch (e) {
        console.log("ERROR:");
        console.error(e);
    }
}

async function getCourseList() {

}

export { createCourse };