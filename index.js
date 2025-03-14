async function sendButtonData(buttonName) {
    var user = document.getElementById("userCallSign").value;

    if (!user) {
        alert("Please enter your callsign.");
        return;
    }

    var data = { button: buttonName, user: user };

    try {
        let response = await fetch("https://script.google.com/macros/s/AKfycbxn9gxJqkZHO1Em0mhWxGlYjvYJxd99V3PiFfjthV1ete1q4Fv6YLWOkduEyEBlyj_WJg/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        let result = await response.json();
        alert(result.message);
        console.log(result);
    } catch (error) {
        console.error("Error:", error);
        alert("Error while sending data.");
    }
}

// Add event listeners to buttons
document.querySelectorAll(".button").forEach(button => {
    button.addEventListener("click", function () {
        sendButtonData(this.getAttribute("data-button"));
        changeButtonColor(this.id);
    });
});

// Function to update button colors
function changeButtonColor(buttonId) {
    document.querySelectorAll(".button").forEach(button => button.style.color = "white");
    document.getElementById(buttonId).style.color = "lightgreen";
}
