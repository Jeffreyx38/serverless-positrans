var errorMessages;
var fullName;
var password;
var pass;

const sendHttpRequest = (method, url, data) => {
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: data ? { 'Content-Type': 'application/json' } : {}
    }).then(response => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        } else {
            return response;
        }
    });
};

function checkForm() {
    errorMessages = document.getElementById("formErrors").getElementsByTagName("ul")[0];
    errorMessages.innerHTML = "";

    var valid = true;
    valid = checkFullName();
    valid = checkEmail();
    valid = checkPassword();

    if (valid === false) {
        document.getElementById("formErrors").style.display = "block";
    }
    else {
        console.log("asasdasd");
        document.getElementById("formErrors").style.display = "none";
        pass = valid;
    }

}

function appendErrorMessage(msg) {
    var message = document.createElement("li");
    message.className = "errorMessage";
    message.innerText = msg;
    errorMessages.appendChild(message);
}

function checkFullName() {
    fullName = document.getElementById("fullName").value;
    if (fullName.length === 0) {
        appendErrorMessage("Missing full name.");
        document.getElementById("fullName").className = "errorInput";
        return false;
    }

    document.getElementById("fullName").className = "";
    return true;
}


function checkEmail() {
    var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    var email = document.getElementById("email").value;
    if (!pattern.test(email)) {
        appendErrorMessage("Invalid or missing email address.");
        document.getElementById("email").className = "errorInput";
        return false;
    }

    document.getElementById("email").className = "";
    return true;
}


function checkPassword() {
    var passInput = document.getElementById("password");
    var passConfirmInput = document.getElementById("passwordConfirm");
    password = passInput.value;
    var confirmPassword = passConfirmInput.value;

    var valid = true;
    if (password.length < 10 || password.length > 20) {
        valid = false;
        appendErrorMessage("Password must be between 10 and 20 characters.");
    }

    var pattern = /[a-z]/;
    if (!pattern.test(password)) {
        valid = false;
        appendErrorMessage("Password must contain at least one lowercase character.");
    }

    pattern = /[A-Z]/;
    if (!pattern.test(password)) {
        valid = false;
        appendErrorMessage("Password must contain at least one uppercase character.");
    }

    pattern = /[0-9]/;
    if (!pattern.test(password)) {
        valid = false;
        appendErrorMessage("Password must contain at least one digit.");
    }

    if (password !== confirmPassword) {
        valid = false;
        passConfirmInput.className = "errorInput";
        appendErrorMessage("Password and confirmation password don't match.");
    }
    else {
        passConfirmInput.className = "";
    }

    if (!valid) {
        passInput.className = "errorInput";
    }
    else {
        passInput.className = "";
    }

    return valid;
}

const newUserRequest = (observation) => {
    sendHttpRequest('POST', '/dev/register', {
        username: fullName,
        password: password
    })
        .then(responseData => {
            responseData.text().then(function(text){
                document.getElementById("data").innerHTML = text;
            })
            //console.log(responseData.text());
            //document.getElementById("data").innerHTML = responseData.text();
        })
};


const cancelView = () => {
    sendHttpRequest('GET', '/dev/logout').then(responseData => {
        window.location.assign(responseData.url);
    });
};

document.getElementById("submitt").addEventListener("click", function (event) {
    checkForm();
    if (pass) {
        newUserRequest();
    }
    // Prevent default form action. DO NOT REMOVE THIS LINE
    event.preventDefault();
});

document.getElementById("cancel").addEventListener("click", cancelView);

// document.getElementById("weather").addEventListener("onload", function () {
//     document.getElementById("formErrors").style.display = "block";
// });

