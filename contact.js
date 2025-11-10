document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let message = document.getElementById("message").value.trim();
        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email regex pattern

        if (name === "") {
            alert("Please enter your name.");
            return false;
        }

        if (!email.match(emailPattern)) {
            alert("Please enter a valid email address.");
            return false;
        }

        if (message === "") {
            alert("Please enter a message.");
            return false;
        }

        alert("Form submitted successfully!");
        this.submit(); // Submit form if validation passes
    });
});
