document.addEventListener("DOMContentLoaded", () => {
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirm-password");
    const submitButton = document.getElementById("submit-button");

    const passwordError = document.createElement("div");
    passwordError.className = "text-danger mt-1";
    passwordField.parentNode.appendChild(passwordError);

    const confirmPasswordError = document.createElement("div");
    confirmPasswordError.className = "text-danger mt-1";
    confirmPasswordField.parentNode.appendChild(confirmPasswordError);

    // Password Complexity Regex
    const complexityRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Function to validate password complexity
    const validatePasswordComplexity = () => {
        const isPasswordComplex = complexityRegex.test(passwordField.value);
        passwordError.textContent = isPasswordComplex
            ? ""
            : "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.";
    };

    // Function to validate password confirmation
    const validatePasswordMatch = () => {
        const doPasswordsMatch = passwordField.value === confirmPasswordField.value;
        confirmPasswordError.textContent = doPasswordsMatch
            ? ""
            : "Passwords do not match.";
    };

    // Enable/Disable submit button
    const updateSubmitButtonState = () => {
        const isPasswordComplex = complexityRegex.test(passwordField.value);
        const doPasswordsMatch = passwordField.value === confirmPasswordField.value;
        submitButton.disabled = !isPasswordComplex || !doPasswordsMatch;
    };

    // Event listeners for password validation
    passwordField.addEventListener("input", () => {
        validatePasswordComplexity();
        updateSubmitButtonState();
    });

    // Trigger "Passwords do not match" only after clicking into confirmPasswordField
    confirmPasswordField.addEventListener("focus", () => {
        validatePasswordMatch();
        updateSubmitButtonState();
    });

    confirmPasswordField.addEventListener("input", () => {
        validatePasswordMatch();
        updateSubmitButtonState();
    });

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
