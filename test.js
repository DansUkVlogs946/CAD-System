// Replace these with your actual values:
const CLIENT_ID = '238918197298-0h1h33oh88lmdl9etpu9181hpefamkm8.apps.googleusercontent.com';
const API_KEY = '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'; // e.g., "AIzaSyD..."
const SPREADSHEET_ID = '13UGFlf82Brv3bz-uDG3P76BmL_0pe45-vePiGNFpVUk'; // Found in your Google Sheet URL
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

let auth2; // This will hold the GoogleAuth object

function handleClientLoad() {
  console.log("Google API Client is loading...");
  gapi.load('client:auth2', function() {
      console.log("gapi.load has completed!");
      initClient();
  });
}

// Initialize the API client and OAuth 2.0
function initClient() {
  console.log("Initializing Google API Client...");

  gapi.client.init({
      clientId: "238918197298-0h1h33oh88lmdl9etpu9181hpefamkm8.apps.googleusercontent.com",
      scope: "https://www.googleapis.com/auth/spreadsheets",
  }).then(function () {
      console.log("Google API Client initialized!");
      document.getElementById("authorize-button").disabled = false;
  }).catch(function(error) {
      console.error("Error initializing Google API Client:", error);
  });
}

// Update UI based on sign-in status
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById('authorize_button').style.display = 'none';
    document.getElementById('signout_button').style.display = 'block';
    // Optionally, load additional APIs or set up button event listeners here
  } else {
    document.getElementById('authorize_button').style.display = 'block';
    document.getElementById('signout_button').style.display = 'none';
  }
}

// Handle the sign-in click event
function handleAuthClick() {
  auth2.signIn().then(() => {
    console.log("User signed in!");
    updateSigninStatus(true);
  }).catch(error => {
    console.error("Error signing in:", error);
  });
}

// Handle the sign-out click event
function handleSignoutClick() {
  auth2.signOut().then(() => {
    console.log("User signed out!");
    updateSigninStatus(false);
  }).catch(error => {
    console.error("Error signing out:", error);
  });
}

// Set up click listeners for each button (after DOM content is loaded)
document.addEventListener("DOMContentLoaded", function() {
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const userCallSign = document.getElementById('userCallSign').value;
      const buttonLabel = this.getAttribute('data-button');
      if (userCallSign && buttonLabel) {
        appendData(userCallSign, buttonLabel);
      } else {
        alert("Please enter your callsign.");
      }
    });
  });
});

// Append data to the Google Sheet using the Sheets API
function appendData(userCallSign, buttonLabel) {
  const params = {
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1!A1:C1', // Adjust this range as needed
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS'
  };

  const valueRangeBody = {
    values: [
      [new Date().toISOString(), userCallSign, buttonLabel]
    ]
  };

  gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody).then(response => {
    console.log("Data appended successfully:", response);
  }, error => {
    console.error("Error appending data:", error);
  });
}
