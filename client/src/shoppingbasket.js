document.addEventListener("DOMContentLoaded", () => {
    orderLoader();
});

function orderLoader() {
    const totalOrders = localStorage.getItem("totalOrders") || 0;
    document.querySelector(".badge").innerHTML = totalOrders;
    document.querySelector(".badge").classList.toggle('hidden', totalOrders == 0);
    loadOrders(JSON.parse(localStorage.getItem("orders")) || []);
}

function clearCartButtonClicked() {
    localStorage.removeItem("orders");
    localStorage.removeItem("totalOrders");
    document.querySelector(".badge").classList.add('hidden');
    loadOrders([]);
}

function loadOrders(allOrders) {
    document.querySelector("#orderCartContents").innerHTML = allOrders.map((order, index) => `
        <article class="orderTotal">
            <div class="parkname">
                <span>${order.attractionName}</span>
            </div>
            <div>
                Number of tickets:
            </div>
            <div> 
                Adults: <span>${order.adultTickets}</span> Kids: <span>${order.kidTickets}</span>
            </div>
            <div>
                Price: <span class="sign">&euro;</span> <span class="pricetag">${order.priceTotal}</span>
            </div>
            <div>
                <button class="cancelItem" onclick="cancelItem(${index})">Click to cancel item</button>
            </div>
        </article>
    `).join("");
    setTotalPrice();
}
function setTotalPrice() {
    let pricetotal = 0;
    document.querySelectorAll(".pricetag").forEach(number => pricetotal += parseFloat(number.innerHTML));
    document.querySelector("#totalSum").innerHTML = Math.round(pricetotal*100)/100;
}
function cancelItem(Id) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.splice(Id, 1);
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("totalOrders", orders.length);

    orderLoader();
}

function payButtonClicked() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    fetch("/api/placeorder", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body:
            JSON.stringify({ orders: orders })
    })
        .then(response => {
            if (response.ok) {
                console.log("Order placed succesfully!");
                clearCartButtonClicked();
                window.location.href = "orderplaced.html";
            } else {
                console.error("Uh oh, an error occurred!" + response.status)
            }

        })
}