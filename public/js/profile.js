document.addEventListener("DOMContentLoaded", () => {
  const avatarInput = document.getElementById("avatar-input");
  const userAvatar = document.getElementById("user-avatar");
  const navbarAvatar = document.querySelector(".nav-item img");

  // Click on Avatar to Update
  userAvatar.addEventListener("click", () => {
    avatarInput.click();
  });

  avatarInput.addEventListener("change", async () => {
    const formData = new FormData();
    formData.append("avatar", avatarInput.files[0]);

    const response = await fetch("/user/update-avatar", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.message) {
      // Update avatar in the profile page
      userAvatar.src = result.avatar;

      // Update avatar in the navbar
      if (navbarAvatar) {
        navbarAvatar.src = `${result.avatar}?t=${new Date().getTime()}`;
      }

      alert(result.message);
    }
  });

  // Open Update Profile Modal
  document
    .getElementById("update-profile-button")
    .addEventListener("click", () => {
      $("#updateProfileModal").modal("show");
    });

  // Save Profile Changes
  document
    .getElementById("save-profile-button")
    .addEventListener("click", async () => {
      const firstname = document.getElementById("firstname").value.trim();
      const lastname = document.getElementById("lastname").value.trim();

      // Clear previous errors
      const firstnameError = document.getElementById("firstname-error");
      const lastnameError = document.getElementById("lastname-error");
      firstnameError.textContent = "";
      lastnameError.textContent = "";

      const nameRegex = /^[A-Z][a-z]*(?:\s+[A-Z][a-z]*)*$/;

      // Validate Firstname
      if (!nameRegex.test(firstname)) {
        firstnameError.textContent =
          "Firstname must start with an uppercase letter and contain only letters.";
        return;
      }

      // Validate Lastname
      if (!nameRegex.test(lastname)) {
        lastnameError.textContent =
          "Lastname must start with an uppercase letter and contain only letters.";
        return;
      }

      const response = await fetch("/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname }),
      });

      const result = await response.json();
      if (result.message) {
        alert(result.message);
        location.reload();
      } else if (result.error) {
        alert(result.error);
      }
    });

  // Open Change Password Modal
  document
    .getElementById("change-password-button")
    .addEventListener("click", () => {
      $("#changePasswordModal").modal("show");
    });

  // Clear form when Discard is clicked in Change Password Modal
  document
    .querySelector("#changePasswordModal .btn-secondary")
    .addEventListener("click", () => {
      document.getElementById("old-password").value = "";
      document.getElementById("new-password").value = "";
      document.getElementById("confirm-password").value = "";
      document.getElementById("old-password-error").textContent = "";
      document.getElementById("new-password-error").textContent = "";
      document.getElementById("confirm-password-error").textContent = "";
    });

  document
    .getElementById("save-password-button")
    .addEventListener("click", async () => {
      const oldPassword = document.getElementById("old-password").value.trim();
      const newPassword = document.getElementById("new-password").value.trim();
      const confirmPassword = document
        .getElementById("confirm-password")
        .value.trim();

      const oldPasswordError = document.getElementById("old-password-error");
      const confirmPasswordError = document.getElementById(
        "confirm-password-error"
      );
      const newPasswordError = document.getElementById("new-password-error");

      // Clear previous errors
      oldPasswordError.textContent = "";
      confirmPasswordError.textContent = "";
      newPasswordError.textContent = "";

      // Check if old password is incorrect
      const response = await fetch("/user/verify-old-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword }),
      });

      const result = await response.json();

      if (result.error) {
        oldPasswordError.textContent = result.error; // Show "Old password is incorrect."
        return;
      }

      // Regex for password complexity
      const complexityRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      // Validate new password complexity
      if (!complexityRegex.test(newPassword)) {
        newPasswordError.textContent =
          "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.";
        return;
      }

      // Validate new password is different from old password
      if (oldPassword === newPassword) {
        newPasswordError.textContent =
          "New password must not be the same as the old password.";
        return;
      }

      // Validate passwords match
      if (newPassword !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match.";
        return;
      }

      // Proceed to update password
      const updateResponse = await fetch("/user/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });

      const updateResult = await updateResponse.json();

      if (updateResult.error) {
        alert(updateResult.error);
      } else if (updateResult.message) {
        alert(updateResult.message);
        location.reload();
      }
    });

  // Toggle visibility for password fields
  document.querySelectorAll(".toggle-password").forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", function () {
      const targetInputId = this.getAttribute("data-target");
      const targetInput = document.getElementById(targetInputId);

      if (targetInput.type === "password") {
        targetInput.type = "text";
        this.querySelector("i").classList.remove("fa-eye");
        this.querySelector("i").classList.add("fa-eye-slash");
      } else {
        targetInput.type = "password";
        this.querySelector("i").classList.remove("fa-eye-slash");
        this.querySelector("i").classList.add("fa-eye");
      }
    });
  });
});
