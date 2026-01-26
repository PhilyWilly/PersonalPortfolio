function clickBitcoin() {
    if (connectedToWebsocket) {
        terminalConsole.userInput("bitcoin stop");
    }
    else {
        terminalConsole.userInput("bitcoin start");
    }
}
function rightClickBitcoin() {
    terminalConsole.userInput("bitcoin stop");
    setTimeout(() => terminalConsole.userInput("bitcoin clear"), 300);
    
}

function clickCV() {
    openPopup('popup-cv');
}
function clickGitHub() {
    window.open('https://github.com/PhilyWilly');
}
function clickLegal() {
    window.open('/legal');
}
function clickName() {
    terminalConsole.userInput("name");
}
function clickAge() {
    terminalConsole.userInput("age");
}

function clickProfile() {
    terminalConsole.userInput("face");
}