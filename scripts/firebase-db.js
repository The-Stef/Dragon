import { auth, db } from "./firebase-init.js";
import { collection, where, addDoc, query, getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

let currentUID = null;

const courseListContainer = document.getElementById("course-list");
const template = document.getElementById("course-card-template");

onAuthStateChanged(auth, (user) => {
    try{
        if (user) {
        currentUID = user.uid;
        console.log("User authenticated:", currentUID);

        getCourseList(user.uid);
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
        window.location.href = "../../acc_pages/user_dashboard.html";
        return course.id;
    } catch (e) {
        console.log("ERROR:");
        console.error(e);
    }
}

async function getCourseList() {
    const q = query(collection(db, "courses"), where("created_by_user", "==", currentUID));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    });

    try {
        if (querySnapshot.empty) {
            courseListContainer.innerHTML = "<p>No courses found.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = template.content.cloneNode(true);

            card.querySelector(".course-name").textContent = data.course_name;

            card.querySelector(".view-course-button").addEventListener("click", () => {
                window.location.href = 'course_detail.html?id=${doc.id}';
            });

            courseListContainer.appendChild(card);
        });
    } catch(e) {
        console.log("ERROR: " + e);
    }
}

export { createCourse };