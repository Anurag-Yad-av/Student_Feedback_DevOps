const form = document.getElementById("feedbackForm");
const feedbackList = document.getElementById("feedbackList");


// Load feedback when page opens
document.addEventListener("DOMContentLoaded", displayFeedback);


// Submit feedback
form.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const course = document.getElementById("course").value;
    const feedback = document.getElementById("feedback").value.trim();

    const ratingElement =
        document.querySelector(
            'input[name="rating"]:checked'
        );

    if (!ratingElement) {
        alert("Please select a rating.");
        return;
    }

    const rating = Number(ratingElement.value);


    const feedbackData = {

        name: name,

        course: course,

        rating: rating,

        feedback: feedback,

        date: new Date().toLocaleDateString()

    };


    // Get existing feedback
    const existingFeedback =
        JSON.parse(
            localStorage.getItem("studentFeedback")
        ) || [];


    // Add new feedback
    existingFeedback.unshift(feedbackData);


    // Store feedback
    localStorage.setItem(
        "studentFeedback",
        JSON.stringify(existingFeedback)
    );


    // Display feedback
    displayFeedback();


    // Reset form
    form.reset();


    alert("Thank you! Your feedback has been submitted.");

});


// Display feedback
function displayFeedback() {

    const feedbackData =
        JSON.parse(
            localStorage.getItem("studentFeedback")
        ) || [];


    if (feedbackData.length === 0) {

        feedbackList.innerHTML = `
            <div class="feedback-card">
                <h3>No feedback yet</h3>
                <p>
                    Be the first student to share your experience.
                </p>
            </div>
        `;

        return;
    }


    feedbackList.innerHTML =
        feedbackData.map(item => {

            const stars =
                "★".repeat(item.rating) +
                "☆".repeat(5 - item.rating);


            return `

                <div class="feedback-card">

                    <h3>${escapeHTML(item.name)}</h3>

                    <div class="course">
                        ${escapeHTML(item.course)}
                    </div>

                    <div class="stars">
                        ${stars}
                    </div>

                    <p>
                        ${escapeHTML(item.feedback)}
                    </p>

                    <small>
                        Submitted on ${item.date}
                    </small>

                </div>

            `;

        }).join("");
}


// Prevent HTML injection
function escapeHTML(value) {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}