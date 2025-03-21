const scriptURL = 'https://script.google.com/macros/s/AKfycbzF27e_0B0GPjkr2Djd4vQ_GKpaaeae8QAVT9ol7yurdxwRrCr62tSo9pFx5_tQ_ZtBGQ/exec'; // Replace with your Google Apps Script URL

        let units = []; // Array to store units
        let currentFilter = ''; // Store the current filter status
        // Store the current color filter value
        let currentColorFilter = '';

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



        function getStatusClass(status) {
            switch (status) {
                case "Available":
                    return "green";
                case "En Route":
                case "On Scene":
                case "Transporting To Hospital":
                case "At Hospital":
                case "Going To Standby":
                    return "orange";
                case "Going To Base":
                case "At Base":
                case "At Standby":
                    return "green";
                case "Unavailable":
                case "Meal Break":
                case "Off Duty":
                case "Refueling":
                    return "red";
                default:
                    return "gray"; // Default for undefined statuses
            }
        }



        // Filter units based on the selected status
        function filterUnits() {
            currentFilter = document.getElementById("statusFilter").value; // Save the current filter state
            const filteredUnits = currentFilter
                ? units.filter(unit => unit.status === currentFilter)
                : units;
            displayUnits(filteredUnits);
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
            document.getElementById("statusFilter").value = currentFilter; // Restore the previous filter state
            filterUnits(); // Reapply the filter
        }

        // Fetch data periodically (e.g., every second)
        setInterval(fetchSheetData, 1000); // 1 second = 1000 milliseconds

        // Initial fetch of the data
        fetchSheetData();