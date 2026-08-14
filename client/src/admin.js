document.addEventListener("DOMContentLoaded", () => {
    updateBadge();
    loadLoginScreen();
});

function updateBadge() {
    const totalOrders = localStorage.getItem("totalOrders") || 0;
    document.querySelector(".badge").innerHTML = totalOrders;
    document.querySelector(".badge").classList.toggle('hidden', totalOrders == 0);
}

function loadLoginScreen() {
    document.querySelector("#content").innerHTML = `
        <div class="login-container">
            <div>Welcome to the administrator site!</div>
            <div>Please log in:</div>
      
            <label for="username">Username:</label>
            <input id="username" placeholder="Username" type="text" />
      
            <label for="password">Password:</label>
            <input id="password" placeholder="Password" type="password" />
            <button type="submit" onclick="logInButtonClicked(event)" title="Click here to log in.">Log In</button>
            <div id="errormessage"></div>
        </div>
    `
}
function logInButtonClicked(event){
    const parent = event.target.closest(".login-container");
    const username = parent.querySelector("#username").value;
    const password = parent.querySelector("#password").value;
    console.log("username: " + username + " password: " + password)
    parent.querySelector("#username").value = null;
    parent.querySelector("#password").value = null;
    if (username == "admin" && password == "1234") {
        logInSucceeded();
    } else {
        parent.querySelector("#errormessage").innerHTML = "ERROR: Incorrect login credentials"
        console.log("Login attempt aborted: incorrect credentials")
    }

}
function logInSucceeded() {
    document.querySelector("#content").textContent = null;
    document.querySelector("#content").innerHTML = `
    <body style="height: 2em; width: 10em;">
        <div>Welcome, administrator!</div>
        <div>Please update the listing of an attraction.</div><br/>
        <label for="attraction">Attraction:</label> <br/>
        <select id="attraction" style="width:12em;">
            <option value="placeholder">Attracties...</option>
            <option value="efteling">De Efteling</option>
            <option value="madurodam">Madurodam</option>
            <option value="toverland">Toverland</option>
            <option value="walibi">Walibi Holland</option>
            <option value="duinrell">Duinrell</option>
            <option value="slagharen">Slagharen</option>
            <option value="drievliet">Drievliet</option>
            <option value="new">Nieuw attractiepark</option>
        </select> <br/><br/>
        <label for="priceAdult">Price adult ticket:</label><br/>
        <input id="priceAdult" placeholder="Price" type="number" style="width: 8em;"/><br/>
        <label for="priceChild">Price kid ticket:</label><br/>
        <input id="priceChild" placeholder="Price" type="number" style="width: 8em;"/><br/>
        <label for="reqAdults">Required adult tickets for discount:</label><br/>
        <input id="reqAdults" placeholder="Amount" type="number" style="width: 8em;"/><br/>
        <label for="reqChild">Required kid tickets for discount:</label><br/>
        <input id="reqChild" placeholder="Amount" type="number" style="width: 8em;"/><br/>
        <label for="discountAmount">Amount discounted:</label><br/>
        <input id="discountAmount" placeholder="Percentage" type="number" style="width: 8em;"/><br/><br/>
        <input id="submitChanges" placeholder="Submit changes" type="submit" style="height: 2em; width: 4em;"></input>
    </body>
    `
}
