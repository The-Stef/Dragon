// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import firebaseConfig from "../config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore Database 

export async function signupWithEmail(event) {
  event.preventDefault(); // Prevent form refresh

  const firstName = document.getElementById("first_name").value;
  const lastName = document.getElementById("second_name").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("user_email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;
  const age = document.getElementById("age").value;
  const userType = document.getElementById("user_type").value;
  const interests = document.getElementById("interests").value;
  const agreeTerms = document.getElementById("agree_terms").checked;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (!agreeTerms) {
    alert("You must agree to the Terms and Privacy Policy.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Account Created:", user);

    await setDoc(doc(db, "users", user.uid), {
      firstName,
      lastName,
      username,
      email,
      age,
      userType,
      interests,
      createdAt: new Date(),
    });

    window.location.href = "../auth_pages/login_page.html"; // Redirect to login
  } catch (error) {
    console.error("Signup error:", error.message);
    alert(error.message);
  }
}

export async function loginWithEmail(event) {
  event.preventDefault(); // Prevent form refresh

  const email = document.getElementById("user_email").value;
  const password = document.getElementById("password").value;

  try {
    console.log("Attempting to log in...");

    // Sign in the user using Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User logged in:", user);

    // Retrieve user details from Firestore
    console.log("Fetching user details from Firestore...");
    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      console.error("User data not found in Firestore.");
      alert("User data not found. Please contact support.");
      return;
    }

    const userData = userSnapshot.data();
    console.log("User Data Retrieved:", userData);

    sessionStorage.setItem("user", JSON.stringify(userData));

    // Redirect to dashboard or user profile
    window.location.href = "../acc_pages/user_dashboard.html";

  } catch (error) {
    console.error("Login error:", error.message);
    alert(error.message);
  }
}

const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", signupWithEmail);
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", loginWithEmail);
}