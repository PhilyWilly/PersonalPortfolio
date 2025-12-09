from websockets.sync.client import connect

def main():
    with connect("wss://ws.blockchain.info/inv") as websocket:
        websocket.send('{"op": "ping"}')
        message = websocket.recv()
        print(f"Received: {message}")
        websocket.send("""{
        "op": "unconfirmed_sub"
        }""")
        while True:
            message = websocket.recv()
            print(f"Received: {message}")

if __name__ == "__main__":
    main()