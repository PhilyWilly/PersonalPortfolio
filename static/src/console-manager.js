const htmlConsoleTextfield = document.getElementById("console-textfield");

const terminalConsole = new Terminal();
terminalConsole.userInput("help");


function consoleEntry(element) {
    if(event.key === 'Enter') {
        terminalConsole.userInput(element.value);
        htmlConsoleTextfield.value = "";
    }
}