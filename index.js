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
  
    // Send the POST request to the Google Apps Script endpoint
    fetch("https://script.google.com/macros/s/AKfycby6kz8a8f347JSvWdb1hRFDtKwEHUuIy_QGGsgAnGfBiDuZ5kGf8xprr89LPal0XdV9/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      mode: "cors"  // Make sure this is set to 'cors' for proper cross-origin requests
    })
    .then(response => response.json())
    .then(data => {
      console.log("Response:", data);  // Log success or failure message
      alert(data);  // Display success/failure message from the server
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
  
    // Reset button colors
    for(var i = 0, len = elements.length; i < len; i++) {   
      elements[i].style.color = "white";
    }
  
    // Highlight the clicked button
    document.getElementById(buttonName.replace(/\s+/g, '')).style.color = "lightgreen";
  }
  
  // Add event listener to the remove button
  document.getElementById("removeButton").addEventListener("click", function() {
    const user = document.getElementById('userCallSign').value; 
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
        button: "remove"  // Set button to "remove" for removal action
      }),
      mode: "cors"  // Ensure CORS is enabled here as well
    })
    .then(response => response.json())
    .then(data => {
      console.log("Response:", data);  // Log success or failure message
      alert(data);  // Display message in an alert box
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error occurred while removing data.");
    });
  });
  