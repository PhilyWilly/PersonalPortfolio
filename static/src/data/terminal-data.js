/**
 * Data structure of the terminal:
 * 
 * List<String> eng-com: is the english trigger command
 * List<String> ger-com: is ther german trigger command
 * 
 * bool secret: this wont show in any help menu :3
 * bool uses-input: this uses the rest of the command as a input of the answer function (cant be used with sub-com)
 * 
 * function(terminal, variables) eng-ans: is the english answer to the command 
 * 
 * String short-help: will return a short helper text
 * String help: will return a helper text for the command 
 * 
 * List<terminalData> sub-com: This is a list of subcommands that can run with the current command
 */

let terminalData = [];

// Help command has to be at index one
terminalData[0] = {
    "eng-com": ["help"],
    "ger-com": ["hilfe"],
    "eng-ans": (terminal, variables) => terminal.logHelpText(null),
    "help": "This command will return the help menu to use the terminal"
};

terminalData.push({
    "eng-com": ["age"],
    "ger-com": ["alter"],
    "eng-ans": (terminal, variables) => terminal.log(getAge()),
    "help": "This command will return the current age of David"
});

terminalData.push({
    "eng-com": ["clear", "clr"],
    "ger-com": ["löschen"],
    "eng-ans": (terminal, variables) => terminal.clear(),
    "help": "This command will clear the console"
});

terminalData.push({
    "eng-com": ["echo", "print", "say"],
    "uses-input": true,
    "eng-ans": (terminal, input, variables) => {
        if (input != null && input != "") {
            terminal.log(input);
        }
        else {
            terminal.logHelpText(terminal.giveCommandObject("echo", terminalData));
        }
    },
    "help": "This command will echo what is written after the echo in the terminal. For logging purposes"
});

terminalData.push({
    "eng-com": ["name", "firstname", "lastname"],
    "ger-com": ["vorname", "nachname"],
    "eng-ans": (terminal, variables) => terminal.log("David Wesch"),
    "help": "This command will return the full name of David"
});

terminalData.push({
    "eng-com": ["ip", "ipconfig", "ip-config"],
    "eng-ans": async (terminal, variables) => {
        const ip = await getIp(terminal, variables);
        terminal.log("IP-Adress: " + ip);
    },
    "help": "This command will return the current public IP address"
});

terminalData.push({
    "eng-com": ["ping", "speed", "connection"],
    "uses-input": true,
    "eng-ans": ping,
    "short-help": "This command will determine the current ping.",
    "help": "This command will determine the current ping between server and client. <br>  When no address is entered it will ping the server. <br>  When an url entered it will use https://corsproxy.io/?_url_ to surpass the CORS policy",
    "sub-com": [{
        "eng-com": ["fake"],
        "secret": true,
        "eng-ans": (terminal, variables) => terminal.log("Ping: 0ms"),
        "help": "This is a test for the ping method. For testing only!"
    }]
});

terminalData.push({
    "eng-com": [":3"],
    "secret": true,
    "eng-ans": async (terminal, variables) => terminal.log("LY :3"),
    "help": "IYKYK",
});

terminalData.push({
    "eng-com": ["bitcoin"],
    "help": "This command is for handling the connection to the blockchain bitcoin server",
    "sub-com": [
        {
            "eng-com": ["start"],
            "eng-ans": (terminal, variables) => {
                connectToBitcoin();
                terminal.log("Connected sucessfully!")
            },
            "help": "This starts the bitcoin stream"
        },
        {
            "eng-com": ["stop", "pause"],
            "eng-ans": (terminal, variables) => {
                disconnectFromBitcoin();
                terminal.log("Disconnected sucessfully!")
            },
            "help": "This stops the bitcoin stream"
        },
        {
            "eng-com": ["clear"],
            "eng-ans": (terminal, variables) => {
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
            "eng-com": ["earth", "reset", "default"],
            "eng-ans": (terminal, variables) => {
                asciiController.setAnimation("earth");
                terminal.log("Set ascii art to earth sucessfully");
            },
            "help": "This displays a spinning earth"
        },
        {
            "eng-com": ["cat"],
            "eng-ans": (terminal, variables) => {
                asciiController.setAnimation("cat");
                terminal.log("Set ascii art to cat sucessfully");
            },
            "help": "This displays a silly cat"
        },
        {
            "eng-com": ["anime", "cartoon"],
            "eng-ans": (terminal, variables) => {
                asciiController.setAnimation("anime");
                terminal.log("Set ascii art to anime sucessfully");
            },
            "help": "This displays anime"
        },
        {
            "eng-com": ["anonymus", "hacker", "cybersecurity"],
            "eng-ans": (terminal, variables) => {
                asciiController.setAnimation("anonymus");
                terminal.log("Set ascii art to anonymus sucessfully");
            },
            "help": "This displays anonymus"
        },
        {
            "eng-com": ["arch", "linux", "bios", "fastfetch", "neofetch"],
            "eng-ans": (terminal, variables) => {
                asciiController.setAnimation("arch");
                terminal.log("Set ascii art to arch sucessfully");
            },
            "help": "This displays a the arch logo"
        },
    ]
});

terminalData.push({
    "eng-com": ["fetch"],
    "uses-input": true,
    "secret": true, // A secret because it is a so useless feature ugh
    "eng-ans": async (terminal, input, variables) => {
        const response = await terminalFetch(terminal, input);
        terminal.log(JSON.stringify(response));
    },
    "help": "You can fetch something from the internet with this <br>  Try fetch https://rickandmortyapi.com/api",
});

terminalData.push({
    "eng-com": ["calculate"],
    "uses-input": true,
    "secret": true, // A secret because it is a so useless feature ugh
    "eng-ans": async (terminal, input, variables) => {
        const response = await calculate(terminal, input);
        terminal.log(response);
    },
    "help": "You can calculate with basic operations <br>  Try 1+1 :3",
});

terminalData.push({
    "eng-com": ["face", "appearance"],
    "ger-com": ["gesicht", "aussehen"],
    "secret": true, // I dont want to show my face normally heh
    "eng-ans": async (terminal, variables) => {
        terminal.log("Ready to play a game? (Type n for no or y for yes)");
        if (await terminal.ynQuestion()) {
            terminal.log("Not implemented yet heh :p")
        }
        else {
            terminal.log("Alright then not ;)")
        }
    },
    "help": "Here the game begins to discover my face <br>  Have fun :3",
});

terminalData.push({
    "eng-com": ["tiktok"],
    "eng-ans": async (terminal, variables) => {
        terminal.log("Open tiktok account from david in new tab...");
        window.open("https://www.tiktok.com/@david_dgvzmsnl", "_blank");
    },
    "sub-com": [
        {
            "eng-com": ["random"],
            "eng-ans": async (terminal, variables) => {
                const url = await getRandomTikTokLink(terminal);
                terminal.log("Random liked tiktok url: '" + url + "'")
                terminal.log("Open tiktok in a new tab!");
                window.open(url, "_blank");
            },
            "help": "This opens a random liked tiktok from David."
        }
    ],
    "help": "This command controls everything asociated with tiktok."
});

terminalData.push({
    "eng-com": ["nmap"],
    "eng-ans": nmapWrapper,
    "uses-input": true,
    "short-help": "[ Unstable ] NMap is a tool to scan local ip adresses.",
    "help": "[ Unstable ] NMap is a tool to scan local ip adresses. <br>  This is not the original. Just a scrappy copy of it for the browser. <br>  Usage: nmap [ip-adress] [options]<br>  Options:<br>    -p Ports<br>    -p- All ports<br>    --top-ports Scan the top 1000 portsExamples: <br>    nmap 192.168.1.1<br>    nmap 192.168.1.1, 192.168.1.2<br>    nmap 192.168.1.1 -p 8800<br>    nmap 192.168.1.1 -p 80, 443<br>    nmap 192.168.1.1 -p 1000-10000<br>    nmap 192.168.1.1 -p-"
});
