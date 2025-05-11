import { createCourse } from "./firebase-db.js"

function submitForm() {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB6x6Cdjr3oX4Boti45vo-zs7Fe4XN13z0";

    const course_objective = sessionStorage.getItem("course_objective");
    const user_goals = sessionStorage.getItem("user_goals");
    const learning_style = sessionStorage.getItem("learning_style");
    const hours_free = sessionStorage.getItem("hours_free");

    const query = `You are an expert instructional designer.

    GOAL
    -----
    Create a self-study curriculum that takes a learner from their  
    current level (assume absolute beginner) to a well-defined target  
    competence in the specified time frame.
    
    INPUTS
    ------
    - Subject: ${course_objective}  
    - Time frame: ${hours_free} (e.g. “10 days”, “6 months”, “3 years”)
    - User Goal: ${user_goals}  
    - User Learning Style: ${learning_style}
    
    OUTPUT REQUIREMENTS
    -------------------
    1. You should provide the result in JSON.
    
    2. You should not say anything else besides the JSON.

    3. Divide the curriculum into equal-length blocks that fill the entire timeframe.  
       • If the timeframe ≤ 7 days, use one block per **DAY**.  
       • If the timeframe ≤ 4 weeks (> 7 days), use one block per **WEEK**.  
       • If the timeframe ≤24 months (> 4 weeks), use one block per **MONTH** (rounding up).  
       • If the timeframe >24 months, use one block per **YEAR** (rounding up).
    
    4. For every block, list the concrete learning tasks. 
    
    5. Your JSON should contain a list, which has an object for each time period. These objects should contain the fields:
        • period: This is the period on which the tasks should be done, such as day 1, week 1, month 3 etc. It has the fields:
            • periodType: This is "DAY", "WEEK", "MONTH", or "YEAR".
            • number: Which period is it. For Day 1, this field should be 1.
        • tasks: This is a list. It should contain the task objects described below. 
    
    6. Each task should have contain:
        • repeat: Whether the task should be repeated over time during the time frame. This is "true" or "false".
        • frequency: How often the task is repeated. This can be "DAY", "WEEK", "MONTH", "YEAR", or "NA" if the task is not repeated.  
        • length: How long this task should take. This uses the format 30M, 1H, 90S, etc.. 
        • description: This is the task description itself.
    
    7. Do not add any other fields or modifications.

    8. Tailor the amount and the content of the task depending on the inputs you got, adapt the content to users learning style.
    
    LEVEL OF DETAIL
    ---------------
    • Provide enough detail that an independent learner knows what to do, but keep task sentences under 25 words.
    
    TONE
    ----
    • Write in clear, motivational language.  
    • Avoid jargon unless it is unavoidable in the subject matter.
    
    EXAMPLE
    --------
    *(Treat this as an example only. Replace with actual content.)*
    
    [
    {
        "period": {
        "periodType": "WEEK",
        "number": 1
        },
        "tasks": [
        {
            "repeat": true,
            "frequency": "DAY",
            "length": "30M",
            "description": "Watch animated video introducing the Rubik’s Cube notation and structure."
        },
        {
            "repeat": true,
            "frequency": "DAY",
            "length": "30M",
            "description": "Practice identifying and naming cube pieces using color-coded diagrams."
        },
        {
            "repeat": false,
            "frequency": "NA",
            "length": "1H",
            "description": "Follow a visual step-by-step tutorial to solve the white cross."
        },
        {
            "repeat": false,
            "frequency": "NA",
            "length": "1H",
            "description": "Complete your first full beginner’s method solve with a video walkthrough."
        }
        ]
    },
    {
        "period": {
        "periodType": "WEEK",
        "number": 2
        },
        "tasks": [
        {
            "repeat": true,
            "frequency": "DAY",
            "length": "1H",
            "description": "Practice solving using beginner’s method with visual aid until you can solve without it."
        },
        {
            "repeat": true,
            "frequency": "DAY",
            "length": "15M",
            "description": "Use online simulator to reinforce algorithm visualization without a physical cube."
        },
        {
            "repeat": false,
            "frequency": "NA",
            "length": "45M",
            "description": "Watch video explaining F2L (First Two Layers) and compare it to beginner’s method."
        },
        {
            "repeat": false,
            "frequency": "NA",
            "length": "45M",
            "description": "Try solving first pairs using F2L from slow-motion visuals."
        }
        ]
    },
    {
        "period": {
        "periodType": "WEEK",
        "number": 3
        },
        "tasks": [
        {
            "repeat": true,
            "frequency": "DAY",
            "length": "1H",
            "description": "Practice full solve using F2L with visual breakdown per step."
        },
        {
            "repeat": true,
            "frequency": "DAY",
            "length": "30M",
            "description": "Drill OLL (Orientation of Last Layer) cases using visual flashcards and mirror cube viewer."
        },
        {
            "repeat": true,
            "frequency": "DAY",
            "length": "15M",
            "description": "Use timer app to track solve times and note sticking points."
        },
        {
            "repeat": false,
            "frequency": "NA",
            "length": "1H",
            "description": "Learn and practice PLL (Permutation of Last Layer) with annotated slow-motion videos."
        }
        ]
    },
    {
        "period": {
        "periodType": "WEEK",
        "number": 4
        },
        "tasks": [
        {
            "repeat": true,
            "frequency": "DAY",
            "length": "1H",
            "description": "Drill full CFOP method solves using visual aids, aiming for consistency and speed."
        },
        {
            "repeat": true,
            "frequency": "DAY",
            "length": "30M",
            "description": "Record solves and visually analyze turning efficiency and finger tricks."
        },
        {
            "repeat": true,
            "frequency": "DAY",
            "length": "30M",
            "description": "Watch pro solve videos and mimic finger tricks and flow visually."
        },
        {
            "repeat": false,
            "frequency": "NA",
            "length": "1H",
            "description": "Create a personal improvement plan based on visual review of recorded solves."
        }
        ]
    }
    ]
    
    PLEASE BEGIN THE CURRICULUM AFTER THIS LINE  
    ===========================================
    `;


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
        const curriculum = response.candidates[0].content.parts[0].text
        const sanitized_curriculum = curriculum.replace(/```json|```/g, "").trim();

        const title = "How To : " + course_objective;
        try {
            await createCourse(title, course_objective, hours_free, learning_style, user_goals, sanitized_curriculum); }
        catch(e) {
            console.log("ERROR: " + e);
        }
    })
}

submitForm();