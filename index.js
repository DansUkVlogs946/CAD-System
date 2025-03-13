// Function to handle button click
function sendButtonData(buttonName) {
    var user = document.getElementById("userCallSign").value;

    if (!user) {
      alert("Please enter your callsign.");
      return;
    }

    // Prepare the POST request data
    var data = {
      button: buttonName,
      user: user
    };

    // Send the POST request
    fetch("https://script.google.com/macros/s/AKfycby6kz8a8f347JSvWdb1hRFDtKwEHUuIy_QGGsgAnGfBiDuZ5kGf8xprr89LPal0XdV9/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      mode: "no-cors" // Bypass CORS issues
    })
    .then(response => {
      console.log("Request sent successfully!");
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error occurred while sending data.");
    });
  }

  // Add event listeners for all the buttons
  var buttons = document.querySelectorAll(".button");
  buttons.forEach(function(button) {
    button.addEventListener("click", function() {
      var buttonName = this.getAttribute("data-button");
      sendButtonData(buttonName);
      changeButtonColor(buttonName);
    });
  });

  function changeButtonColor(buttonName) {
    var elements = document.querySelectorAll("button");   

    for(var i = 0, len = elements.length; i < len; i++) {   
        elements[i].style.color = "white";
    }


    document.getElementById(buttonName.replace(/\s+/g, '')).style.color = "lightgreen";
  }

  // Button to remove the user
document.getElementById("removeButton").addEventListener("click", function() {
    var user = document.getElementById("userCallSign").value;
    if (!user) {
      alert("Please enter a callsign.");
      return;
    }
  
    fetch("https://script.google.com/macros/s/AKfycby6kz8a8f347JSvWdb1hRFDtKwEHUuIy_QGGsgAnGfBiDuZ5kGf8xprr89LPal0XdV9/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: user,  // Pass the callsign to be removed
        button: "remove"  // We can use this to differentiate between adding and removing data
      })
    })
    .then(response => response.text())
    .then(data => {
      console.log("Success:", data);
      alert(data);  // Show success or failure message
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error occurred!");
    });
  });