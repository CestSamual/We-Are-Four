function retrieveMemberID() {
    var postcode = "L40TH";

    var queryURL = "https://members-api.parliament.uk/api/Location/Constituency/Search?searchText=" + postcode + "&skip=0&take=1";
    console.log(queryURL);

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
    var queryURL = "https://members-api.parliament.uk/api/Members/" + memberID + "/Contact";
    console.log(queryURL);

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

