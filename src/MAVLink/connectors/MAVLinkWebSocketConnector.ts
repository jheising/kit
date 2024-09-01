import { MAVLinkConnectionState, MAVLinkConnectorBase, MAVLinkMessage } from "@/src/MAVLink/connectors/MAVLinkConnectorBase";

export interface MAVLinkWebSocketConnectorOptions {
    websocketURL: string;
}

export class MAVLinkWebSocketConnector extends MAVLinkConnectorBase {

    private readonly _websocketURL?: string;
    private _webSocket?: WebSocket;

    constructor(options: MAVLinkWebSocketConnectorOptions) {
        super();
        this._websocketURL = options.websocketURL;
    }

    protected _connect(): void {
        this._webSocket = new WebSocket(this._websocketURL!);

        this._webSocket.addEventListener("open", (event) => {
            this._updateConnectionState(MAVLinkConnectionState.CONNECTED);
        });

        this._webSocket.addEventListener("message", (event) => {
            try {
                const message: MAVLinkMessage = JSON.parse(event.data);
                this._receivedMAVLinkMessage(message);
            } catch (e) {
                console.error("Unable to parse message", event.data, e);
            }
        });

        this._webSocket.addEventListener("error", (event) => {
        });

        this._webSocket.addEventListener("close", (event) => {
            this._updateConnectionState(MAVLinkConnectionState.DISCONNECTED);
        });

        (window as any).mavlink = this;
    }

    protected _disconnect(): void {
        if (this._webSocket) {
            this._webSocket.close();
            this._webSocket = undefined;
        }

        (window as any).mavlink = undefined;
    }

    protected _sendMAVLinkMessage(message: MAVLinkMessage) {
        this._webSocket?.send(JSON.stringify(message));
    }
}