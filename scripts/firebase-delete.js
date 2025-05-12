import { auth, db } from "./firebase-init.js";
import { deleteUser } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const deleteBtn = document.getElementById("delete_account_button");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", deleteUserAccount);
    }
});

async function deleteUserAccount() {
    const user = auth.currentUser;

    if (!user) {
        alert("No user is currently logged in.");
        return;
    }

    try {
        const confirmed = confirm("Are you sure you want to delete your account? This cannot be undone.");
        if (!confirmed) 
            return;

        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(user);
        alert("Your account has been deleted.");
        window.location.href = "../index.html";
    } catch (error) {
        console.error("Error deleting user:", error);

        if (error.code === 'auth/requires-recent-login') {
            alert("Please log in again to delete your account.");
            window.location.href = "../index.html";
        } else {
            alert("Account deletion failed.");
        }
    }
}