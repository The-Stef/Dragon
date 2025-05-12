import { createCourse } from "./firebase-db.js"
import { collection, where, addDoc, query, getDocs, doc, getDoc} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

function generateTask() {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB6x6Cdjr3oX4Boti45vo-zs7Fe4XN13z0";

    const searchParams = new URLSearchParams(window.location.search);
    let course_id = searchParams.get("id");

    const query = `You are an expert resource finder and instructor.

        ## GOAL

        Given a certain task and course description, find relevant resources that a learner can go and learn more about the task and how to tackle it.

        ## INPUTS

        - Course Description: <DESCRIPTION>
        - Task: <TASK>

        ## OUTPUT REQUIREMENTS

        1. You should provide the result in JSON.
        2. You should not say anything else besides the JSON.
        3. JSON should contain five “resource” elements.
        4. Each “resource” element contains an “id”, numbered starting from 0.
        5. Each “resource” element contains a “title”, which is the title of the resource.
        6. Each “resource” element contains a “url”, which is the link to the resource.

        ## EXAMPLE

        (Treat this as an example only. Replace with actual content.)

        [
          {
            "id": 0,
            "title": "Road signs in Germany - Wikipedia",
            "url": "https://en.wikipedia.org/wiki/Road_signs_in_Germany"
          },
          {
            "id": 1,
            "title": "Traffic signs and signals in Germany - Local Worldwide Relocation",
            "url": "https://local-worldwide.com/wp-content/uploads/2021/05/SettlingIn_Traffic-signs-and-signals-in-Germany.pdf"
          },
          {
            "id": 2,
            "title": "How to read signage at German train stations | Fotoeins Fotografie",
            "url": "https://fotoeins.com/2015/02/16/how-to-read-signage-at-german-rail-stations/"
          },
          {
            "id": 3,
            "title": "Essential German Phrases for Shopping - Olesen Tuition",
            "url": "https://www.olesentuition.co.uk/single-post/essential-german-phrases-for-shopping"
          },
          {
            "id": 4,
            "title": "Category:Diagrams of road signs of Germany - Wikimedia Commons",
            "url": "https://commons.wikimedia.org/wiki/Category:Diagrams_of_road_signs_of_Germany"
          }
        ]`;


    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "contents": [{
                "parts": [{"text": `${query}`}]
            }] 
        })            
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return response.json();
    }).then(async response => {
        // Remove extra, non-json text
        const tasks = response.candidates[0].content.parts[0].text
        const sanitized_tasks = curriculum.replace(/```json|```/g, "").trim();
        const json_tasks = JSON.parse(sanitized_curriculum);
    
        try {
            sessionStorage.setItem(tasks, json_tasks);
            window.location.href("../course_components/required_reading.html");
        }
        catch(e) {
            console.log("ERROR: " + e);
        }
    })
}

generateTask();