document.addEventListener("DOMContentLoaded", () => {
    const totalOrders = localStorage.getItem("totalOrders") || 0;
    document.querySelector(".badge").innerHTML = totalOrders;
    document.querySelector(".badge").classList.toggle('hidden', totalOrders == 0);
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
    const ticketsAdults = Math.max(0, Number(orderParent.querySelector(".numberofadults")?.value)) || 0;
    const ticketsKids = Math.max(0, Number(orderParent.querySelector(".numberofkids")?.value)) || 0;
    const attraction = orderParent.parentNode.querySelector(".parkname").innerHTML;
    const orderTotal = tallyOrder(orderParent)
    let cartItem = JSON.parse(localStorage.getItem("order"))
    cartItem = {
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
    const totalOrders = localStorage.getItem("totalOrders");
    document.querySelector(".badge").innerHTML = totalOrders
    if (totalOrders) {
        document.querySelector(".badge").classList.remove('hidden');
    }
    if (!totalOrders) {
        document.querySelector(".badge").classList.add('hidden');
    }
}

function calculateLiveTotal(event) {
    const orderParent = event.target.closest(".order");
    orderParent.querySelector(".total .price").innerHTML = tallyOrder(orderParent) +",-";
}

function tallyOrder(orderParent) {
    const ticketsAdults = Math.max(0, Number(orderParent.querySelector(".numberofadults")?.value)) || 0;
    const ticketsKids = Math.max(0, Number(orderParent.querySelector(".numberofkids")?.value)) || 0;
    const priceAdults = parseInt(orderParent.querySelector(".prices .adultprice .price").innerHTML) || 0;
    const priceKids = parseInt(orderParent.querySelector(".prices .kidsprice .price").innerHTML) || 0;
    const reqAdults = parseInt(orderParent.querySelector(".discountrequirement .adults").innerHTML) || 0;
    const reqKids = parseInt(orderParent.querySelector(".discountrequirement .child").innerHTML) || 0;
    const percentage = parseInt(orderParent.querySelector(".discountrequirement .percentage").innerHTML) || 0;
    const discountMult = 1 - percentage/100;

    let groupAdults = reqAdults > 0 ? Math.floor(ticketsAdults / reqAdults) : 0;
    let groupKids = reqKids > 0 ? Math.floor(ticketsKids / reqKids) : 0;
    let totalDiscounted = Math.min(groupAdults, groupKids);
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
    return Math.round(priceTotal*100)/100;
}

function saveOrderInCart(cartItem) {
    const currentOrders = JSON.parse(localStorage.getItem("orders")) || [];
    currentOrders.push(cartItem);
    localStorage.setItem("orders", JSON.stringify(currentOrders));
    localStorage.setItem("totalOrders", JSON.stringify(currentOrders.length));
}
