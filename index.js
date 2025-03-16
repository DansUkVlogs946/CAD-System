const CLIENT_ID = '238918197298-0h1h33oh88lmdl9etpu9181hpefamkm8.apps.googleusercontent.com';
const API_KEY = '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'; // Replace with your actual API key
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
let auth2;

// Initialize Google API client and auth2
function handleClientLoad() {
  gapi.load('client:auth2', initClient); // Initialize client when API is loaded
}

// Initialize the API client and set up the sign-in status
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    scope: SCOPES,
  }).then(function() {
    auth2 = gapi.auth2.getAuthInstance(); // Initialize auth2 instance
    auth2.isSignedIn.listen(updateSigninStatus); // Listen for sign-in status changes
    updateSigninStatus(auth2.isSignedIn.get()); // Check sign-in status on load
  }).catch(function(error) {
    console.error("Error initializing Google API client:", error);
  });
}

// Sign in when the user clicks the "Authorize" button
function handleAuthClick() {
  auth2.signIn().then(function() {
    console.log("User signed in!");
    loadSheetsApi();  // Load Sheets API after sign-in
  }).catch(function(error) {
    console.error("Error signing in:", error);
  });
}

// Sign out when the user clicks the "Sign Out" button
function handleSignoutClick() {
  auth2.signOut().then(function() {
    console.log("User signed out!");
    document.getElementById('authorize_button').style.display = 'block';
    document.getElementById('signout_button').style.display = 'none';
  }).catch(function(error) {
    console.error("Error signing out:", error);
  });
}

// Load the Sheets API once the user has authorized
function loadSheetsApi() {
  gapi.client.load("sheets", "v4", function() {
    console.log("Google Sheets API loaded.");
    document.getElementById('authorize_button').style.display = 'none';
    document.getElementById('signout_button').style.display = 'block';
    setUpButtonClicks();  // Set up button click handlers after API is loaded
  });
}

// Update the UI based on sign-in status
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById('authorize_button').style.display = 'none';
    document.getElementById('signout_button').style.display = 'block';
  } else {
    document.getElementById('authorize_button').style.display = 'block';
    document.getElementById('signout_button').style.display = 'none';
  }
}

// Set up event listeners for button clicks
function setUpButtonClicks() {
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const userCallSign = document.getElementById('userCallSign').value;
      const buttonLabel = this.getAttribute('data-button');
      if (userCallSign && buttonLabel) {
        addButtonData(userCallSign, buttonLabel);
      } else {
        alert('Please enter your callsign.');
      }
    });
  });
}

// Add button data to Google Sheets
function addButtonData(userCallSign, buttonLabel) {
  const params = {
    spreadsheetId: '13UGFlf82Brv3bz-uDG3P76BmL_0pe45-vePiGNFpVUk', // Replace with your actual Google Sheets ID
    range: 'Sheet1!A1:C1', // Adjust this range based on where you want to add data
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
  };

  const valueRangeBody = {
    "values": [
      [new Date().toISOString(), userCallSign, buttonLabel] // Add timestamp, user, and button clicked
    ]
  };

  const request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  request.then(function(response) {
    console.log('Data added successfully:', response);
  }, function(error) {
    console.error('Error adding data:', error);
  });
}
