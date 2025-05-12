import { auth, db } from "./firebase-init.js";
import { collection, where, addDoc, query, getDocs, doc, getDoc} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

let currentUID = null;

const courseListContainer = document.getElementById("course-list");
const template = document.getElementById("course-card-template");

onAuthStateChanged(auth, (user) => {
    try{
        if (user) {
        currentUID = user.uid;
        console.log("User authenticated:", currentUID);

        // Only fetch courses on course list page
        if (document.getElementById("course-list")) {
            getCourseList(user.uid);
        }

        // Only fetch user info on the profile page
        if (document.querySelector(".username-container")) {
            getUserInfo(user.uid);
        }

        // Only fetch courses on course list page
        if (document.querySelector(".recommended-reading")) {
            setReadingList();
        }


        // Course information on dashboard
        if (document.getElementById("course-indicator")) {
            const searchParams = new URLSearchParams(window.location.search);
            let course_id = searchParams.get("id");
            getPeriod(course_id);
        }

        if (document.querySelector(".course-info-container")) {
            const searchParams = new URLSearchParams(window.location.search);
            let course_id = searchParams.get("id");
            getCourse(course_id);

            document.querySelector(".course-start-button").addEventListener("click", () => {
                window.location.href = `../app/dashboard/index.html?id=${course_id}`;
            });
        }

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
            courseListContainer.innerHTML = "<div><form action=\"../app/course_creation/creation_1.html\" method=\"get\"> \
                        <button type=\"submit\" class=\"secondary_button\">Create New Course</button> \
                    </form></div>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const card = template.content.cloneNode(true);

            card.querySelector(".course-name").textContent = data.course_name;

            card.querySelector(".view-course-button").addEventListener("click", () => {
                window.location.href = `course_detail.html?id=${doc.id}`;
            });

            courseListContainer.appendChild(card);
        });
    } catch(e) {
        console.log("ERROR: " + e);
    }
}

async function getUserInfo(uid) {
    try{
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            console.log("User data:", userData);

            // Populate the DOM with user data
            const creationDate = userData.createdAt?.toDate?.();
            if (creationDate) {
                const options = { year: 'numeric', month: 'short' };
                const formattedDate = creationDate.toLocaleDateString('en-US', options);

                const memberSince = document.getElementById("the_date_itself");
                if (memberSince) {
                    memberSince.textContent = formattedDate;
                }
            }

            document.querySelector(".username-container .text_header").textContent = userData.username;
            document.querySelector(".email-container .text_body").textContent = userData.email;
            document.querySelector(".two-box .text_body").textContent = userData.userType;
            document.getElementById("first-name").value = userData.firstName || "";
            document.getElementById("last-name").value = userData.lastName || "";
        } else {
            console.warn("No user document found.");
        }
    } catch(e) {
        console.log("ERROR: " + e);
    }
}

async function getCourse(course_id) {
    try{
        const docRef = doc(db, "courses", course_id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const courseData = docSnap.data();
            console.log("Course data:", courseData);

            const courseName = courseData.course_name;
            const curriculum = courseData.curriculum;
        
            let periodName;

            for (const period of curriculum) {
                if (period.complete === "false") {
                    periodName = period.periodName;
                    break;
                }
            }

            console.log("am here!");
            document.querySelector("#course-name").innerHTML = "Course: " + courseName || "";
            document.querySelector("#current-period").innerHTML = "Current Period: " + periodName || "";
        } else {
            console.warn("No user document found.");
        }
    } catch(e) {
        console.log("ERROR: " + e);
    }
}

async function getPeriod(course_id) {
    try{
        const docRef = doc(db, "courses", course_id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const courseData = docSnap.data();
            console.log("Course data:", courseData);

            const courseName = courseData.course_name;
            const curriculum = courseData.curriculum;
            const courseLength = courseData.desired_length;
        
            let periodName;

            for (const period of curriculum) {
                if (period.complete === "false") {
                    periodName = period.periodName;
                    const tasks = period.tasks;

                    const task_stringified = tasks.map(task => `<div class="list-item">
                                    <a class="task">
                                        <p class="normal-white small-text inter">${task.description}</span></p>
                                    </a>
                                </div>`)

                    document.querySelector(".app-container").innerHTML += `<div class="reading-container shiny-blue-container">
                        <div class="text-container">
                            <p class="shiny-blue small-title zen-dots">${period.periodType} ${period.number}</p>
                            <p class="shiny-blue small-title zen-dots">${period.periodName}</p>
                            <p class="normal-white small-text-margin inter" id="amount-readings">This period has ${period.tasks.length} tasks.</p>
                            <div class="list-container" id="task-list">
                            ${task_stringified.join("\n")}
                            </div>
                        </div>
                    </div>
                    `;
                }
            }

            var task_elements = document.getElementsByClassName("task");

            function generate_reading(course_name, task, href) {
                sessionStorage.setItem("courseName", course_name);
                sessionStorage.setItem("task", task);
                window.location.href = href;
            }

            for (const task of task_elements) {
                task.addEventListener("click", function (event) {
                    event.preventDefault();
                    generate_reading(courseName, task.textContent, "../utils/generate_reading.html");
                });
            }

            document.querySelector("#amount-readings").innerHTML = "" || "";
            document.querySelector("#course-name").innerHTML = " " + courseName || "";
            document.querySelector("#level-indicator").innerHTML = courseLength || "";

        } else {
            console.warn("No user document found.");
        }
    } catch(e) {
        console.log("ERROR: " + e);
    }
}

async function getReading(course_id) {
    try{
        const docRef = doc(db, "courses", course_id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const courseData = docSnap.data();
            console.log("Course data:", courseData);

            const courseName = courseData.course_name;
            const curriculum = courseData.curriculum;
            const courseLength = courseData.desired_length;
        
            let periodName;

            for (const period of curriculum) {
                if (period.complete === "false") {
                    periodName = period.periodName;
                    const tasks = period.tasks;

                    const task_stringified = tasks.map(task => `<div class="list-item">
                                    <a class="task">
                                        <p class="normal-white small-text inter">${task.description}</span></p>
                                    </a>
                                </div>`)

                    document.querySelector(".app-container").innerHTML += `<div class="reading-container shiny-blue-container">
                        <div class="text-container">
                            <p class="shiny-blue small-title zen-dots">${period.periodType} ${period.number}</p>
                            <p class="shiny-blue small-title zen-dots">${period.periodName}</p>
                            <p class="normal-white small-text-margin inter" id="amount-readings">This period has ${period.tasks.length} tasks.</p>
                            <div class="list-container" id="task-list">
                            ${task_stringified.join("\n")}
                            </div>
                        </div>
                    </div>
                    `;
                }
            }

            var task_elements = document.getElementsByClassName("task");

            function generate_reading(course_name, task, href) {
                sessionStorage.setItem("courseName", course_name);
                sessionStorage.setItem("task", task);
                window.location.href = href;
            }

            for (const task of task_elements) {
                task.addEventListener("click", function (event) {
                    event.preventDefault();
                    generate_reading(courseName, task.textContent, "../utils/generate_reading.html");
                });
            }

            document.querySelector("#amount-readings").innerHTML = "" || "";
            document.querySelector("#course-name").innerHTML = " " + courseName || "";
            document.querySelector("#level-indicator").innerHTML = courseLength || "";

        } else {
            console.warn("No user document found.");
        }
    } catch(e) {
        console.log("ERROR: " + e);
    }
}

async function setReadingList() {
    try {
        let task = sessionStorage.getItem("task");
        let readings = JSON.parse(sessionStorage.getItem("readings"));

        document.querySelector(".course-name").innerHTML = sessionStorage.getItem("courseName");
        document.getElementById("task-description").innerHTML = sessionStorage.getItem("task");

        const readings_stringified = readings.map(reading => 
            `
            <div class="reading-item shiny-blue-container-no-dim">
                <p class="normal-white inter">${reading.title}</p>
                <a href="${reading.url}">
                    <button class="primary_button">Read</button>
                </a>
            </div>
            `
        )

        document.querySelector(".reading-list").innerHTML += readings_stringified.join("\n");
    }   
    catch(e) {
        console.log("ERROR: " + e);
    }
}

export { createCourse };