const htmlConsoleTextfield = document.getElementById("console-textfield");
let historyIndex = -1;

const terminalConsole = new Terminal();
terminalConsole.userInput("help");


async function consoleEntry(element, event) {
    switch (event.key) {
        case "Enter":
            terminalConsole.userInput(element.value);
            htmlConsoleTextfield.value = "";
            historyIndex = -1;
            return;
        case "ArrowUp":
            historyIndex = Math.min(historyIndex+1, terminalConsole.getUserMessagesAmount()-1);
            htmlConsoleTextfield.value = terminalConsole.userHistory(historyIndex);
            break;
        case "ArrowDown":
            historyIndex = Math.max(historyIndex-1, -1);
            htmlConsoleTextfield.value = terminalConsole.userHistory(historyIndex);
            break;
        default:
            return;
        
    }
    console.log("[ DEBUG ] " + historyIndex);
    await delay(1);
    const length = htmlConsoleTextfield.value.length;
    htmlConsoleTextfield.focus();
    htmlConsoleTextfield.setSelectionRange(length, length);
}