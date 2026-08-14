document.addEventListener("DOMContentLoaded", () => {
    updateBadge();
    createMap();
});


function updateBadge() {
    const totalOrders = localStorage.getItem("totalOrders") || 0;
    document.querySelector(".badge").innerHTML = totalOrders;
    document.querySelector(".badge").classList.toggle('hidden', totalOrders == 0);
}

function createMap() {
    var map = L.map('discoverablemap').setView([52.1026406, 5.175044799999999], 8);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    addMarkers(map);
}

async function addMarkers(map){
    try {
        const response = await fetch("/api/attractions");
        const data = await response.json();
        data.forEach((attraction) => {
            var markername = L.marker([attraction.location.lat, attraction.location.lon]).addTo(map);
            markername.bindPopup(`<b>${attraction.name}</b><br>${attraction.description}`);
        })
    } catch (error) {
        console.error("Failed to fetch tickets:", error);
        return 0;
    }
}