//Javascript for Login features.
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