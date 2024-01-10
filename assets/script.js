//Initialise Page
document.addEventListener("DOMContentLoaded", function () {
  var postcodeInputEl = document.getElementById("postcodeInput");
  var postcodeBtnEl = document.getElementById("postcodeBtn");
  var mailToLinkEl = document.getElementById("mailToLink");
  var areRentingEl = document.getElementById("areRenting");
  var rentOutOfEl = document.getElementById("rentOutOf");
  var peopleInAreaEl = document.getElementById("peopleInArea");
  var displayResultsEl = document.getElementById("displayResults")
  var voteImgEL = document.getElementById("voteImg")

  //Event Listener for postcode submission click
  postcodeBtnEl.addEventListener("click", function (event) {
    event.preventDefault(); 

    var postcode = postcodeInputEl.value;

    if (validatePostcode(postcode)){  
      retrieveMemberID(postcode);
      retrieveCID(postcode); 
  } else {
    document.getElementById("userFeedback").classList.remove("d-none");
    console.log("Incorrect Postcode, wrong format")
  }
    
    
})
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
      var memberID = data.items[0].value.currentRepresentation.member.value.id;
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
  var queryURL = "https://findthatpostcode.uk//postcodes/" + postcode + ".json";
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
function retrieveONS(pconValue){
  var queryURL = "https://api.beta.ons.gov.uk/v1/datasets/TS054/editions/2021/versions/4/json?area-type=wpc," + pconValue;

  fetch(queryURL)
  .then(function (response){
    return response.json();
  })
  .then(function (data) {
    var statistics = data.observations;
    //Calculation variables
    var sumStat = 0;
    for (var i = 0; i < statistics.length; i++){
      sumStat += statistics[i];
    };
    var rentingStat = statistics[6] + statistics[7];
    var rentingPercentStat = (rentingStat / sumStat) * 100;
    //Parse to HTML elements
    voteImgEL.classList.add("d-none");
    displayResultsEl.classList.remove("d-none");
    areRentingEl.innerHTML = rentingPercentStat.toFixed(0) + "%";
    rentOutOfEl.innerHTML = rentingStat;
    peopleInAreaEl.innerHTML = sumStat;
  })
  
}
// Validation function for the postcode
function validatePostcode(postcode) {
  // Check if the postcode is greater than 8 characters
  if (postcode.length > 8) {
    return false;
  }

  // Check if the postcode includes at least 2 numbers
  var numbersCount = postcode.replace(/[^0-9]/g, "").length;
  if (numbersCount < 2) {
    return false;
  }

  // Check if the postcode includes any special characters
  if (/[^a-zA-Z0-9]/.test(postcode)) {
    return false;
  }

  return true;
}


});