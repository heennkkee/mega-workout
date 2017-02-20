function elevateAndMoveHigher(el) {
    var currOrder = el.style.order, x = 0;
    if (currOrder === 1) {
        return;
    }
    var allEls = el.parentNode.children;
    console.log(el.style.order);
    for (x = 0; x < allEls.length; x += 1) {
        console.log(allEls[x]);
        if (Number(allEls[x].style.order) == currOrder - 1) {
            allEls[x].style.order = Number(allEls[x].style.order) + 1;
        }
    }

    el.style.order = currOrder - 1;
    console.log(el.style.order);
}
