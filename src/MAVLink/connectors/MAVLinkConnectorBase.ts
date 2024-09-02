import { EventEmitter } from "events";

export enum MAVLinkConnectionState {
    DISCONNECTED,
    CONNECTING,
    CONNECTED
}

export interface MAVLinkMessage {
    mavpackettype: string;

    [paramName: string]: string | number;
}

export interface MAVLinkParameter {
    name: string;
    value: string | number;
    type: number;
}

export abstract class MAVLinkConnectorBase extends EventEmitter {

    private _connectionState: MAVLinkConnectionState = MAVLinkConnectionState.DISCONNECTED;
    private _paramCacheByID: { [paramID: string]: MAVLinkMessage } = {};
    private _paramCacheByIndex: { [paramIndex: number]: MAVLinkMessage } = {};
    private _missionCache: MAVLinkMessage[] = [];
    private _availableParamCount: number = 0;

    connect() {
        // Cache any PARAM_VALUE messages that come across the wire
        this.on("message-received", this._cacheParamValueMessage);

        this._updateConnectionState(MAVLinkConnectionState.CONNECTING);
        this._connect();
    }

    disconnect() {
        this.off("message-received", this._cacheParamValueMessage);
        this._disconnect();
    }

    sendMAVLinkMessage(message: MAVLinkMessage) {
        this._sendMAVLinkMessage(message);
    }

    get connectionState(): MAVLinkConnectionState {
        return this._connectionState;
    }

    get availableParamCount(): number {
        return this._availableParamCount;
    }

    getCachedParameters(): MAVLinkParameter[] {
        return Object.entries(this._paramCacheByID).map(([key, msg]) => ({
            name: msg.param_id as string,
            value: msg.param_value,
            type: msg.param_type as number
        })).sort((a, b) => a.name.localeCompare(b.name));
    }

    protected async _getParameter(parameter: string | number, forceRefresh: boolean = false): Promise<MAVLinkMessage | undefined> {

        const isParamIndex = typeof parameter === "number";
        const paramID = isParamIndex ? "" : parameter;
        const paramIndex = isParamIndex ? parameter : -1;

        if (!forceRefresh) {
            if (isParamIndex && paramIndex in this._paramCacheByIndex) {
                return this._paramCacheByIndex[paramIndex];
            } else if (paramID in this._paramCacheByID) {
                return this._paramCacheByID[paramID];
            }
        }

        try {
            return await this.sendAndAwaitFilter({
                mavpackettype: "PARAM_REQUEST_READ",
                target_system: 1,
                target_component: 1,
                param_id: paramID,
                param_index: paramIndex
            }, msg => msg.mavpackettype === "PARAM_VALUE" && (msg.param_id === paramID || msg.param_index === paramIndex));
        } catch (e) {
            console.error("Unable to retrieve parameter", e);
        }
    }

    resetParameterCache() {
        this._paramCacheByID = {};
        this._paramCacheByIndex = {};
        this._availableParamCount = 0;
        this.emit("parameter-cache-updated");
    }

    downloadAllParameters(resetCache: boolean = true) {
        if (resetCache) {
            this.resetParameterCache();
        }

        this.sendMAVLinkMessage({
            mavpackettype: "PARAM_REQUEST_LIST",
            target_system: 1,
            target_component: 1
        });
    }

    async setParameter(parameterID: string, value: number) {
        // Get the parameter type first. TODO: this might not be needed
        const existingParameter = await this._getParameter(parameterID);

        if (!existingParameter) {
            throw new Error("Parameter is not found");
        }

        const result = await this.sendAndAwaitFilter({
            mavpackettype: "PARAM_SET",
            target_system: 1,
            target_component: 1,
            param_id: parameterID,
            param_type: existingParameter.param_type,
            param_value: value
        }, msg => msg.mavpackettype === "PARAM_VALUE" && msg.param_id === parameterID);

        // if (result.param_value !== value) {
        //     throw new Error("Parameter value was not set");
        // }
    }

    async getParameter(parameterID: string, forceRefresh: boolean = false): Promise<string | number | undefined> {
        const response = await this._getParameter(parameterID, forceRefresh);
        return response?.param_value;
    }

    private _cacheParamValueMessage(parameterMessage: MAVLinkMessage) {
        if (parameterMessage.mavpackettype === "PARAM_VALUE") {
            this._paramCacheByIndex[parameterMessage.param_index as number] = parameterMessage;
            this._paramCacheByID[parameterMessage.param_id] = parameterMessage;
            this._availableParamCount = parameterMessage.param_count as number ?? 0;
            this.emit("parameter-cache-updated");
        }
    }

    sendAndAwaitFilter(sendMessage: MAVLinkMessage, filterMethod: (message: MAVLinkMessage) => boolean, timeout: number = 5000): Promise<MAVLinkMessage> {
        return new Promise((resolve, reject) => {
            const cleanup = () => {
                this.removeListener("message-received", handleMessageResponse);
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }
            };

            const handleMessageResponse = (message: MAVLinkMessage) => {
                if (filterMethod(message)) {
                    cleanup();
                    resolve(message);
                }
            };

            this.on("message-received", handleMessageResponse);
            this.sendMAVLinkMessage(sendMessage);
            const timeoutTimer = setTimeout(() => {
                cleanup();
                reject(new Error("MAVLink message response timeout"));
            }, timeout);
        });
    }

    protected _updateConnectionState(newState: MAVLinkConnectionState) {
        this._connectionState = newState;
        this.emit("connection-state", newState);
    }

    protected _receivedMAVLinkMessage(message: MAVLinkMessage) {
        this.emit("message-received", message);
    }

    protected abstract _connect(): void;

    protected abstract _sendMAVLinkMessage(message: MAVLinkMessage): void;

    protected abstract _disconnect(): void;
}