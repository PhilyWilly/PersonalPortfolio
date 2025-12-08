/**
 * Data structure of the terminal:
 * 
 * List<String> eng-com: is the english trigger command
 * List<String> ger-com: is ther german trigger command
 * 
 * function(terminal) eng-ans: is the english answer to the command 
 * 
 * String help: will return a helper text for the command 
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
    "help": "This command will return the current age of David"
});

terminalData.push({
    "eng-com": ["help"],
    "ger-com": ["hilfe"],
    "eng-ans": (terminal) => terminal.log(helpText),
    "help": "This command will return the current age of David"
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
        terminal.log("Ping: " + ping);
    },
    "help": "This command will return the current public IP address"
});


const helpText = `Usefull commands:
    help        - Provides an overview of commands
    ipconfig    - Fetches the public ip adress
    ping        - Pings the server 
    name        - My name
    age         - My age
    ping        - Pings the server 
`;