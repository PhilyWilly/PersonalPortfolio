const htmlPopups = Array.from(document.getElementsByClassName("popup"));

function closePopup(id=-1) {
    if (id === -1) { // Close all when there is no id
        for (popup of htmlPopups) {
            hidePopup(popUp); 
        }
        return;
    }
    for (popup of htmlPopups.filter((e) => e.id === id)) {
        hidePopup(popup);
    }
}

function openPopup(id=-1) {
    if (id === -1) { // Close all when there is no id
        for (popup of htmlPopups) {
            showPopup(popUp); 
        }
        return;
    }
    showPopup(htmlPopups.filter((e) => e.id === id)[0]);
    console.log("Showing " + id)
}

function showPopup(popUp) {
    popUp.style.display = "block";
    resizeFrames();
}
function hidePopup(popUp) {
    popUp.style.display = "none";
    resizeFrames();
}
