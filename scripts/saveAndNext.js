function saveAndNext(itemHandle, nextPage) {
    sessionStorage.setItem(itemHandle, input);
    window.location.href(nextPage);
}

document.getElementById("questionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = 
    document.getElementById("questionForm").name
});

