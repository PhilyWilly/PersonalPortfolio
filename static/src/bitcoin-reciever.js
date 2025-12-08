let bitcoinWebsocket = new WebSocket("ws://127.0.0.1:9600/ws/bitcoin"); // TODO change to a better URL
const bitcoinHTMLContainer = document.getElementById('bitcoin-container');

bitcoinWebsocket.onmessage = function(event) {
    bitcoinHTMLContainer.innerHTML = event.data;
}