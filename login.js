//Javascript for Login features.
function Login(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if ((username === 'testusername' && password === 'testpassword') || (username === localStorage.getItem("username") && password === localStorage.getItem("password"))) {
        localStorage.setItem('loggedInUser', username);
        alert('Login successful. You can now access your account.');
    } else {
        alert('Invalid username or password. Please try again.');
    }
}

function createAccount() {
    const usernameElement = document.querySelector("#new-username");
    localStorage.setItem("username", usernameElement.value);
    const passwordElement = document.querySelector("#new-password");
    localStorage.setItem("password", passwordElement.value);
    const emailElement = document.querySelector("#email");
    localStorage.setItem("email", emailElement.value);
    alert("Later this will just verify that an account was created,\nbut for now it's also for testing purposes.\n\nAn account with the username: '" + localStorage.getItem("username") + "'\nthe password: '" + localStorage.getItem("password") + "'\nand the email: '" + localStorage.getItem("email") + "'\n has been created.");
    LoadSearchPage();
}

function LoadSearchPage(){
    window.location.href = "search.html";
}