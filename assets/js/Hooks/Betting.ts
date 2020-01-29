import {useMessageListener} from "./MessageHandler";
import {useEffect, useState} from "react";
import moment from 'moment';
import {useInterval} from "./Interval";

export enum BettingStatus {
    none = 'none',
    started = 'started',
    running = 'running',
    finished = 'finished',
}

interface BettingStats {
    aBets: string[];
    bBets: string[];
    status: BettingStatus;
    remaining: number | null;
    percentage: number;
}

function sort(a: string, b: string): number {
    return a.localeCompare(b);
}

export function useBets(): BettingStats {
    const [status, setStatus] = useState<BettingStatus>(BettingStatus.none);
    const [aBets, setABets] = useState<string[]>([]);
    const [bBets, setBBets] = useState<string[]>([]);
    const [percentage, setPercentage] = useState<number>(50);
    const [remaining, setRemaining] = useState<number | null>(null);
    const {msg, broadcast} = useMessageListener();

    useInterval(() => {
        if(status === BettingStatus.started) {
            setRemaining(remaining - 1);
        }
    });

    useEffect(() => {
        broadcast('init', 'betting');
    }, []);

    useEffect(() => {
        if(msg && msg.type === 'betting' && msg.data) {
            if (msg.data.subType === 'init' || msg.data.subType === 'update') {
                const status = msg.data.status as BettingStatus;
                setABets(msg.data.aBets.sort(sort));
                setBBets(msg.data.bBets.sort(sort));
                setStatus(status);
                setRemaining(msg.data.finishDate ? msg.data.finishDate - moment().unix() : null);
                if(status === BettingStatus.started) {
                    setPercentage((msg.data.aBets.length * 100) / (msg.data.aBets.length + msg.data.bBets.length))
                } else if(status === BettingStatus.finished) {
                    setPercentage(50);
                }
            }
        }
    }, [msg]);

    return {aBets, bBets, status, remaining, percentage};
}