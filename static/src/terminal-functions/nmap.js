function scanPortWithProbe(url) { // This function was written with the help of ChatGPT
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => resolve("loaded");
        img.onerror = () => resolve("error");

        img.src = url;
        setTimeout(() => resolve("timeout"), 500);
    });
}

async function scanPortWithFetch(url) {
    try {
        const response = await fetch(url, {
            mode: 'no-cors',
            signal: AbortSignal.timeout(500)
        });
        return "loaded";
    } catch (error) {
        return "error";
    }
}

async function portScan(url, port, fnc = scanPortWithProbe) {
    // console.log("Input URL: " + url);
    // console.log("Input port: " + port);
    url = url.trim();
    const splittedUrl = url.split(":");
    const hasSSL = (splittedUrl[0] == "http" || splittedUrl[0] == "https");
    if (
        (splittedUrl.length == 2 && !hasSSL) ||
        (splittedUrl.length > 2)
    ) { // If has ports
        if (port == null || port == "") {
            port = splittedUrl[splittedUrl.length - 1];
        }
        if (splittedUrl.length == 2) { // Has no SSL
            url = splittedUrl[0];
        }
        else {
            url = splittedUrl[0] + ":" + splittedUrl[1];
        }
        console.log("Configured url: " + url);
    }
    if (port != null) {
        port = port.toString().trim();
    }
    // console.log("Processed url: " + url);
    // console.log("Processed port: " + port);

    if (url.slice(0, 7) != "http://" && url.slice(0, 8 != "https://")) { // If http or https is not given
        // console.log("http not given with: " + url + " Port:" + port);
        try {
            return await portScan("http://" + url, port, fnc);
        }
        catch (e) {
            return await portScan("https://" + url, port, fnc);
        }
    }
    else { // If it has SSL
        // console.log("http given");
        if (port != null) {
            url = url + ":" + port;
        }
        try {
            // const resultNC = await fetch(url, { mode: "no-cors" });
            // console.log(resultNC);
            console.log("[ Debug ] URL: " + url);
            const result = await fnc(url);
            console.log("[ Debug ] Result: " + result);
            switch (result) {
                case "loaded": return 200; break;
                case "error": return 500; break;
                case "timeout":
                default: return 404;
            }
        }
        catch (e) {
            console.log(e);
            return e.name;
        }
    }
}

function getPorts(input, variables) {
    let port = variables['-p'];
    if (port == null) {
        port = variables['--port'];
    }
    console.log("Input ports: " + port)
    if (port == null || port == "" || port == []) return [null];
    if (port.split(",").length != 1) {
        return port.split(',').map((e) => e.trim());
    }
    if (port.split("-").length != 1) {
        rangeMin = port.split('-')[0];
        rangeMax = port.split('-')[1];
        let ports = [];
        for (let i = parseInt(rangeMin); i <= parseInt(rangeMax); i++) {
            ports.push(i.toString());
        }
        return ports;
    }
    return [port];
}

function getUrls(input, variables) {
    return input.split(",").map((e) => e.trim());
}

async function* scanWithPorts(staticUrl, ports, fnc) {
    for (let port of ports) {
        // console.log("  Port: " + port);
        yield {
            "port": port,
            "code": await portScan(staticUrl, port, fnc)
        };
    }
}

async function* scanWithUrls(urls, ports, fnc) {
    for (const url of urls) {
        // console.log("Url: " + url);
        for await (const response of scanWithPorts(url, ports, fnc)) {
            yield {
                "url": url,
                "port": response.port,
                "code": response.code
            };
        }
    }
}

async function logScan(terminal, url, ports, fnc) {
    for await (const response of scanWithUrls(url, ports, fnc)) {
        if (response.code != 500) {
            terminal.log("Url: " + response.url + " Port: " + response.port + " Code: " + response.code);
        };
    }
}

async function nmapWrapper(terminal, input, variables) {
    terminal.log("Starting (fake) NMap...");
    await nmap(terminal, input, variables);
    terminal.log("NMap executed!");
}

async function nmap(terminal, input, variables) {
    let scanFunction = scanPortWithFetch;
    const ports = getPorts(input, variables);
    const urls = getUrls(input, variables);
    if (Object.keys(variables).includes("-sP")) {
        console.log("PROBE FUNCTION!");
        scanFunction = scanPortWithProbe;
    }
    if (input == null || input == "") {
        const staticUrl = "192.168.178.";
        for (let i = 0; i < 65, 535; i++) {
            await logScan(terminal, [staticUrl + i], ports, scanFunction);
        }
        return;
    }
    if (Object.keys(variables).includes("-p-")) { // Scan all ports
        await logScan(terminal, urls, Array(65535).keys(), scanFunction);
        return;
    }
    if (Object.keys(variables).includes("--top-ports")) { // Scan The top 1000 ports
        await logScan(terminal, urls, topTCPPorts, scanFunction);
        return;
    }
    await logScan(terminal, urls, ports, scanFunction);
}
