function getAge() {
    const birthDate = new Date("2007-02-09");
    const currentDate = new Date();
    const difference = currentDate.getTime()-birthDate.getTime(); // In Milliseconds
    const differenceDate = new Date(difference);
    return differenceDate.getUTCFullYear() - 1970;
    return Math.floor(difference/1000/60/60/24/365); // First approach
}
async function getIp(terminal) {
    let returnText = ""
    const userAction = async () => {
        const response = await fetch('/ip');
        terminal.log("Connection build sucessfully!");
        const myJson = await response.json(); 

        returnText = myJson.ip;
    }
    try {
        await delay(200);
        terminal.log("Build connection with server...");
        await delay(400);
        await userAction();
        await delay(200);
        terminal.log("IP Adress got extracted sucessfully!");
    }
    catch (e) {
        terminal.log("An exception occurred!");
        terminal.log(e);
    }
    return returnText;
}
async function pingServer(terminal) {
    let startTime;
    let startTimeMillis;
    let endTime;
    let endTimeMillis;
    const pingServerAdress = async () => {
        const response = await fetch('/ip');
        terminal.log("Connection build sucessfully!");
        endTime = new Date();
        endTimeMillis = endTime.getTime();
    }
    try {
        await delay(100);
        terminal.log("Build connection with server...");
        await delay(200);
        startTime = new Date();
        startTimeMillis = startTime.getTime();
        await pingServerAdress();
        await delay(100);
        const ping = endTimeMillis - startTimeMillis;
        terminal.log("Ping got calculated sucessfully!");
        return ping;
    }
    catch (e) {
        terminal.log("An exception occurred!");
        terminal.log(e);
    }
    return 0;
}