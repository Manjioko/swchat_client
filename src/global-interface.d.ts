


declare interface ChatBoxtype {
    readonly time: number;
    readonly content: string;
    readonly self: boolean;
    readonly avatar: string;
    readonly myid?: string;
    readonly roomid?: string;
    readonly clientid?: string;
}
