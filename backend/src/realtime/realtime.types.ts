export type RealtimeMessageType =
    | 'CHAT_MESSAGE'
    | 'ROOM_JOIN'
    | 'ROOM_LEAVE'
    | 'PING';

export type RealtimeEnvelope<TPayload = Record<string, any>> = {
    type: RealtimeMessageType;
    id: string;
    payload: TPayload;
    metadata?: {
        sentAt?: string;
        roomId?: string;
    };
};
