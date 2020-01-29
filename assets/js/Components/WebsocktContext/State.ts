enum ACTIONS {
    NEW_MESSAGE = 'NEW_MESSAGE',
    NEW_BROADCAST = 'NEW_BROADCAST',
}

export interface Message {
    time: number;
    data?: {
        username?: string;
        message?: string;
        subType?: string;
        aBets?: string[];
        bBets?: string[];
        feedVotes?: string[];
        noFeedVotes?: string[];
        betters?: string[];
        status?: string;
        finishDate?: number;
    };
    type: 'message' | 'viewers' | 'betting' | 'feedvoting';
    viewer?: {
        totalCount: number;
        chatter: {
            joined: string[];
            stayed: string[];
            parted: string[];
        }
    }
}

interface NewMessageAction {
    type: typeof ACTIONS.NEW_MESSAGE;
    message: Message;
}

interface NewBroadcastAction {
    type: typeof ACTIONS.NEW_BROADCAST;
    broadcastType: 'broadcast' | 'betting' | 'feedvoting';
    message: string | null;
}

export interface State {
    messages: Array<Message>;
    broadcast: string;
    broadcastType: 'broadcast' | 'betting' | 'feedvoting';
}


export const initialState: State = {
    messages: [],
    broadcast: null,
    broadcastType: 'broadcast',
};

export const reducer = (state: State, action: NewMessageAction | NewBroadcastAction) => {
    switch (action.type) {
        case ACTIONS.NEW_MESSAGE:
            return {
                ...state,
                messages: [
                    ...state.messages,
                    action.message,
                ],
            };
        case ACTIONS.NEW_BROADCAST:
            return {
                ...state,
                broadcast: action.message,
                broadcastType: action.broadcastType,
            };
        default:
            return state;
    }
};

export function newMessage(message: Message): NewMessageAction {
    return {
        message,
        type: ACTIONS.NEW_MESSAGE,
    };
}

export function newBroadcast(message: string | null, broadcastType: 'broadcast' | 'betting' | 'feedvoting'): NewBroadcastAction {
    return {
        message,
        broadcastType,
        type: ACTIONS.NEW_BROADCAST,
    };
}