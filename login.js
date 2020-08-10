function submitForm() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("pswd").value;
    sendData(username, password);
}
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
            return response.url;
        }
    });
};

const getData = () => {
    sendHttpRequest('GET', '/dev/login').then(responseData => {
        console.log(responseData);
    });
};

const sendData = (username, password) => {
    sendHttpRequest('POST', '/dev/login', {
        username: username,
        password: password
    })
        .then(responseData => {
            window.location.assign(responseData);
        })
};

// function requestXML(username, password) {

//     console.log(username);
//     console.log(password);

//     let json = JSON.stringify({
//         username: username,
//         password: password
//     });

//     console.log(json);

//     var xhttp = new XMLHttpRequest();

//     xhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             console.log(this.responseText);
//             window.location.replace(this.responseText);
//             //document.getElementById("").innerHTML = this.responseText;
//             //   console.log(JSON.parse(this.responseText));
//             //   htmlState(JSON.parse(this.responseText));
//         }
//     };
//     xhttp.open("POST", "/dev/login", true);
//     xhttp.setRequestHeader("Content-type", "application/json");
//     xhttp.send(json);

// }

const registerView = () => {
    sendHttpRequest('GET', '/dev/register').then(responseData => {
        window.location.assign(responseData);
    });
};




document.getElementById("getForm").addEventListener("submit", function (event) {
    submitForm();
    // Prevent default form action. DO NOT REMOVE THIS LINE
    event.preventDefault();
});

document.getElementById("register").addEventListener("click", registerView);