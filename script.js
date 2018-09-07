/*  Project 01_11_04

    Author: Dylan Jones-Miller
    Date:   9.5.18

    Filename: script.js
*/

"use strict";
var httpRequest = false;
//global variable to check the selected country
var countrySel;

//function to check input and see if the box has 5 numbers(valid zip)
function checkInput() {
    var zip = document.getElementById("zip").value;
    if (zip.length === 5) {
        getLocation();
    } else {
        document.getElementById("city").value = "";
        document.getElementById("state").value = "";
    }
}

function checkButtons() {
    var germany = document.getElementById("germany");
    var us = document.getElementById("us");
    if (germany.checked || us.checked) {
        document.getElementById("zipset").style.visibility = "visible";
        if (germany.checked) {
            countrySel = "de";
        } else {
            countrySel = "us"
        }
    }

}

//Intiating a XHR object
function getRequestObject() {
    try {
        httpRequest = new XMLHttpRequest;
    } catch (requestError) {
        document.getElementById("zipset").style.visibility = "visible";
        var zip = document.getElementById("zip");
        var germany = document.getElementById("germany");
        var us = document.getElementById("us");
        if (zip.addEventListener) {
            //handling field visibility
            germany.removeEventListener("click", checkButtons, false);
            us.removeEventListener("click", checkButtons, false);
            zip.addEventListener("keyup", checkInput, false);
        } else if (zip.attachEvent) {
            germany.detachEvent("onclick", checkButtons, false);
            us.detachEvent("onclick", checkButtons, false);
            zip.attachEvent("onkeyup", checkInput);
        }

        return false;
    }
    return httpRequest;
}

//Processing the XHR and returning a value
function getLocation() {
    var zip = document.getElementById("zip").value;
    if (!httpRequest) {
        httpRequest = getRequestObject();
    }
    httpRequest.abort();
    httpRequest.open("get", "http://api.zippopotam.us/" + countrySel + "/" + zip, true);
    httpRequest.send(null);
    httpRequest.onreadystatechange = displayData;
}

//Displaying the processed data
function displayData() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        var resultData = JSON.parse(httpRequest.responseText);
        var city = document.getElementById("city");
        var state = document.getElementById("state");
        city.value = resultData.places[0]["place name"];
        state.value = resultData.places[0]["state abbrevation"];
        document.getElementById("zip").blur();
        document.getElementById("csset").style.visibility = "visible";
    }
}

//creating an event listener for when the country is selected.
var germany = document.getElementById("germany");
var us = document.getElementById("us");
if (us.addEventListener) {
    germany.addEventListener("click", checkButtons, false);
    us.addEventListener("click", checkButtons, false);
} else if (us.attachEvent) {
    germany.attachEvent("onclick", checkButtons, false);
    us.attachEvent("onclick", checkButtons, false);
}

var zip = document.getElementById("zip");
if (zip.addEventListener) {
    zip.addEventListener("keyup", checkInput, false);
} else if (zip.attachEvent) {
    zip.attachEvent("onkeyup", checkInput);
}
