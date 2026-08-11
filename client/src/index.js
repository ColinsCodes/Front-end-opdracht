function orderButtonClicked(event) {
    const orderParent = event.target.closest(".order");
    const ticketsAdults = Math.max(0, Number(orderParent.querySelector(".numberofadults")?.value)) || 0;
    const ticketsKids = Math.max(0, Number(orderParent.querySelector(".numberofkids")?.value)) || 0;
    const attraction = orderParent.parentNode.querySelector(".parkname").innerHTML;
    const orderTotal = tallyOrder(orderParent)

    const cartItem = {
        attractionName: attraction,
        adultTickets: ticketsAdults,
        kidTickets: ticketsKids,
        priceTotal: orderTotal
    };
    if (orderTotal) {
        saveOrderInCart(cartItem);
    }
    orderParent.querySelector(".numberofadults").value = 0;
    orderParent.querySelector(".numberofkids").value = 0;
    orderParent.querySelector(".total .price").innerHTML = "0,-";
}

document.addEventListener("DOMContentLoaded", () => {
    const allInputs = document.querySelectorAll('.numberofadults, .numberofkids');
    allInputs.forEach(input => {
        input.addEventListener('input', calculateLiveTotal);
    });
});


function calculateLiveTotal(event) {
    const orderParent = event.target.closest(".order");
    orderParent.querySelector(".total .price").innerHTML = tallyOrder(orderParent) +",-";
}

function tallyOrder(orderParent) {
    const ticketsAdult = Math.max(0, Number(orderParent.querySelector(".numberofadults")?.value)) || 0;
    const ticketsKids = Math.max(0, Number(orderParent.querySelector(".numberofkids")?.value)) || 0;
    const priceAdults = parseInt(orderParent.querySelector(".prices .adultprice .price").innerHTML);
    const priceKids = parseInt(orderParent.querySelector(".prices .kidsprice .price").innerHTML);

    let doublesAdults = Math.floor(ticketsAdult / 2);
    let doublesKids = Math.floor(ticketsKids / 2);
    let totalDoubles = Math.min(doublesAdults, doublesKids);
    let priceTotal = 0

    doublesAdults -= totalDoubles;
    doublesKids -= totalDoubles;
    priceTotal += (totalDoubles*(2*(priceKids+priceAdults)*0.85))
    priceTotal += (2*doublesKids*priceKids + 2*doublesAdults*priceAdults)
    const priceRemainder = (ticketsAdult % 2) * priceAdults + (ticketsKids % 2) * priceKids
    priceTotal += priceRemainder
    return priceTotal;
}

function saveOrderInCart(cartItem) {
    const currentOrders = JSON.parse(localStorage.getItem("orders")) || [];
    currentOrders.push(cartItem);
    localStorage.setItem("orders", JSON.stringify(currentOrders))
}
