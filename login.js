const validUsername = 'admin';  // Change to actual admin username
const validPassword = 'admin123';  // Change to actual admin password

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === validUsername && password === validPassword) {
        window.location.href = 'admin-console.html';  // Redirect to admin page
    } else {
        document.getElementById('error-message').textContent = 'Invalid credentials. Please try again.';
    }
});