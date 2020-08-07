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

function htmlState(json) {
    var tb = ""
    tb += "<table><tr><th>Date</th><th id=\"blank\"></th><th>Observation</th></tr>"

    for (var i = 0; i < json.length; i++) {
        tb += "</td><td align= \"center\" > " + json[i].DATE.split("T", 1) + "</td>"
        tb += "</td><td> " + json[i].DATE.split(" ", 0) + " </td>"
        tb += "</td><td align= \"left\"> " + json[i].OBSERVATION + " </td></tr>"
    }

    document.getElementById("text").innerHTML = tb + "</table>"
}


function request() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //document.getElementById("data").innerHTML = this.responseText;
            console.log(JSON.parse(this.response));
            htmlState(JSON.parse(this.response));
        }
    };
    xhttp.open("GET", "/dev/getobservation", true);
    xhttp.send();

}

const logoutView = () => {
    sendHttpRequest('GET', '/dev/logout').then(responseData => {
        window.location.assign(responseData);
    });
};


const gobackView = () => {
    sendHttpRequest('GET', '/dev/goback').then(responseData => {
        window.location.assign(responseData);
    });
};


document.getElementById("logout").addEventListener("click", logoutView);
document.getElementById("goback").addEventListener("click", gobackView);

//document.getElementById("text").addEventListener("onload", request);


