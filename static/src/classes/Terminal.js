class Terminal {
    constructor() {
        this.htmlConsoleOutput = document.getElementById("console-output");
        this.halt = false;

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

    clear() {
        this.messages = [];
        this.update();
    }

    async userInput(input) {
        if (this.halt) return;
        this.messages.push(new Message(input, true));
        this.update();
        await this.answerUserInput(input);
    }

    log(message) {
        console.log("[ Terminal ] " + message);
        this.messages.push(new Message(message, false));
        this.update();
    }

    getUserMessagesAmount() {
        return this.messages.filter(message => message.userCommand).length;
    }
    userHistory(index) {
        if (index < 0) return "";
        return this.messages.filter(message => message.userCommand)[this.getUserMessagesAmount() - index - 1].content;
    }

    _logSubCommands(commandList) {
        let subCommands = false; // This is that "Sub-commands: " dont get printed, when not needed
        const sortedCommandList = commandList.sort((a, b) => a['eng-com'][0].localeCompare(b['eng-com'][0]))
        for (let sub of sortedCommandList) {
            if ('secret' in sub && sub['secret']) continue;
            if (!subCommands) this.log("Sub-commands:");
            subCommands = true;
            let helpText = null;
            helpText = sub['short-help'] + " Type '" + sub['eng-com'][0] + " -h' for more info.";

            if (sub['short-help'] == null) {
                helpText = sub['help'];
            }
            this.log("  " + sub['eng-com'][0] + ": \t" + helpText);
        }
    }

    _getHelpCommandObject() {
        for (let command of terminalData) {
            if (command["eng-com"][0] === "help") return command;
        }
    }

    logHelpText(commandObject) { // Log the help text for a given command
        if (commandObject == undefined) { // If no command, do gerneral help
            commandObject = this._getHelpCommandObject();
        }
        if (commandObject['eng-com'][0] === 'help') {
            this.log("This is a terminal! Feel free to try out these commands:");
            this._logSubCommands(terminalData);
            this.log("");
            this.log("If you need any help with these commands, you can always try '-h' or '--help' at the end of the command")
            return;
        }
        this.log(commandObject['help']);
        if ('sub-com' in commandObject) {
            this._logSubCommands(commandObject['sub-com']);
        }
    }

    // Looks if the keyword is in the command object
    isKeywordInDataSet(keyword, command) {
        for (let commandKeyword of command['eng-com']) {
            if (commandKeyword === keyword) return true;
        }
        if (!('ger-com' in command)) return false;
        for (let commandKeyword of command['ger-com']) {
            if (commandKeyword === keyword) return true;
        }
        return false;
    }

    // Returns the command object of the keyword in a given set
    giveCommandObject(keyword, commandSet) {
        if (commandSet == undefined) return undefined;
        for (let command of commandSet) { // Itterate through each command in the command data
            if (this.isKeywordInDataSet(keyword, command)) { // If the command matches the keyword
                return command
            }
        }
    }

    // Extract all the variables in a map and remove them from the keyword set.
    //
    // Example: keywords: ["nmap", "--ip", "192.168.178.1"]
    // Result: (["nmap"], {"--ip": "192.168.178.1"})
    extractVariables(keywords) {
        let variableMap = {};
        let newKeywords = [];
        let keywordsComplete = false;
        for (let i = 0; i < keywords.length; i++) { // Itter through ech keyword and variable
            // console.log("I: " + i);
            if (keywords[i].charAt(0) == '-') {
                keywordsComplete = true;
                const variableName = keywords[i];
                let vaiableValue = "";
                for (let j = i + 1; j < keywords.length; j++) { // Itter through the variable
                    i = j - 1;
                    if (keywords[j].charAt(0) == '-') {
                        break;
                    }
                    vaiableValue += keywords[j] + " ";
                }
                variableMap[variableName] = vaiableValue.trim();
                if (i === keywords.length - 1) {
                    console.log('break');
                    break;
                }
            }
            else {
                if (!keywordsComplete) {
                    newKeywords.push(keywords[i]);
                }
            }
        }
        return [newKeywords, variableMap];
    }

    async answerUserInput(input) {
        const rawKeywords = input.trim().split(" ");

        let answered = false;
        let helpNeeded = false;
        let previousCommandObject;
        let commandDataSet = terminalData;

        const [keywords, variables] = this.extractVariables(rawKeywords);

        if (Object.keys(variables).includes('-h') || Object.keys(variables).includes('--help')) {
            helpNeeded = true;
        }
        for (let variable in variables) {
            console.log("[ DEBUG ] Var: " + variable + " Value: " + variables[variable]);
        }
        for (let keyword of keywords) {
            console.log("[ DEBUG ] Keyword: " + keyword);
        }
        for (let i = 0; i < keywords.length; i++) { // Itterate through each input keyword
            if (answered) return;
            const commandObject = this.giveCommandObject(keywords[i].toLowerCase(), commandDataSet);
            if (commandObject === undefined) { // If the current keyword isnt known
                if (i == keywords.length - 1) {
                    if (helpNeeded) {
                        this.logHelpText(previousCommandObject);
                        answered = true;
                    }
                }
                break;
            }

            if ('uses-input' in commandObject && commandObject['uses-input']) { // If this command will now take over
                // From now on the command will execute with the rest of the keywords 
                // as inputs for the execution function
                if (helpNeeded) {
                    this.logHelpText(commandObject);
                    answered = true;
                    break;
                }

                let inputWord = "";
                for (let j = i + 1; j < keywords.length; j++) {
                    inputWord += keywords[j] + " ";
                }
                inputWord = inputWord.trim();
                commandObject['eng-ans'](this, inputWord, variables);
                answered = true;
                break;
            }
            else if (i == keywords.length - 1) { // If this is the last keyword
                if ('eng-ans' in commandObject) {
                    commandObject['eng-ans'](this, variables);
                    answered = true;
                    break;
                }
            }
            commandDataSet = commandObject['sub-com']; // Set new command palette
            previousCommandObject = commandObject; // Save the current help command
        }

        if (!answered) {
            this.log("Command '" + input + "' not found! \n  Here is provided help: ");
            this.logHelpText(previousCommandObject);
        }
    }

    async ynQuestion() {
        this.halt = true;
        // To be honest, the Promise part was coded with Copilot
        // I tried my best to understand it tho afterwards
        // If you didnt know I coded almost everything myself 
        // (except for this)
        return new Promise((resolve) => {
            const originalUserInput = this.userInput.bind(this);
            this.userInput = async (input) => {
                this.halt = false;
                this.userInput = originalUserInput;
                switch (input.toLowerCase()) {
                    case 'y':
                    case 'yes':
                    case 'j':
                    case 'ja':
                        resolve(true);
                        break;
                    default:
                        resolve(false);
                }
            };
        });
    }
}

