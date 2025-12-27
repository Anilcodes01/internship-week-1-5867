const state = {
  user: null,
  isEditing: false,
};

const elements = {
  viewMode: document.getElementById("viewMode"),
  displayName: document.getElementById("displayName"),
  displayTitle: document.getElementById("displayTitle"),
  displayEmail: document.getElementById("displayEmail"),
  displayBio: document.getElementById("displayBio"),
  displayAvatar: document.getElementById("displayAvatar"),

  editForm: document.getElementById("editForm"),
  inputName: document.getElementById("inputName"),
  inputTitle: document.getElementById("inputTitle"),
  inputEmail: document.getElementById("inputEmail"),
  inputBio: document.getElementById("inputBio"),

  editBtn: document.getElementById("editBtn"),
  cancelBtn: document.getElementById("cancelBtn"),

  loadingOverlay: document.getElementById("loadingOverlay"),
  toast: document.getElementById("toast"),
  errorName: document.getElementById("errorName"),
  errorEmail: document.getElementById("errorEmail"),
};

const fetchUserData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "Jane Doe",
        title: "Senior Frontend Developer",
        email: "jane.doe@example.com",
        bio: "Passionate about building interactive user interfaces and accessible web applications.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      });
    }, 1000);
  });
};

const saveUserData = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject("Server Error: Could not save changes.");
      } else {
        resolve(data);
      }
    }, 1500);
  });
};

async function init() {
  toggleLoading(true);
  try {
    state.user = await fetchUserData();
    renderView();
  } catch (error) {
    showToast("Failed to load profile", true);
  } finally {
    toggleLoading(false);
  }
}

function renderView() {
  const { user } = state;
  elements.displayName.textContent = user.name;
  elements.displayTitle.textContent = user.title;
  elements.displayEmail.textContent = user.email;
  elements.displayBio.textContent = user.bio;
  elements.displayAvatar.src = user.avatar;
}

function populateForm() {
  const { user } = state;
  elements.inputName.value = user.name;
  elements.inputTitle.value = user.title;
  elements.inputEmail.value = user.email;
  elements.inputBio.value = user.bio;
  clearErrors();
}

function toggleEditMode(showEdit) {
  state.isEditing = showEdit;
  if (showEdit) {
    populateForm();
    elements.viewMode.classList.add("hidden");
    elements.editForm.classList.remove("hidden");
  } else {
    elements.viewMode.classList.remove("hidden");
    elements.editForm.classList.add("hidden");
  }
}

function toggleLoading(isLoading) {
  if (isLoading) {
    elements.loadingOverlay.classList.remove("hidden");
  } else {
    elements.loadingOverlay.classList.add("hidden");
  }
}

function validateForm() {
  let isValid = true;
  clearErrors();

  const nameVal = elements.inputName.value.trim();
  if (nameVal.length < 2) {
    showError(
      elements.inputName,
      elements.errorName,
      "Name must be at least 2 characters."
    );
    isValid = false;
  }

  const emailVal = elements.inputEmail.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailVal)) {
    showError(
      elements.inputEmail,
      elements.errorEmail,
      "Please enter a valid email address."
    );
    isValid = false;
  }

  return isValid;
}

function showError(inputElement, errorElement, message) {
  inputElement.classList.add("input-error");
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function clearErrors() {
  const inputs = document.querySelectorAll("input");
  const errors = document.querySelectorAll(".error-msg");

  inputs.forEach((input) => input.classList.remove("input-error"));
  errors.forEach((err) => (err.style.display = "none"));
}

async function handleSave(e) {
  e.preventDefault();

  if (!validateForm()) return;

  toggleLoading(true);

  const newData = {
    ...state.user,
    name: elements.inputName.value.trim(),
    title: elements.inputTitle.value.trim(),
    email: elements.inputEmail.value.trim(),
    bio: elements.inputBio.value.trim(),
  };

  try {
    state.user = await saveUserData(newData);
    renderView();
    toggleEditMode(false);
    showToast("Profile updated successfully!");
  } catch (error) {
    showToast(error, true);
  } finally {
    toggleLoading(false);
  }
}

function showToast(message, isError = false) {
  const toast = elements.toast;
  toast.textContent = message;
  toast.style.backgroundColor = isError ? "var(--danger)" : "var(--dark)";

  toast.classList.remove("hidden");
  toast.style.animation = "none";
  toast.offsetHeight;
  toast.style.animation = null;

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

elements.editBtn.addEventListener("click", () => toggleEditMode(true));
elements.cancelBtn.addEventListener("click", () => toggleEditMode(false));
elements.editForm.addEventListener("submit", handleSave);

init();
