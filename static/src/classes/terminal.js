class Terminal {
    constructor() {
        this.htmlConsoleOutput = document.getElementById("console-output");

        this.messages = []
    }

    update() {
        // Refresh the code in the html
        this.htmlConsoleOutput.innerHTML = "<pre><code>" + this.messages.map(e => e.userCommand ? "> " + e.content : "  " + e.content).join("<br>") + "</code></pre>";
        // Scroll down to the bottom of the console
        requestAnimationFrame(() => {
            this.htmlConsoleOutput.scrollTop = this.htmlConsoleOutput.scrollHeight;
        })
    }

    async userInput(input) {
        this.messages.push(new Message(input, true));
        this.update();
        await this.answerUserInput(input);
    }

    log(message) {
        console.log("Message from terminal: " + message);
        this.messages.push(new Message(message, false));
        this.update();
    }

    async answerUserInput(input) {
        const keywords = input.trim().toLowerCase().split(" ");
        const keywordLength = keywords.length;

        let answered = false;
        let helpCommandText = helpText;
        let commandDataSet = terminalData;
        
        // Looks if the keyword is in the command object
        function isKeywordInDataSet(keyword, command) {
            for (let commandKeyword of command['eng-com']) {
                if (commandKeyword === keyword) {
                    return true;
                }
            }
            for (let commandKeyword in command['ger-com']) {
                if (commandKeyword === keyword) {
                    return true;
                }
            }
            return false;
        }

        // Returns the command object of the keyword in a given set
        function giveCommandObject(keyword, commandSet) {
            for (let command of commandSet) { // Itterate through each command in the command data
                if (isKeywordInDataSet(keyword, command)) { // If the command matches the keyword
                    return command
                }
            }
        }

        for (let i = 0; i < keywordLength; i++) { // Itterate through each input keyword
            const commandObject = giveCommandObject(keywords[i], commandDataSet);
            if (commandObject === undefined) {
                if (i == keywordLength-1) {
                    if (keywords[i] === '-h' || keywords[i] === '--help') {
                        this.log(helpCommandText);
                        answered = true;
                        break;
                    }
                }
                break;
            }

            if (i == keywordLength-1) { // If this is the last keyword
                if ('eng-ans' in commandObject) {
                    commandObject['eng-ans'](this);
                    answered = true;
                }
                else if ('help' in commandObject) {
                    this.log(commandObject['help']);
                    answered = true;
                }
            }
            commandDataSet = commandObject['sub-com']; // Set new command palette
            helpCommandText = commandObject['help']; // Save the current help command
        }

        if (!answered) {
            this.log(`Command '${input}' not found! \n  Here is provided help: ${helpCommandText}`);
        }
    }
}

