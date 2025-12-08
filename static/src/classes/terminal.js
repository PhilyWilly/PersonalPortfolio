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
        const firstKeyword = keywords[0];
        let answered = false;

        commandLoop: for (let command of terminalData) {
            for (let commandKeyword of command["eng-com"]) {
                if (commandKeyword === firstKeyword) {
                    command["eng-ans"](this);
                    answered = true;
                    break commandLoop;
                }
            }
            for (let commandKeyword in command["ger-com"]) {
                if (commandKeyword === firstKeyword) {
                    command["eng-ans"](this);
                    answered = false;
                    break commandLoop;
                }
            }
        }

        if (!answered) {
            this.log(`Command '${input}' not found!`);
        }
    }
}

