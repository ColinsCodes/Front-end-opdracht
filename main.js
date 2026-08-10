/**
 * Server side code using the express framework running on a Node.js server.
 * 
 * Load the express framework and create an app.
 */
const express = require('express');
const app = express();
/** 
 * Host all files in the client folder as static resources.
 * That means: localhost:8080/someFileName.js corresponds to client/someFileName.js.
 */
app.use(express.static('client'));

/**
 * Allow express to understand json serialization.
 */
app.use(express.json());

/**
 * Our code starts here.
 */
const attractions = [
    { 
        name: "De Efteling",
        description: "The Dutch fairy tale themed park. In high demand!",
        adultPrice: 32,
        kidsPrice: 32,
        minimumNumberOfAdults: 2,
        minimumNumberOfKids: 1,
        discount: 15,
        available: 1,
        location: { lat: 51.649718, lon: 5.043689 },
    },

    { 
        name: "Madurodam",
        description: "The Netherlands smallest theme park.",
        adultPrice: 25,
        kidsPrice: 20,
        minimumNumberOfAdults: 1,
        minimumNumberOfKids: 2,
        discount: 25,
        available: 5,
        location: { lat: 52.0994779, lon: 4.299619900000039 },
    },

    { 
        name: "Toverland",
        description: "Experience magic and wonder.",
        adultPrice: 30,
        kidsPrice: 30,
        minimumNumberOfAdults: 2,
        minimumNumberOfKids: 2,
        discount: 33,
        available: 3,
        location: { lat: 51.3968994, lon: 5.9825161 },
    },

    { 
        name: "Walibi Holland",
        description: "Need an Adrenaline Rush?",
        adultPrice: 37,
        kidsPrice: 37,
        minimumNumberOfAdults: 4,
        minimumNumberOfKids: 0,
        discount: 10,
        available: 20,
        location: { lat: 52.438554, lon: 5.766986 },
    },
    
    { 
        name: "Duinrell",
        description: "From the Kikkerbaan to the Tikibad.",
        adultPrice: 22,
        kidsPrice: 19,
        minimumNumberOfAdults: 1,
        minimumNumberOfKids: 3,
        discount: 7,
        available: 20,
        location: { lat: 52.147433, lon: 4.383922 },
    }, 

    { 
        name: "Slagharen",
        description: "Fun for the whole family in a true western style.",
        adultPrice: 28,
        kidsPrice: 20,
        minimumNumberOfAdults: 2,
        minimumNumberOfKids: 2,
        discount: 50,
        available: 2,
        location: { lat: 52.6249522, lon: 6.563149500000009 },
    }, 

    { 
        name: "Drievliet",
        description: "Come and experience our wonderful attractions.",
        adultPrice: 26,
        kidsPrice: 24,
        minimumNumberOfAdults: 1,
        minimumNumberOfKids: 2,
        discount: 25,
        available: 0,
        location: { lat: 52.052608, lon: 4.352633 },
    }, 
]

/**
 * A route is like a method call. It has a name, some parameters and some return value.
 * 
 * Name: /api/attractions
 * Parameters: the request as made by the browser
 * Return value: the list of attractions defined above as JSON
 * 
 * In addition to this, it has a HTTP method: GET, POST, PUT, DELETE
 * 
 * Whenever we make a request to our server,
 * the Express framework will call one of the methods defined here.
 * These are just regular functions. You can edit, expand or rewrite the code here as needed.
 */
app.get("/api/attractions", function (request, response) {
    console.log("Api call received for /attractions");

    response.json(attractions)
});

app.post("/api/placeorder", function (request, response) {
    console.log("Api call received for /placeorder");

    /**
     * Send the status code 200 back to the clients browser.
     * This means OK.
     */
    response.sendStatus(200);
});

app.get("/api/myorders", function (request, response) {
    console.log("Api call received for /myorders");

    response.sendStatus(200);
});

app.get("/api/admin/edit", function (request, response) {
    console.log("Api call received for /admin/edit");

    response.sendStatus(200);
});


/**
 * Make our webserver available on port 8000.
 * Visit localhost:8000 in any browser to see your site!
 */
app.listen(8000, () => console.log('Example app listening on port 8000!'));