function orderButtonClicked(event) {
    const orderParent = event.target.closest(".order");
    const attraction = orderParent.parentNode.querySelector(".parkname").innerHTML;
    const ticketsAdult = Number(orderParent.querySelector(".numberofadults").value) || 0;
    const ticketsKids = Number(orderParent.querySelector(".numberofkids").value) || 0;
    const priceAdults = parseInt(orderParent.querySelector(".prices .adultprice .price").innerHTML);
    const priceKids = parseInt(orderParent.querySelector(".prices .kidsprice .price").innerHTML);
    orderParent.querySelector(".total .price").innerHTML = priceAdults*ticketsAdult+priceKids*ticketsKids + ",-";
}
