export function submitForm(e) {
    e.preventDefault();

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB6x6Cdjr3oX4Boti45vo-zs7Fe4XN13z0";

    const course_objective = sessionStorage.getItem("course_objective");
    const user_goals = sessionStorage.getItem("user_goals");
    const learning_style = sessionStorage.getItem("learning_style");
    const hours_free = document.getElementById('hours_free').value;

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
    1. Divide the curriculum into equal-length blocks that fill the entire timeframe.  
       • If the timeframe ≤ 7 days, use one block per **DAY**.  
       • If the timeframe ≤ 4 weeks (> 7 days), use one block per **WEEK**.  
       • If the timeframe ≤24 months (> 4 weeks), use one block per **MONTH** (rounding up).  
       • If the timeframe >24 months, use one block per **YEAR** (rounding up).
    
    2. For every block, list the concrete learning tasks.
    
    3. Use the tag system exactly as follows (case-sensitive).  
       Replace <PERIOD> with DAY, WEEK, MONTH, or YEAR as determined in step 1.  
       • One off tasks  
         [TASK][<PERIOD> X][NOREP]:<task description>
       • Recurring tasks  
         [TASK][<PERIOD> X][REP][DAYS|MONTHS|YEARS][<LENGTH>]:<task description>
         - <LENGTH> uses the format 30M, 1H, 90S, etc.
    
    4. Do not add any other tags.

    5. Tailor the amount and the content of the task depending on the inputs you got, adapt the content to users learning style.
    
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
    
    [TASK][WEEK 1][NOREP]:Set up skating journal and label goal pages
    [TASK][WEEK 1][REP][DAYS][30M]:Complete dynamic warm-up and balance drills
    [TASK][WEEK 2][NOREP]:Record final skills video and review progress
    
    PLEASE BEGIN THE CURRICULUM AFTER THIS LINE  
    ===========================================
    `;


    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "contents": [{
                "parts": [{"text": "Explain how AI Works"}]
            }] 
        })            
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return response.json();
    }).then(response => {
        console.log(response);
    })
}

var myform = document.getElementById("questionForm");

myform.addEventListener("submit", submitForm);