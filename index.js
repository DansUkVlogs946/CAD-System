// Store selected locations for each status
let userLocations = {
  standby: "",
  base: "",
  hospital: "",
  refuel: ""  // Added for refuel
};

// Store refuel price
let refuelPrice = 0;

// Handle status update including location popup
function updateStatus(status) {
  const callsign = document.getElementById("callsign").value.trim();

  if (callsign === "") {
      alert("Please enter a callsign.");
      return;
  }

  let location = "";

  // Show location modal based on status
  if (status === "Going To Standby" && !userLocations.standby) {
      showLocationModal("standby");
  }
  else if (status === "Going To Base" && !userLocations.base) {
      showLocationModal("base");
  }
  else if (status === "Transporting To Hospital" && !userLocations.hospital) {
      showLocationModal("hospital");
  }
  else if (status === "Refueling" && !userLocations.refuel) {
      showRefuelModal();  // New refuel modal
  }
  else {
      // No location needed or location already chosen
      updateStatusOnSheet(status, callsign);
  }
}

// Show the location modal and populate the dropdown
function showLocationModal(type) {
  const locations = {
      standby: ["Legion Square", "Sinner Street PD", "Sandy Shores PD", "Big Bank", "Airport"],
      base: ["Pillbox Hospital Ambulance Station", "Joint Responce Centre"],
      hospital: ["Pillbox Hospital", "Sand Shores Hospital", "Central Hospital"]
  };

  // Create modal HTML dynamically
  const modal = document.createElement("div");
  modal.id = "locationModal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.zIndex = "1000";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";

  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#fff";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "10px";
  modalContent.style.textAlign = "center";
  modalContent.innerHTML = `
      <h3>Select Location</h3>
      <select id="locationDropdown">
          ${locations[type].map(loc => `<option value="${loc}">${loc}</option>`).join('')}
      </select>
      <br><br>
      <button onclick="updateLocation('${type}')">Update Location</button>
      <button onclick="closeModal()">Cancel</button>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Store the type of status in the modal so we know which one it is
  modal.setAttribute("data-status", type);
}

// Show refuel modal
function showRefuelModal() {
  const modal = document.createElement("div");
  modal.id = "locationModal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.zIndex = "1000";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";

  const locations = [
    "LTD Gasoline (Davis, Los Santos)",
    "LTD Gasoline (Little Seoul, Los Santos)",
    "LTD Gasoline (Mirror Park, Los Santos)",
    "LTD Gasoline (Richman Glen, Los Santos)",
    "LTD Gasoline (Grapeseed, Blaine County)",
    "Xero Gas Station (Los Santos)",
    "Xero Gas Station (Blaine County)",
    "RON Gas Station (Los Santos)",
    "Globe Oil Gas Station (Downtown Vinewood, Los Santos)",
    "Globe Oil Gas Station (La Puerta, Los Santos)",
    "Globe Oil Gas Station (Senora Freeway, Blaine County)",
    "Route 68 Store (Los Santos County)",
    "Route 68 Store (Blaine County)",
    "Sandy's Gas Station (Sandy Shores)"
];

  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#fff";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "10px";
  modalContent.style.textAlign = "center";
  modalContent.innerHTML = `
      <h3>Select Fuel Station</h3>
      <select id="fuelStationDropdown">
            ${locations.map(loc => `<option value="${loc}">${loc}</option>`).join('')}
        </select>
      <br><br>
      <button onclick="saveFuelStation()">Select Station</button>
      <button onclick="closeModal()">Cancel</button>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// Save selected fuel station
function saveFuelStation() {
  const fuelStation = document.getElementById("fuelStationDropdown").value;
  
  if (fuelStation) {
      // Store the selected fuel station
      userLocations.refuel = fuelStation;
      // Commit the status update to the sheet
      const callsign = document.getElementById("callsign").value.trim();
      const status = `Refueling at ${fuelStation}`;
      updateStatusOnSheet(status, callsign);

      // After updating the status, show the price input
      showPriceInput();
  }
}

// Show price input after fuel station is selected
function showPriceInput() {
  const modal = document.createElement("div");
  modal.id = "priceModal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.zIndex = "1000";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";

  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#fff";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "10px";
  modalContent.style.textAlign = "center";
  modalContent.innerHTML = `
      <h3>Enter Refuel Price</h3>
      <input type="number" id="refuelPrice" placeholder="Enter Price" />
      <br><br>
      <button onclick="updateRefuel()">Update Refuel Status</button>
      <button onclick="closePriceModal()">Cancel</button>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// Close price input modal
function closePriceModal() {
  const modal = document.getElementById("priceModal");
  if (modal) {
      modal.remove();
  }
}

// Update refuel status with location and price
function updateRefuel() {
  const price = document.getElementById("refuelPrice").value;
  const callsign = document.getElementById("callsign").value.trim();

  if (price === "") {
      alert("Please enter a price.");
      return;
  }

  refuelPrice = price;

  const status = `Refueling at ${userLocations.refuel} - Price: $${price}`;
  
  // First, update the status to "Available" after price is submitted
  updateStatusOnSheet("Available", callsign);

  // Close the price modal
  closePriceModal();  
  closeModal();  // Close the location modal if still open
}

// Update the status on the sheet without location dropdown
// Update the status to "Available" on the main sheet
function updateStatusOnSheet(status, callsign) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbzF27e_0B0GPjkr2Djd4vQ_GKpaaeae8QAVT9ol7yurdxwRrCr62tSo9pFx5_tQ_ZtBGQ/exec";
  const url = `${scriptURL}?user=${encodeURIComponent(callsign)}&status=${encodeURIComponent(status)}&action=updateStatus`;

  // Fetch data from Google Apps Script to update the main sheet status
  fetch(url, { method: "GET" })
      .then(response => response.json())
      .then(data => {
          console.log(`Status updated to: ${status}`);
      })
      .catch(error => console.error("Error updating status:", error));
}

// Close the modal
function closeModal() {
  const modal = document.getElementById("locationModal");
  if (modal) {
      modal.remove();
  }
}

function updateLocation(type) {
  let statusMessage = ""
  if(type == "base") {
    userLocations.base = document.getElementById("locationDropdown").value;
    statusMessage = `Going To Base (${userLocations.base})`
  } else if(type == "hospital") {
    userLocations.hospital = document.getElementById("locationDropdown").value;
    statusMessage = `Going To Hospital (${userLocations.hospital})`
  } else if(type == "standby") {
    userLocations.standby = document.getElementById("locationDropdown").value;
    statusMessage = `Going To Standby (${userLocations.standby})`
  }
  
  updateStatusOnSheet(statusMessage, document.getElementById("callsign").value);
  closeModal();
}

function handleAtStatus(message) {
  let statusMessage = ""
  if(message == "At Base") {
    statusMessage = `At Base (${userLocations.base})`
  } else if(message == "At Hospital") {
    statusMessage = `At Hospital (${userLocations.hospital})`
  } else if(message == "At Standby") {
    statusMessage = `At Standby (${userLocations.standby})`
  }

  updateStatusOnSheet(statusMessage, document.getElementById("callsign").value);
}
