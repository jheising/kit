export interface MAVLinkSequenceElement {
    action: string;
}

export interface MAVLinkSequence<DS = any> {
    datasource?: DS[];
}