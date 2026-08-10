# Introduction

Sogyo Adventure is a new service for Sogyo employees to buy family tickets for amusement parks with attractive discounts. The goal of Sogyo Adventure is to make it as easy as possible to buy tickets. That means that the webshop itself should be as easy to use as possible. According to market research the user base is split almost exactly between desktop, tablet and mobile devices. This means the site should work on every device - large and small.

Because Sogyo Adventure wants a single, consistent theme throughout their site, the styling defined in `main.css` should be used across all pages. The stylesheet has already been referenced on the index page (also known as a home page) and should be included in the same manner on all other pages.

The target market being Sogyo employees, the webshop can get away with assuming its userbase uses the latest version of Chrome, Firefox, Edge and other up to date browsers. This means that even though it's commonly advised to support as many older browsers as possible, Sogyo Adventure has the freedom to use the latest web technology. This includes (but is not limited to):
* Flexbox
* CSS grid
* CSS variables
* JavaScript modules
* Classes
* Interpolated string literals
* Promises
* Async await 

To get an idea of what Sogyo Adventure could look like, a prototype will first be build. Your assignment is to make that first prototype. For now you won't have to worry about security, authorisation, payment and other such things. Of course all of those are important in real life applications, but not in the prototype.

For the time being we will focus solely on the files in the `client` folder.

Open `client/index.html` in your browser of choice to see what the the application looks like to users. Also open `client/index.html` in your favorite editor. If you make changes to the html file, you'll need to reload that page in your browser. By using the developer tools within your browser, you can usually edit the html and/or css on the go, but changes aren't saved.

# Prerequisites

1. Install the Node.js webserver (https://nodejs.org/en/). You may need to restart your IDE.
2. Run the `npm install` command in the main folder of the project. This downloads the project dependencies defined in `package.json`.
3. Finally run the project using `node main.js` and going to `localhost:8000` in your browser. You should see the version of the Sogyo Adventure webshop.

In the `client` folder you'll find the files that will be sent to the client.

# Task 1: styling

Take about a day for this first task. If you can't complete it in that timeframe, don't worry. Just move on with the other tasks and come back to it later.

There's a few requirements to the look and feel of the page:
* The header should always be at the top of the page, even if the user scrolls down, so that the shopping basket is easily accessible
* The links in the menu should be center aligned
* The links in the menu should be white, whether they've been visited before or not
* The links in the menu should be highlighted in a contrasting color when hovering over them
* Style the 'add to shopping basket' button so it doesn't look like the default.
* Set a favicon (the tiny icon shown in the browsers tab bar next to the tab name)

Otherwise get creative! Try changing colors, fonts, color gradients, borders, rounded corners, shadows, transforms, animations, etc. Don't forget that the different pages should look and feel similar, yet clearly distinct from each other. It helps if you get comfortable with the idea of CSS selectors. `client/style/main.css` uses different three different kinds of CSS selectors by default, with comments describing what they do, but CSS selectors can be composed and there's more advanced ones as well.

# Task 2: the index page

The buttons to order tickets will all get the same functionality. A so called event listener that gets fired when the user clicks on one of those buttons. The following steps will guide you through the process of registering event listeners and implementing their behavior. Don't worry about the discounts for family tickets just yet.

1. Define a function on the top level of `client/src/index.js` that will act as the event listener for the "order" buttons. Name this function `orderButtonClicked`. Register it on every button using `document.querySelectorAll()` with a CSS selector as the first argument, iterating over all matching elements and finally calling `.addEventListener()` of type `"click"`. The browser will automatically call `orderButtonClicked` when the user clicks on the elements you've registered the event listener on.
2. Add a call to `console.log()`to the body of `orderButtonClicked`. Open the developer tools in your browser. Click on the order buttons. Is the call properly logged? If not: debug!
3. Event listeners receive information on events as their first argument. Add an argument named `event` to the parameter list of `orderButtonClicked`. This object has a `.target` property, in our case the element the user clicked on (the order button.) Use this element reference as a starting point and walk the DOM tree using methods and properties like `parentNode`, `classList.contains()`, `nextElementSibling`, `previousElementSibling`, among others. We are interested in three nodes: the `<div>` containing the attraction name as the text content and two `<input>` elements for the user to enter numbers. Use these nodes to find the name of the attraction (obtained by calling `.innerText` on the `<div>` element), the number of adults (obtained by calling `.value` on the `<input>` element and casting the result to a number) and the number of children (obtained the same way).
4. Write a separate function named `saveOrderInShoppingBasket` that will be called from `orderButtonClicked`. This function should receive three arguments: the name of the chosen attraction, the number of adults and the number of children. Give each of the parameters a sensible name. `orderButtonClicked` can provide this information from the nodes you've found.
5. Implement `saveOrderInShoppingBasket`. The order should be saved locally on the clients machine in a way that allows the user to close the browser without the order being lost by using `localStorage`. The `localStorage` is a key-value pair store that works with string values only. You'll need to think of a way to persist/save several orders at once.
6. Once the order is added to the shopping basket the number of items in the shopping basket should be updated. It's displayed in the element with class `"badge"` under the `"#shoppingbasket"`.

# Task 3: Shopping Basket

We'll now implement the shopping basket, in `client/shoppingbasket.html` and `client/shoppingbasket.js`.

1. The shopping basket page will have to show the user the current state of their shopping basket. To do this, first read their current orders from the `localStorage`, essentially reversing the process you used to persist it. Make sure to cast any numbers in your data back from a string to a number.
2. `client/shoppingbasket.html` defines a template, i.e. the HTML that should be used for each of the users ordered tickets, but the template itself is never shown to the user. Iterate over each ticket in the shopping basket and add a node to the `<main>` element for each ticket, based on the pre-defined `<template>`. Make sure to display the correct park name, number of adults and number of children on each ticket. The button to finalize the order should remain at the bottom of the page.
3. Add an event listener to the finalize payment method. As this is only a prototype, we skip handling the actual payment. There also is no server just yet to handle ordering tickets. Instead asume the order went OK, clear the localStorage and redirect users to `client/orderplaced.html`.

# Task 4: The server

We will be using Node.js to setup a server to handle the requests.
Web requests are an import part of modern web development. To make them easier, the `fetch()` method has been added to the JavaScript language.

It helps if you're familiar with the basics of API's. Look into: HTTP requests, HTTP verbs/methods and HTTP response codes.

1. Open `main.js` and look at the various routes defined there. Before continuing with the other tasks, understand what each of the routes does and what they might do.
2. Go back to `client/index.html` and update it so that the various attractions are no longer hard coded. Abstract the common HTML used for every attraction into a common `<template>` (like the one used in the shopping basket). When loading the page make a call to `api/attractions` using `fetch("api/attractions")`. Await the request and parse the actual response from JSON to JavaScript objects. Instantiate a template for each of the available attractions. Dynamically show the park name, the minimum number of adults and minimum number of kids for the family discount, as well as the discount (displayed in human readable percentages.)
3. On `client/shoppingbasket.html` a call should be made to `api/placeorder` when the user clicks the pay button. Because we will be sending the order data from the client to the server, this will be a POST request. This is also done using the `fetch()` method, requiring some additional configuration. Write the client side code to make the API request (in `client/shoppingbasket.html`), then the server side code to handle the request (in `main.js`). There should be one less ticket available for each ticket the user orders. Also the order should be saved into a separate array similar to the one that contains the attraction information. Now we're running the site on a webserver, we no longer should redirect users to `client/orderplaced.html` but to just `orderplaced.html`.
4. If there are no more tickets available for a certain attraction, the order button should be disabled.
5. Update `client/index.html` in a way to display the discount in real time. When the user enters a value for the number of adults or kids or changes the number, the total price should be shown. The discount should of course be factored into the total price, if eligible.
6. Display the total price for a ticket in the shopping basket.

If you're done with tasks 1 through 4 and have some time left, look into the following additional tasks to really complete the shop:

# Task 5: A responsive design (optional)

The layout should be responsive, i.e. work on desktop, tablet and phone. Use CSS media queries to set three breakpoints in your layout: smaller than 480px in width, smaller than 780px in width and bigger than that.

On small devices:
* The Sogyo Adventure title bar should use 1.5rem size fonts and be 45px in height
* The blocks with available parks should take up the whole screen width
* The white bar with the Sogyo logo shouldn't be shown
* The navigation bar should be 32px in height

On medium devices:
* The Sogyo Adventure title bar should use 2rem size fonts and be 60px in height
* Two parks should be shown next to each other
* The white bar with the Sogyo should be 200px high
* The navigation bar should be 32px in height

On large devices:
* The Sogyo Adventure title bar should use 3rem size fonts and be 80px in height
* At least three parks should be shown next to each other
* The white bar with the Sogyo should be 200px high
* The navigation bar should be 32px in height

# Task 6: Discoverable Map (optional)

Work in `map.html` and `map.js`:
* The div `#discoverablemap` should be 100vw (view width) wide and 100vh (view height) tall, minus the whole width of the white logo bar, the title bar and the navigation bar. This should result in the map taking up all remaining space. 

1. Leaflet is a library to create interactive maps. Head over to [Leaflet.js](https://leafletjs.com) and follow the quick start guide.
2. As a starting point choose `(52.1026406, 5.175044799999999)` with a zoom level of 10. This should result in a large map of The Netherlands.
3. After the map has done loading, fetch all attractions from `api/attractions` and display a marker for each attraction. The user should be able to click on the marker to see the attraction name and description. 

# Task 7: Finalizing the prototype (optional)

* Implement `client/admin.html` and a way to edit the ticket prizes, the requirements for the discount and the discount itself.
* Allow users to order tickets from the discoverable map
* Display a list of attractions ordered by prize. Allow the user to sort from highest to lowest or lowest to highest. In addition you may also allow sorting nearby to far away.
* Update your client side code to TypeScript instead of JavaScript. At the very least, define parameter types and return value types. The compiler should be able to infer the types of variables based on these other two type definitions.

# Task 8: Integration with a Database

This step should only be completed after the Database case has been completed.

Depending on the database you chose to use in the databases case, the exact steps to hook up your Node.js backend to the database can be quite different. The steps described below are a very general overview of what needs to be done.

1. Look up if a NPM package (Node Package Manager) exists for your chosen database. If so, install it by running `npm install [package-name] --save` from the command prompt in the top level directory of your project. Otherwise you might need to manually download a library and place its source code in a subdirectory of your project root.
2. Import the newly installed dependency in `main.js`, similar to how Express is imported.
3. Remove the hard coded arrays containing the database
4. Create a connection to the database, most often this is done at the top level of the script (with the connection being reused every time data is retrieved from the database). Common methods are a connection string (which includes the location the database runs at, the username and password) or a config object (containing the same information).
5. Replace reads and writes from and to the hard coded arrays you removed earlier with the queries you wrote previously.