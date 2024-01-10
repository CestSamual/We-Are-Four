//Initialise Page
document.addEventListener("DOMContentLoaded", function () {
  var postcodeInputEl = document.getElementById("postcodeInput");
  var postcodeBtnEl = document.getElementById("postcodeBtn");
  var mailToLinkEl = document.getElementById("mailToLink");
  var areRentingEl = document.getElementById("areRenting");
  var rentOutOfEl = document.getElementById("rentOutOf");
  var peopleInAreaEl = document.getElementById("peopleInArea");
  var postcodeAreaEl = document.getElementById("postcodeArea");
  var displayResultsEl = document.getElementById("displayResults");
  var voteImgEL = document.getElementById("voteImg");
  var history = JSON.parse(localStorage.getItem("search")) || [];

  //Event Listener for postcode submission click
  postcodeBtnEl.addEventListener("click", function (event) {
    event.preventDefault();

    var postcode = postcodeInputEl.value;
    retrieveMemberID(postcode);
    retrieveCID(postcode);
    history.push(postcode);
    localStorage.setItem("search", JSON.stringify(history));
  });
  //Members API Member ID fetch
  function retrieveMemberID(postcode) {
    var queryURL =
      "https://members-api.parliament.uk/api/Location/Constituency/Search?searchText=" +
      postcode +
      "&skip=0&take=1";

    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var memberID =
          data.items[0].value.currentRepresentation.member.value.id;
        console.log(memberID);

        // Pass memberID to retrieveEmail function
        retrieveEmail(memberID);
      });
  }
  //Memebers API email fetch
  function retrieveEmail(memberID) {
    var queryURL =
      "https://members-api.parliament.uk/api/Members/" + memberID + "/Contact";
    // console.log(queryURL);

    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var email = data.value[0].email;
        console.log(email);
        mailToLinkEl.href = "mailto:" + email;
      });
  }

  //FTP API fetch
  function retrieveCID(postcode) {
    var queryURL =
      "https://findthatpostcode.uk//postcodes/" + postcode + ".json";
    // console.log(queryURL);

    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var pconValue = data.data.attributes.pcon;
        console.log("pcon:", pconValue);
        //Pass pconValue to retrieveONS function
        retrieveONS(pconValue);
        console.log(pconValue);
      });
  }

  //ONS API fetch
  function retrieveONS(pconValue) {
    var queryURL =
      "https://api.beta.ons.gov.uk/v1/datasets/TS054/editions/2021/versions/4/json?area-type=wpc," +
      pconValue;

    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var statistics = data.observations;
        //Calculation variables
        var sumStat = 0;
        for (var i = 0; i < statistics.length; i++) {
          sumStat += statistics[i];
        }
        var rentingStat = statistics[6] + statistics[7];
        var rentingPercentStat = (rentingStat / sumStat) * 100;
        //Parse to HTML elements
        voteImgEL.classList.add("d-none");
        displayResultsEl.classList.remove("d-none");
        areRentingEl.innerHTML = rentingPercentStat.toFixed(0) + "%";
        rentOutOfEl.innerHTML = rentingStat;
        peopleInAreaEl.innerHTML = sumStat;
        postcodeAreaEl.innerHTML = data.dimensions[0].options[0].label;
        console.log(data.dimensions[1].label);
      });
    //Get most recent submission
  }
  if (history.length > 0) {
    retrieveMemberID(history[history.length - 1]);
    retrieveCID(history[history.length - 1]);
    postcodeInputEl.innerHTML = history[history.length - 1];
  }
});
