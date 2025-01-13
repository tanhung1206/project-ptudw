document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reset-password-form");
  const passwordField = document.getElementById("password");
  const confirmPasswordField = document.getElementById("confirmPassword");
  const passwordError = document.getElementById("password-error");
  const confirmPasswordError = document.getElementById("confirmPassword-error");

  // Regex kiểm tra độ phức tạp của mật khẩu
  const complexityRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Kiểm tra độ phức tạp của mật khẩu
  const validatePasswordComplexity = () => {
    const isPasswordComplex = complexityRegex.test(passwordField.value);
    passwordError.textContent = isPasswordComplex
      ? ""
      : "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.";
    return isPasswordComplex;
  };

  // Kiểm tra xác nhận mật khẩu
  const validatePasswordMatch = () => {
    const doPasswordsMatch = passwordField.value === confirmPasswordField.value;
    confirmPasswordError.textContent = doPasswordsMatch
      ? ""
      : "Passwords do not match.";
    return doPasswordsMatch;
  };

  // Xử lý sự kiện Submit
  form.addEventListener("submit", (e) => {
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    const isPasswordComplex = validatePasswordComplexity();
    const doPasswordsMatch = validatePasswordMatch();

    if (!isPasswordComplex || !doPasswordsMatch) {
      e.preventDefault();
    }
  });

  // Kiểm tra khi người dùng nhập
  passwordField.addEventListener("input", validatePasswordComplexity);
  confirmPasswordField.addEventListener("input", validatePasswordMatch);

  // Xử lý ẩn/hiện mật khẩu
  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
      const inputField = button.closest(".input-group").querySelector("input");
      const isPassword = inputField.type === "password";

      inputField.type = isPassword ? "text" : "password";

      const icon = button.querySelector("i");
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    });
  });
});
