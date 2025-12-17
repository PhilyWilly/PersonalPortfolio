async function getRandomTikTokLink(terminal) {
    // Local handling
    /*fetch('data/tiktokDecember2025.json')
        .then(response => response.json()) // Parse JSON
        .then(data => console.log(data)) // Work with JSON data
        .catch(error => console.error('Error fetching JSON:', error));*/

    // Server handling
    const userAction = async () => {
        const response = await fetch('/tiktok/random');
        terminal.log("Connection build sucessfully!");
        const myJson = await response.json(); 

        returnText = myJson.url;
    }
    try {
        await delay(200);
        terminal.log("Build connection with server...");
        await delay(400);
        await userAction();
        await delay(200);
        terminal.log("Random liked tiktok got collected sucessfully!");
    }
    catch (e) {
        terminal.log("An exception occurred!");
        terminal.log(e);
    }
    return returnText;
}

