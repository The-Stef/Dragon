export function submitForm(e) {
    e.preventDefault();


    sessionStorage.getItem("")

    const query = `asd${lmao}`;


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

var myform = document.getElementById("myform");

myform.addEventListener("submit", submitForm);