document.addEventListener("DOMContentLoaded", () => {
    updateBadge();
    fetch("/api/attractions")
        .then(response => response.json())
        .then(data => {
            loadAttractions(data);
        })
        .then(() => {
            const allInputs = document.querySelectorAll('.numberofadults, .numberofkids');
            allInputs.forEach(input => {
                input.addEventListener('input', calculateLiveTotal);
            })
            document.querySelectorAll(".order").forEach(input => updateTickets(input));
        })
});

function loadAttractions(data) {
    const container = document.querySelector(".articles")
    const template = document.querySelector("#attraction")

    if (!container || !template) return;

    data.forEach((attraction, index) => {
        const templateClone = template.content.cloneNode(true)
        templateClone.querySelector(".adultprice .price").innerHTML = attraction.adultPrice
        templateClone.querySelector(".kidsprice .price").innerHTML = attraction.kidsPrice
        templateClone.querySelector(".discountrequirement .adults").innerHTML = attraction.minimumNumberOfAdults;
        templateClone.querySelector(".discountrequirement .child").innerHTML = attraction.minimumNumberOfKids;
        templateClone.querySelector(".discountrequirement .percentage").innerHTML = attraction.discount;
        templateClone.querySelector(".ticketsAvailable .number").innerHTML = attraction.available;
        templateClone.querySelector(".parkname").innerHTML = attraction.name;
        templateClone.querySelector(".parkdescription").innerHTML = attraction.description;
        container.appendChild(templateClone);
    })
}

function orderButtonClicked(event) {
    const orderParent = event.target.closest(".order");
    const cartItem = createCartItem(orderParent);
    const totalTickets = cartItem.adultTickets + cartItem.kidTickets;
    if (cartItem.priceTotal && checkTicketAvailability(orderParent, totalTickets)) {
        saveOrderInCart(cartItem);
    }
    resetOrder(orderParent);
    updateBadge();
    updateTickets(orderParent);
}

function createCartItem(orderParent) {
    const ticketsAdults = Math.max(0, Number(orderParent.querySelector(".numberofadults")?.value)) || 0;
    const ticketsKids = Math.max(0, Number(orderParent.querySelector(".numberofkids")?.value)) || 0;
    const totalTickets = ticketsAdults + ticketsKids;
    const attraction = orderParent.parentNode.querySelector(".parkname").innerHTML;
    const orderTotal = tallyOrder(orderParent)[0]
    const cartItem = {
        attractionName: attraction,
        adultTickets: ticketsAdults,
        kidTickets: ticketsKids,
        priceTotal: orderTotal,
        date: new Date()
    };
    return cartItem;
}

function updateBadge() {
    const totalOrders = localStorage.getItem("totalOrders") || 0;
    document.querySelector(".badge").innerHTML = totalOrders;
    document.querySelector(".badge").classList.toggle('hidden', totalOrders == 0);
}

function resetOrder(orderParent) {
    orderParent.querySelector(".numberofadults").value =  null;
    orderParent.querySelector(".numberofkids").value = null;
    orderParent.querySelector(".total .price").innerHTML = "0,-";
}

function checkTicketAvailability(orderParent, totalTickets) {
    return orderParent.querySelector(".ticketsAvailable .number").innerHTML >= totalTickets;
}

function checkCartForTickets(orderParent) {
    const attractionName = orderParent.parentElement.querySelector(".parkname").innerHTML
    const currentOrders = JSON.parse(localStorage.getItem("orders")) || [];
    let totalTickets = 0;
    currentOrders.forEach(order => {
        if (order.attractionName == attractionName) {
            totalTickets += order.kidTickets + order.adultTickets;
        }
    })
    return totalTickets;
}

function calculateLiveTotal(event) {
    const orderParent = event.target.closest(".order");
    const talliedOrder = tallyOrder(orderParent)
    if (talliedOrder[0] == Math.round(talliedOrder[0])) {talliedOrder[0] += ",-"};
    orderParent.querySelector(".total .price").innerHTML = talliedOrder[0];
    let discountedAmount = talliedOrder[1];
    if (discountedAmount == Math.round(discountedAmount)) { discountedAmount += ",-" };
    if (parseFloat(discountedAmount) > 0) {
        orderParent.querySelector(".discountAmount").textContent = "Discount unlocked! Amount saved: € " + discountedAmount
    } else {
        orderParent.querySelector(".discountAmount").textContent = null
    }
}

async function updateTickets(orderParent) {
    const attractionName = orderParent.parentElement.querySelector(".parkname").innerHTML;
    orderParent.querySelector(".ticketsAvailable .number").innerHTML = await fetchAvailableTickets(attractionName) - checkCartForTickets(orderParent);
}

function tallyOrder(orderParent) {
    const ticketsAdults = Math.max(0, Number(orderParent.querySelector(".numberofadults")?.value)) || 0;
    const ticketsKids = Math.max(0, Number(orderParent.querySelector(".numberofkids")?.value)) || 0;
    const totalTickets = ticketsAdults + ticketsKids;
    const priceAdults = parseInt(orderParent.querySelector(".prices .adultprice .price").innerHTML) || 0;
    const priceKids = parseInt(orderParent.querySelector(".prices .kidsprice .price").innerHTML) || 0;
    const reqAdults = parseInt(orderParent.querySelector(".discountrequirement .adults").innerHTML) || 0;
    const reqKids = parseInt(orderParent.querySelector(".discountrequirement .child").innerHTML) || 0;
    const percentage = parseInt(orderParent.querySelector(".discountrequirement .percentage").innerHTML) || 0;
    const discountMult = 1 - percentage/100;
    
    orderParent.querySelector(".orderbutton").disabled = !checkTicketAvailability(orderParent, totalTickets);
    
    let groupAdults = reqAdults > 0 ? Math.floor(ticketsAdults / reqAdults) : 0;
    let groupKids = reqKids > 0 ? Math.floor(ticketsKids / reqKids) : 0;
    let totalDiscounted = 0;
    if (reqAdults && reqKids) {
        totalDiscounted = Math.min(groupAdults, groupKids);
    } else {
        totalDiscounted = Math.max(groupAdults, groupKids);
    }
    let priceTotal = 0;
    let priceRemainder = 0;

    groupAdults -= totalDiscounted;
    groupKids -= totalDiscounted;
    priceTotal += (totalDiscounted*((priceKids*reqKids+priceAdults*reqAdults)*(discountMult)));
    priceTotal += reqKids*groupKids*priceKids;
    priceTotal += reqAdults*groupAdults*priceAdults;
    priceRemainder += reqAdults > 0 ? (ticketsAdults % reqAdults) * priceAdults : ticketsAdults*priceAdults;
    priceRemainder += reqKids > 0 ? (ticketsKids % reqKids) * priceKids : ticketsKids * priceKids;
    priceTotal += priceRemainder;
    let totalDiscount = (ticketsAdults*priceAdults + ticketsKids*priceKids) - priceTotal;
    return [ (Math.round(priceTotal*100)/100), (Math.round(totalDiscount*100)/100) ];
}

function saveOrderInCart(cartItem) {
    const currentOrders = JSON.parse(localStorage.getItem("orders")) || [];
    currentOrders.push(cartItem);
    localStorage.setItem("orders", JSON.stringify(currentOrders));
    localStorage.setItem("totalOrders", JSON.stringify(currentOrders.length));
}

async function fetchAvailableTickets(attractionName) {
    try {
        const response = await fetch("/api/attractions");
        const data = await response.json();
        const attraction = data.find(item => item.name == attractionName);
        
        return attraction ? attraction.available : 0;
    } catch (error) {
        console.error("Failed to fetch tickets:", error);
        return 0;
    }
}