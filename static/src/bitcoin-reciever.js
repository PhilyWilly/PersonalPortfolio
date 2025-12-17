const bitcoinHTMLContainer = document.getElementById('bitcoin-container');
let bitcoinList = [];
let hashList = [];
let connectedToWebsocket = false;
const bitcoinListLength = 16;

//const bitcoinWebsocket = new WebSocket("ws://127.0.0.1:9600/ws/bitcoin")
const bitcoinWebsocket = new WebSocket("wss://ws.blockchain.info/inv"); // Blockchain live connection :3

bitcoinWebsocket.addEventListener("open", () => {
    clearBitcoinContainer();
});

function connectToBitcoin() {
    bitcoinWebsocket.send('{"op": "unconfirmed_sub"}');
    connectedToWebsocket = true;
}
function disconnectFromBitcoin() {
    bitcoinWebsocket.send('{"op": "unconfirmed_unsub"}');
    connectedToWebsocket = false;
}
function clearBitcoinContainer() {
    bitcoinHTMLContainer.innerHTML = "<div style='margin: 38px 32px'><h2>Bitcoin!</h2><p>type '<code>bitcoin start</code>' in the console</p></div>";
    resizeFrames();
}

bitcoinWebsocket.onmessage = function(event) {
    const json = JSON.parse(event.data);
    if(json["op"] != "utx") return;
    if(json === undefined) return;
    const outTransactions = json["x"]["out"];
    let totalValue = 0;
    for (trans of outTransactions) {
        totalValue += trans["value"];
    }
    const roundedBitcoin = Math.round(totalValue/100)/1000_000;
    bitcoinList.push(roundedBitcoin);
    hashList.push(json["x"]["hash"]);

    let bitcoinString = "";
    if (bitcoinList.length > bitcoinListLength) {
        bitcoinList.shift();
        hashList.shift();
    }
    for (let i = 0; i < bitcoinList.length; i++) {
        bitcoinString += '<span class="ellipse-shortener">'+ hashList[i] +"</span>" + ": " + bitcoinList[i] + "BTC<br>"
    }
    

    bitcoinHTMLContainer.innerHTML = bitcoinString;
    bitcoinHTMLContainer.scrollTop = bitcoinHTMLContainer.scrollHeight;
    resizeFrames();
}

