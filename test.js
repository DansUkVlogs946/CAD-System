function test() {
    fetch("https://script.google.com/macros/s/AKfycbxNLRHreiGtYjEGZ6zcrxtscHY7zpxpxU3aWzY1nF3VfLx8PLYf0Y82kK5PAbshQfovrw/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: "JohnDoe", button: "ClickedButton" })
    })
    .then(response => response.json())
    .then(data => console.log("Success:", data))
    .catch(error => console.error("Error:", error));
  }

  test();