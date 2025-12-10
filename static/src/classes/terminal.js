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
        let previousCommandObject;
        let commandDataSet = terminalData;
        
        // Looks if the keyword is in the command object
        function isKeywordInDataSet(keyword, command) {
            for (let commandKeyword of command['eng-com']) {
                if (commandKeyword === keyword) {
                    return true;
                }
            }
            if (!('ger-com' in command)) return false;
            for (let commandKeyword of command['ger-com']) {
                if (commandKeyword === keyword) {
                    return true;
                }
            }
            return false;
        }

        // Returns the command object of the keyword in a given set
        function giveCommandObject(keyword, commandSet) {
            if (commandSet == undefined) return undefined;
            for (let command of commandSet) { // Itterate through each command in the command data
                if (isKeywordInDataSet(keyword, command)) { // If the command matches the keyword
                    return command
                }
            }
        }

        function logSubCommands(terminal, commandList) {
            let subCommands = false; // This is that "Sub-commands" dont get printed, when not needed
            const sortedCommandList = commandList.sort((a, b) => a['eng-com'][0].localeCompare(b['eng-com'][0]))
            for (let sub of sortedCommandList) {
                if ('secret' in sub && sub['secret']) continue;
                if (!subCommands) terminal.log("Sub-commands:");
                subCommands = true;
                terminal.log("  " + sub['eng-com'][0] + ": " + sub['help']);
            }
        }

        function helpText(terminal, commandObject) {
            if (commandObject == undefined) {
                commandObject = terminalData[0]; // Help command
            }
            if (commandObject['eng-com'][0] === 'help') {
                terminal.log("This is a terminal! Feel free to try out these commands:");
                logSubCommands(terminal, terminalData);
                terminal.log("");
                terminal.log("If you need any help with these commands, you can always try '-h' or '--help' at the end of the command")
                return;
            }
            terminal.log(commandObject['help']);
            if ('sub-com' in commandObject) {
                logSubCommands(terminal, commandObject['sub-com']);
                
            }
        }

        for (let i = 0; i < keywordLength; i++) { // Itterate through each input keyword
            if (answered) return;
            const commandObject = giveCommandObject(keywords[i], commandDataSet);
            if (commandObject === undefined) {
                if (i == keywordLength-1) {
                    if (keywords[i] === '-h' || keywords[i] === '--help') {
                        helpText(this, previousCommandObject);
                        answered = true;
                    }
                }
                break;
            }

            if ('uses-input' in commandObject && commandObject['uses-input']) { // If this command will now take over
                // From now on the command will execute with the rest of the keywords 
                // as inputs for the execution function
                //
                // Except it is a help command

                // Exception no more keywords
                if (i == keywordLength-1) {
                    helpText(this, commandObject);
                    answered = true;
                    break;
                }
                // Exception a help keyword
                if (keywords[i+1] == "-h" || keywords[i+1] == "--help") {
                    helpText(this, commandObject);
                    answered = true;
                    break;
                }               

                let inputWord = "";
                for (let j = i+1; j < keywordLength; j++) {
                    inputWord += keywords[j] + " ";
                }
                commandObject['eng-ans'](this, inputWord);
                answered = true;
                break;
            }
            else if (i == keywordLength-1)  { // If this is the last keyword
                if (commandObject['eng-com'][0] === "help") {
                    helpText(this, commandObject);
                    answered = true;
                    break;
                }
                if ('eng-ans' in commandObject) {
                    commandObject['eng-ans'](this);
                    answered = true;
                    break;
                }
                if ('help' in commandObject) {
                    helpText(this, commandObject);
                    answered = true;
                    break;
                }
            }
            commandDataSet = commandObject['sub-com']; // Set new command palette
            previousCommandObject = commandObject; // Save the current help command
        }

        if (!answered) {
            this.log("Command '" + input + "' not found! \n  Here is provided help: ");
            helpText(this, previousCommandObject);
        }
    }
}

