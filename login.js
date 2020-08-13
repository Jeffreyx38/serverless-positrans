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
            return response;
        }
    });
};

const sendData = (username, password) => {
    sendHttpRequest('POST', '/dev/login', {
        username: username,
        password: password
    })
        .then(responseData => {

            if (responseData.ok) {
                console.log(responseData);
                window.location.assign(responseData.url);
            }
            return responseData.text();
        }).then(text => {
            document.getElementById("data").innerHTML = text;
        })
        .catch(err => {
            console.log(err);
            document.getElementById("data").innerHTML = "Please create Account."
        })
};

const registerView = () => {
    sendHttpRequest('GET', '/dev/register').then(responseData => {
        window.location.assign(responseData.url);
    });
};




document.getElementById("getForm").addEventListener("submit", function (event) {
    submitForm();
    // Prevent default form action. DO NOT REMOVE THIS LINE
    event.preventDefault();
});

document.getElementById("register").addEventListener("click", registerView);