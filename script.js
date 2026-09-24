// ===============================
// PulsePoint Student Feedback
// ===============================

// NIET official/reference email domain
const NIET_DOMAIN = "@niet.co.in";

// Local storage key
const STORAGE_KEY = "pulsepoint_feedback";

// Get HTML elements
const feedbackForm = document.getElementById("feedbackForm");
const feedbackList = document.getElementById("feedbackList");
const emptyState = document.getElementById("emptyState");
const feedbackCount = document.getElementById("feedbackCount");
const message = document.getElementById("message");
const clearBtn = document.getElementById("clearBtn");


// ===============================
// INSTITUTE CLASSIFICATION
// ===============================

function classifyEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail.endsWith(NIET_DOMAIN)) {
    return "NIET Student";
  }

  return "External Institute";
}


// ===============================
// LOAD FEEDBACK
// ===============================

function getFeedback() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    console.error("Unable to load feedback:", error);
    return [];
  }
}


// ===============================
// SAVE FEEDBACK
// ===============================

function saveFeedback(feedback) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(feedback)
  );
}


// ===============================
// DISPLAY FEEDBACK
// ===============================

function renderFeedback() {

  const feedback = getFeedback();

  feedbackList.innerHTML = "";

  feedbackCount.textContent = feedback.length;

  // Show empty state if there is no feedback
  if (feedback.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";


  feedback.forEach((item) => {

    const card = document.createElement("div");

    card.className = "feedback-card";


    // Institute badge
    const instituteClass =
      item.instituteType === "NIET Student"
        ? "niet"
        : "external";


    card.innerHTML = `

      <div class="feedback-card-top">

        <div>

          <h3>
            ${escapeHTML(item.name)}
          </h3>

          <p class="email-line">
            ${escapeHTML(item.email)}
          </p>

        </div>

        <span class="institute-badge ${instituteClass}">
          ${escapeHTML(item.instituteType)}
        </span>

      </div>


      <div class="feedback-course">
        ${escapeHTML(item.course)}
      </div>


      <p class="feedback-text">
        ${escapeHTML(item.feedback)}
      </p>


      <div class="feedback-date">
        ${escapeHTML(item.date)}
      </div>

    `;

    feedbackList.appendChild(card);

  });
}


// ===============================
// HTML SECURITY
// ===============================

function escapeHTML(value) {

  const div = document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}


// ===============================
// FORM SUBMISSION
// ===============================

feedbackForm.addEventListener("submit", function (event) {

  event.preventDefault();


  // Get form values
  const name =
    document.getElementById("name").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const course =
    document.getElementById("course").value;

  const feedback =
    document.getElementById("feedback").value.trim();


  // Basic validation
  if (!name || !email || !course || !feedback) {

    showMessage(
      "Please fill in all fields.",
      "error"
    );

    return;
  }


  // Browser email validation
  const emailInput =
    document.getElementById("email");

  if (!emailInput.checkValidity()) {

    showMessage(
      "Please enter a valid email address.",
      "error"
    );

    return;
  }


  // Classify institute
  const instituteType =
    classifyEmail(email);


  // Create feedback object
  const newFeedback = {

    name: name,

    email: email,

    course: course,

    feedback: feedback,

    instituteType: instituteType,

    date: new Date().toLocaleString("en-IN")

  };


  // Get existing feedback
  const feedbackData = getFeedback();


  // Add newest feedback at the beginning
  feedbackData.unshift(newFeedback);


  // Save
  saveFeedback(feedbackData);


  // Show success message
  showMessage(
    `Feedback submitted successfully — ${instituteType}.`,
    "success"
  );


  // Reset form
  feedbackForm.reset();


  // Refresh feedback cards
  renderFeedback();

});


// ===============================
// MESSAGE FUNCTION
// ===============================

function showMessage(text, type) {

  message.textContent = text;

  message.className = `message ${type}`;


  // Automatically remove message
  setTimeout(() => {

    message.textContent = "";

    message.className = "message";

  }, 4000);

}


// ===============================
// CLEAR DEMO DATA
// ===============================

clearBtn.addEventListener("click", function () {

  const feedback = getFeedback();

  if (feedback.length === 0) {

    showMessage(
      "There is no feedback data to clear.",
      "error"
    );

    return;
  }


  const confirmed = confirm(
    "Are you sure you want to clear all feedback?"
  );


  if (!confirmed) {
    return;
  }


  localStorage.removeItem(STORAGE_KEY);

  renderFeedback();


  showMessage(
    "All demo feedback has been cleared.",
    "success"
  );

});


// ===============================
// INITIAL LOAD
// ===============================

renderFeedback();