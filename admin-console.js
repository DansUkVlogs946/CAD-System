const scriptURL = 'https://script.google.com/macros/s/AKfycbzF27e_0B0GPjkr2Djd4vQ_GKpaaeae8QAVT9ol7yurdxwRrCr62tSo9pFx5_tQ_ZtBGQ/exec'

let units = []; // Array to store units
let currentFilter = ''; // Store the current filter status
let currentColorFilter = ''; // Store the current color filter value
let filterUnits = [];  // Initialize as an empty array



// Filter the table based on selected color
function filterByColor() {
    currentColorFilter = document.getElementById('colorFilter').value;  // Get selected color value
    const tableRows = document.querySelectorAll('#unit-table-body tr');  // Get all table rows

    tableRows.forEach(row => {
        const rowClass = row.classList.contains('green') ? 'green' :
                         row.classList.contains('orange') ? 'orange' :
                         row.classList.contains('red') ? 'red' : '';

        // Show or hide rows based on color filter
        if (currentColorFilter === "" || rowClass === currentColorFilter) {
            row.style.display = '';  // Show the row
        } else {
            row.style.display = 'none';  // Hide the row
        }
    });
}

// Add event listener for color filter dropdown change
document.getElementById('colorFilter').addEventListener('change', filterByColor);

// Fetch data from the Google Apps Script URL
function fetchSheetData() {
    fetch(scriptURL)
        .then(response => response.json())  // Parse the JSON response
        .then(data => {
            if (data.success) {
                if (data.users) {
                    units = data.users;  // Store all users' data
                    displayUnits(units);  // Display the units in the admin console
                } else {
                    console.log(data.message);  // Log success messages
                }
            } else {
                console.log('Error:', data.message);
                alert('Error: ' + data.message);  // Show an error if there was an issue
            }
            reapplyFilter(); // Reapply the filter after updating the data
        })
        .catch(error => console.log('Error fetching data:', error));
}

// Function to display units
function displayUnits(units) {
    const tableBody = document.getElementById('unit-table-body');  // Assuming you have a table body in the HTML
    tableBody.innerHTML = '';  // Clear the current table data

    units.forEach(unit => {
        const row = document.createElement('tr');
        const userCell = document.createElement('td');
        const statusCell = document.createElement('td');

        userCell.textContent = unit.user;  // This should be the callsign (user)
        statusCell.textContent = unit.status;  // This should be the status

        // Add color class to the row based on the status
        const statusClass = getStatusClass(unit.status);  // getStatusClass gives us "green", "orange", or "red"
        row.classList.add(statusClass);  // Add the class to the row

        row.appendChild(userCell);
        row.appendChild(statusCell);
        tableBody.appendChild(row);
    });

    // After displaying the units, reapply the color filter if it's set
    if (currentColorFilter !== "") {
        filterByColor();
    }
}

// Initial call to display all units
displayUnits(units);

// Function to apply color class based on status
function getStatusClass(status) {
    // Check if the status contains a location in parentheses
    if (status.startsWith("At Base")) {
        return "green";  // Apply green for "At Base"
    }
    if (status.startsWith("At Standby")) {
        return "green";  // Apply green for "At Standby"
    }
    if (status.startsWith("At Hospital")) {
        return "orange";  // Apply orange for "At Hospital"
    }
    if (status.startsWith("Going To Hospital")) {
        return "red";  // Apply orange for "At Hospital"
    }
    if (status.startsWith("Going To Base")) {
        return "green";  // Apply orange for "At Hospital"
    }
    if (status.startsWith("Going To Base")) {
        return "orange";  // Apply orange for "At Hospital"
    }

    // Check other statuses
    switch (status) {
        case "Available":
            return "green";
        case "En Route":
        case "On Scene":
        case "Going To Standby":
            return "orange";
        case "Unavailable":
        case "Meal Break":
        case "Busy":
        case "Off Duty":
            return "red";
        default:
            return "gray"; // Default for undefined statuses
    }
}

// Function to update status and apply the corresponding color class
function updateStatusWithColor(status, callsign) {
    const buttonClass = getStatusClass(status);
    const statusButton = document.getElementById(status); // Get the button element by its id
    if (statusButton) {
        statusButton.className = buttonClass; // Set the class for the button
    }

    updateStatusOnSheet(status, callsign);
}

// Update status and apply the corresponding color class
function updateStatus(status) {
    const callsign = document.getElementById("callsign").value.trim();

    if (callsign === "") {
        alert("Please enter a callsign.");
        return;
    }

    // Apply color to the button
    updateStatusWithColor(status, callsign);
    
    let location = "";

    // Show location modal based on status
    if (status === "Going To Standby" && !userLocations.standby) {
        showLocationModal("standby");
    }
    else if (status === "Going To Base" && !userLocations.base) {
        showLocationModal("base");
    }
    else if (status === "Going To Hospital" && !userLocations.hospital) {
        showLocationModal("hospital");
    }
    else {
        // No location needed or location already chosen
        updateStatusOnSheet(status, callsign);
    }
}

// Function to update status and keep the color filter intact
function updateStatus(status) {
    // Update the status (example: for a specific callsign)
    const callsign = document.getElementById('callsign').value;  // Get the callsign value
    const unit = units.find(unit => unit.user === callsign);  // Find the unit based on callsign
    if (unit) {
        unit.status = status;  // Update the status
    }

    // Re-display units (while keeping the color filter intact)
    displayUnits(units);

    // Reapply the color filter (if any is selected)
    if (currentColorFilter !== "") {
        filterByColor();
    }
}

// Reapply the filter after the data refreshes
function reapplyFilter() {
    if (!filterUnits || filterUnits.length === 0) {
        return;
    }
    document.getElementById("statusFilter").value = currentFilter; // Restore the previous filter state
    filterUnits(); // Reapply the filter
}

// Fetch data periodically (e.g., every second)
setInterval(fetchSheetData, 1000); // 1 second = 1000 milliseconds

// Initial fetch of the data
fetchSheetData();
