const htmlPopups = Array.from(document.getElementsByClassName("popup"));

function closePopup(id=-1) {
    if (id === -1) { // Close all when there is no id
        for (popup of htmlPopups) {
            popup.style.display = "none"; 
        }
        return;
    }
    for (popup of htmlPopups.filter((e) => e.id === id)) {
        popup.style.display = "none";    
    }
}

function openPopup() {
    for (popup of htmlPopups) {
        popup.style.display = "none"; 
    }
}