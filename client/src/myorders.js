document.addEventListener("DOMContentLoaded", () => {
    updateBadge();
    initializePage();
});

async function initializePage() {
    const orderlist = await callCompletedOrders();
    loadOrders(orderlist);
}

function updateBadge() {
    const totalOrders = localStorage.getItem("totalOrders") || 0;
    document.querySelector(".badge").innerHTML = totalOrders;
    document.querySelector(".badge").classList.toggle('hidden', totalOrders == 0);
}

async function callCompletedOrders() {
    const response = await fetch("/api/completedOrders");
    const completedOrders = await response.json();
    return completedOrders;
}

function loadOrders(completedOrders) {
    const container = document.querySelector(".articles")
    const template = document.querySelector("#completedOrders")

    if (!container || !template || !completedOrders) return;

    completedOrders.forEach(order => {
        const date = new Date(order.date)
        const templateClone = template.content.cloneNode(true);
        templateClone.querySelector(".parkname").textContent = order.attractionName;
        templateClone.querySelector(".adultTicket").textContent = order.adultTickets;
        templateClone.querySelector(".childTicket").textContent = order.kidTickets;
        templateClone.querySelector(".price").textContent = order.priceTotal;
        if (order.priceTotal == Math.round(order.priceTotal)) {
            templateClone.querySelector(".zerocents").textContent = ",-"
        }
        templateClone.querySelector(".ordertime .date").textContent = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        templateClone.querySelector(".ordertime .time").textContent = date.getHours() + ":" + date.getMinutes();
        container.appendChild(templateClone);
    })
}