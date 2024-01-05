var postcodeInputEl = getElementById("postcodeInput");
// DOM Elements

var postcodeBtnEl = getElementById("postcodeBtn");

var postcode = "L40TH";
function retrieveMemberID() {
  var queryURL =
    "https://members-api.parliament.uk/api/Location/Constituency/Search?searchText=" +
    postcode +
    "&skip=0&take=1";
  // console.log(queryURL);

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
    });
}

retrieveMemberID();

function retrieveCID() {
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





