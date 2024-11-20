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
});
