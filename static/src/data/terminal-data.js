/**
 * Data structure of the terminal:
 * 
 * List<String> eng-com: is the english trigger command
 * List<String> ger-com: is ther german trigger command
 * 
 * function(terminal) eng-ans: is the english answer to the command 
 * 
 * String help: will return a helper text for the command 
 * 
 * List<terminalData> sub-com: This is a list of subcommands that can run with the current command
 */

let terminalData = [];

terminalData.push({
    "eng-com": ["age"],
    "ger-com": ["alter"],
    "eng-ans": (terminal) => terminal.log(getAge()),
    "help": "This command will return the current age of David"
});

terminalData.push({
    "eng-com": ["name", "firstname", "lastname"],
    "ger-com": ["vorname", "nachname"],
    "eng-ans": (terminal) => terminal.log("David Wesch"),
    "help": "This command will return the full name of David"
});

terminalData.push({
    "eng-com": ["help"],
    "ger-com": ["hilfe"],
    "eng-ans": (terminal) => terminal.log(helpText),
    "help": "This command will return the help menu to use the terminal"
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
        "eng-ans": (terminal) => terminal.log("Ping: 0ms"),
        "help": "This is a test for the ping method. For testing only!"
    }]
});


const helpText = `Usefull commands:
    help        - Provides an overview of commands
    ipconfig    - Fetches the public ip adress
    ping        - Pings the server 
    name        - My name
    age         - My age
    ping        - Pings the server 
`;