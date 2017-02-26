function addLink() {
    var newLink = location.origin + location.pathname;
    if (newLink[newLink.length - 1] === "/") {
        newLink += "add";
    } else {
        newLink += "/add";
    }

    window.location = newLink;
}

function editLink(id) {
    var newLink = location.origin + location.pathname;
    if (newLink[newLink.length - 1] === "/") {
        newLink += "edit";
    } else {
        newLink += "/edit";
    }

    window.location = newLink + "/" + id;
}
