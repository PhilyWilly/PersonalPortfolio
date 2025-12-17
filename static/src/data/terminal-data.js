/**
 * Data structure of the terminal:
 * 
 * List<String> eng-com: is the english trigger command
 * List<String> ger-com: is ther german trigger command
 * 
 * bool secret: this wont show in any help menu :3
 * bool uses-input: this uses the rest of the command as a input of the answer function (cant be used with sub-com)
 * 
 * function(terminal) eng-ans: is the english answer to the command 
 * 
 * String help: will return a helper text for the command 
 * 
 * List<terminalData> sub-com: This is a list of subcommands that can run with the current command
 */

let terminalData = [];

// Help command has to be at index one
terminalData[0] = {
    "eng-com": ["help"],
    "ger-com": ["hilfe"],
    "eng-ans": (terminal) => terminal.log(helpText),
    "help": "This command will return the help menu to use the terminal"
};

terminalData.push({
    "eng-com": ["age"],
    "ger-com": ["alter"],
    "eng-ans": (terminal) => terminal.log(getAge()),
    "help": "This command will return the current age of David"
});

terminalData.push({
    "eng-com": ["clear", "clr"],
    "ger-com": ["löschen"],
    "eng-ans": (terminal) => terminal.clear(),
    "help": "This command will clear the console"
});

terminalData.push({
    "eng-com": ["echo", "print", "say"],
    "uses-input": true,
    "eng-ans": (terminal, input) => terminal.log(input),
    "help": "This command will echo what is written after the echo in the terminal. For logging purposes"
});

terminalData.push({
    "eng-com": ["name", "firstname", "lastname"],
    "ger-com": ["vorname", "nachname"],
    "eng-ans": (terminal) => terminal.log("David Wesch"),
    "help": "This command will return the full name of David"
});

terminalData.push({
    "eng-com": ["ip", "ipconfig", "ip-config"],
    "eng-ans": async (terminal) => {
        const ip = await getIp(terminal);
        terminal.log("IP-Adress: " + ip);
    },
    "help": "This command will return the current public IP address"
});

terminalData.push({
    "eng-com": ["ping", "speed", "connection"],
    "eng-ans": async (terminal) => {
        const ping = await pingServer(terminal);
        terminal.log("Ping: " + ping + "ms");
    },
    "help": "This command will determine the current ping between server and client",
    "sub-com": [{
        "eng-com": ["fake"],
        "secret": true,
        "eng-ans": (terminal) => terminal.log("Ping: 0ms"),
        "help": "This is a test for the ping method. For testing only!"
    }]
});

terminalData.push({
    "eng-com": [":3"],
    "secret": true,
    "eng-ans": async (terminal) => terminal.log("LY :3"),
    "help": "IYKYK",
});

terminalData.push({
    "eng-com": ["bitcoin"],
    "help": "This command is for handling the connection to the blockchain bitcoin server",
    "sub-com": [
        {
            "eng-com": ["start"],
            "eng-ans": (terminal) => {
                connectToBitcoin();
                terminal.log("Connected sucessfully!")
            },
            "help": "This starts the bitcoin stream"
        },
        {
            "eng-com": ["stop", "pause"],
            "eng-ans": (terminal) => {
                disconnectFromBitcoin();
                terminal.log("Disconnected sucessfully!")
            },
            "help": "This stops the bitcoin stream"
        },
        {
            "eng-com": ["clear"],
            "eng-ans": (terminal) => {
                clearBitcoinContainer();
                terminal.log("Cleared bitcoin container sucessfully!")
            },
            "help": "Clears the bitcoin container"
        }
    ]
});

terminalData.push({
    "eng-com": ["ascii"],
    "help": "This command controlls the ascii art window",
    "sub-com": [
        {
            "eng-com": ["earth"],
            "eng-ans": (terminal) => terminal.log("TODO IMPLEMENT ASCII ANIMATION CHANGING!!"), // TODO
            "help": "This displays a spinning earth"
        }
    ]
});
