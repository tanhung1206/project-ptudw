document.addEventListener("DOMContentLoaded", () => {
    const usernameField = document.getElementById("username");
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirm-password");
    const submitButton = document.getElementById("submit-button");

    // Error Elements
    const usernameError = document.createElement("div");
    usernameError.className = "text-danger mt-1";
    usernameField.parentNode.appendChild(usernameError);

    const emailError = document.createElement("div");
    emailError.className = "text-danger mt-1";
    emailField.parentNode.appendChild(emailError);

    const passwordError = document.createElement("div");
    passwordError.className = "text-danger mt-1";
    passwordField.parentNode.appendChild(passwordError);

    const confirmPasswordError = document.createElement("div");
    confirmPasswordError.className = "text-danger mt-1";
    confirmPasswordField.parentNode.appendChild(confirmPasswordError);

    // Password Complexity Regex
    const complexityRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Debounce function to limit AJAX calls
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

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

    // Function to check availability via AJAX
    const checkAvailability = (field, type, errorElement) => {
    const value = field.value.trim();

    // If the field is empty, display a relevant message and disable the submit button
    if (!value) {
        errorElement.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} cannot be empty.`;
        submitButton.disabled = true;
        return;
    }

    // If the field is not empty, send the AJAX request to check availability
    fetch(`/user/check-availability?${type}=${encodeURIComponent(value)}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.available) {
                errorElement.textContent = "";
            } else {
                errorElement.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} is already taken.`;
            }
            updateSubmitButtonState();
        })
        .catch((err) => {
            console.error(`Error checking ${type} availability:`, err);
            errorElement.textContent = "An error occurred. Please try again.";
            submitButton.disabled = true;
        });
    };

    

    // Enable/Disable submit button
    const updateSubmitButtonState = () => {
        const isPasswordComplex = complexityRegex.test(passwordField.value);
        const doPasswordsMatch = passwordField.value === confirmPasswordField.value;
        const isUsernameValid = !usernameError.textContent;
        const isEmailValid = !emailError.textContent;

        submitButton.disabled = !(isPasswordComplex && doPasswordsMatch && isUsernameValid && isEmailValid);
    };

    // Event listeners for username and email fields
    usernameField.addEventListener("input", debounce(() => checkAvailability(usernameField, "username", usernameError), 300));
    emailField.addEventListener("input", debounce(() => checkAvailability(emailField, "email", emailError), 300));

    // Event listeners for password validation
    passwordField.addEventListener("input", () => {
        validatePasswordComplexity();
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

    // Reset form logic
    document.querySelector("form").addEventListener("reset", () => {
        usernameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
        submitButton.disabled = true;
    });
});
