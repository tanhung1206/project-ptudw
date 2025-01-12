// Khởi tạo Firebase bằng cách sử dụng các đối tượng từ CDN
const firebaseConfig = {
  apiKey: "AIzaSyCIryie8qTPoxiItEPVZ5m07FLyI7OgP1w",
  authDomain: "eshopper-4ff67.firebaseapp.com",
  projectId: "eshopper-4ff67",
  storageBucket: "eshopper-4ff67.firebasestorage.app",
  messagingSenderId: "142447375719",
  appId: "1:142447375719:web:a038ea7b5b7559adebebc2",
  measurementId: "G-7XR7ZBYG2X",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener("DOMContentLoaded", () => {
  // Toggle password visibility
  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", function () {
      const inputField = this.closest(".input-group").querySelector("input");
      const isPassword = inputField.type === "password";
      inputField.type = isPassword ? "text" : "password";
      this.querySelector("i").classList.toggle("fa-eye");
      this.querySelector("i").classList.toggle("fa-eye-slash");
    });
  });
  // Google Login Button Handler
  const googleLoginButton = document.querySelector(".btn-google-login");
  if (googleLoginButton) {
    googleLoginButton.addEventListener("click", async () => {
      console.log("Google Login Button Clicked");
      try {
        const provider = new firebase.auth().GoogleAuthProvider();
        const result = await auth().signInWithPopup(provider);

        // Nhận token từ Firebase
        const token = await result.user.getIdToken();
        console.log("Firebase ID Token:", token);

        // Gửi token đến server để xác thực và ánh xạ user
        const response = await fetch("/user/google-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (data.success) {
          window.location.href = "/";
        } else {
          console.error("Login failed:", data.message);
          alert(data.message);
        }
      } catch (error) {
        console.error("Google Login Error:", error);
        alert("Login with Google failed.");
      }
    });
  }
});
