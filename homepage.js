function getObservation() {
    const observation = document.getElementById("observation").value;

    sendObservation(observation);
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

const logoutView = () => {
    sendHttpRequest('GET', '/dev/logout').then(responseData => {
        console.log(responseData);
    });
};

const mylistView = () => {
    sendHttpRequest('GET', '/dev/mylist').then(responseData => {
        console.log(responseData);
    });
};

const sendObservation = (observation) => {
    sendHttpRequest('POST', '/dev/observation', {
        observation: observation
    })
        .then(responseData => {
            window.location.assign(responseData);
        })
};

document.getElementById("logout").addEventListener("click", logoutView);
document.getElementById("mylist").addEventListener("click", mylistView);

document.getElementById("getForm").addEventListener("submit", function (event) {
    getObservation();
    // Prevent default form action. DO NOT REMOVE THIS LINE
    event.preventDefault();
});