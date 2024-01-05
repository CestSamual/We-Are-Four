
document.addEventListener("DOMContentLoaded", function () {
  var postcodeInputEl = document.getElementById("postcodeInput");
  var postcodeBtnEl = document.getElementById("postcodeBtn");
  var mailToLinkEl = document.getElementById("mailToLink");

  


  postcodeBtnEl.addEventListener("click", function (event) {
    event.preventDefault(); 

    var postcode = postcodeInputEl.value;
    retrieveMemberID(postcode);
    retrieveCID(postcode);
})

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
    });
}
10-psuedocode-a-complete-draft-of-the-js
retrieveCID();


//ONS FETCH

//Fetch function with WPC code from FTPC API.
//uses pconValue in queryURL on ONS endpoint with area type as wpc.
//produces json with the tenure data with dimention objects as the stat titles with each stat in an array called observations
//target the observation array for the dimension of rent tenure
//calculate as percentage by sum the array divided by the value * 100
//this process will generate variables for the percentage, the total of rented and total of households
//append these values to front end elements - will include a classList remove of d-none

//eventListener for click of postcodeBtn to initiate ONS fetch function

//MEMBERS CONTACT PARSE

//target the email from members api fetch
//parse and append into the mailto element to ensure the memebers email is located in the recipient address in users mail app 







});
main
