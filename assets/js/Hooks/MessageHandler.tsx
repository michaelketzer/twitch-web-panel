import React, {ReactElement, useContext, useEffect, useRef, useState} from "react";
import Websocket from 'react-websocket';
import {Message, newBroadcast, newMessage} from "../Components/WebsocktContext/State";
import {useStateValue} from "../Components/WebsocktContext/Context";
import moment from 'moment';

export default function MessageHandler(): ReactElement {
    const [{broadcast, broadcastType}, dispatch] = useStateValue();
    const ws = useRef<Websocket>(null);

    const onMessage = (msg) => {
        try {
            const {type, ...props} = JSON.parse(msg);
            dispatch(newMessage({...props, type, time: moment().unix()}))
        } catch(Error) {
            console.error('Invalid websocket message', msg);
        }
    };

    useEffect(() => {
        if(broadcast && ws && ws.current) {
            if(ws.current.readyState && ws.current.readyState === Websocket.OPEN) {
                ws.current.sendMessage(JSON.stringify({message: broadcast, type: broadcastType}));
                dispatch(newBroadcast(null, 'broadcast'));
            } else {
                setTimeout(() => {
                    ws.current.sendMessage(JSON.stringify({message: broadcast, type: broadcastType}));
                    dispatch(newBroadcast(null, 'broadcast'));
                }, 500);
            }
        }
    }, [broadcast]);

    return <Websocket ref={ws} url='wss://ws.shokz.tv:2096/' onMessage={onMessage}/>;
}


export function useMessageListener(): {msg: Message | null, broadcast: (msg: string, broadcastType?: 'broadcast' | 'betting' | 'feedvoting') => void} {
    const [{messages}, dispatch] = useStateValue();
    const [msg, setMsg] = useState<Message | null>(messages.length > 0 ? messages.slice(-1)[0] : null);

    useEffect(() => {
        const lastMessage = messages.slice(-1);
        const message = lastMessage.length > 0 ? lastMessage[0] : null;
        setMsg(message);
    }, [messages]);

    const broadcast = (msg: string, broadcastType: 'broadcast' | 'betting' | 'feedvoting' = 'broadcast') => {
        dispatch(newBroadcast(msg, broadcastType));
    };
    return {msg, broadcast};
}