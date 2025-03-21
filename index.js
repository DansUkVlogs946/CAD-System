function updateStatus(status) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbzF27e_0B0GPjkr2Djd4vQ_GKpaaeae8QAVT9ol7yurdxwRrCr62tSo9pFx5_tQ_ZtBGQ/exec";  // Replace with your Google Apps Script URL
  const callsign = document.getElementById("callsign").value.trim();

  if (callsign === "") {
    alert("Please enter a callsign.");
    return;
  }

  const url = `${scriptURL}?user=${encodeURIComponent(callsign)}&status=${encodeURIComponent(status)}`;

  fetch(url, { method: "GET" })
    .then(response => response.json())  // Parse JSON response
    .then(data => {
      // Handle JSON response
      if (data.success) {
        if (status === "Off Duty") {
          alert("User has been removed from the system.");
        } else {
          console.log(`Status updated to: ${status}`);
        }
      } else {
        alert(data.message);  // Show the error message if something goes wrong
      }
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}
