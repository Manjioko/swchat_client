

declare module 'vue/types/chatBoxType' {

    interface ChatBoxtype {
        self: boolean;
        readonly time: number;
        readonly content: string;
        readonly avatar: string;
        readonly myid?: string;
        readonly roomid?: string;
        readonly clientid?: string;
        readonly clientname?: string;
    }
}