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
    feed: number;
    noFeed: number;
    status: BettingStatus;
    remaining: number | null;
    percentage: number;
}

function sort(a: string, b: string): number {
    return a.localeCompare(b);
}

export function useVoteFeed(): BettingStats {
    const [status, setStatus] = useState<BettingStatus>(BettingStatus.none);
    const [feed, setFeed] = useState<number>(0);
    const [noFeed, setNoFeed] = useState<number>(0);
    const [percentage, setPercentage] = useState<number>(51.4);
    const [remaining, setRemaining] = useState<number | null>(null);
    const {msg, broadcast} = useMessageListener();

    useInterval(() => {
        if(status === BettingStatus.started) {
            setRemaining(remaining - 1);
        }
    });

    useEffect(() => {
        broadcast('init', 'feedvoting');
    }, []);

    useEffect(() => {
        if(msg && msg.type === 'feedvoting' && msg.data) {
            if (msg.data.subType === 'init' || msg.data.subType === 'update') {
                const status = msg.data.status as BettingStatus;
                setPercentage(51.4);
                setFeed(msg.data.feedVotes.length);
                setNoFeed(msg.data.noFeedVotes.length);
                setStatus(status);
                setRemaining(msg.data.finishDate ? msg.data.finishDate - moment().unix() : null);
                if(status === BettingStatus.started) {
                    if(msg.data.feedVotes.length === msg.data.noFeedVotes.length) {
                        setPercentage(51.4);
                    } else {
                        setPercentage((msg.data.feedVotes.length * 100) / (msg.data.feedVotes.length + msg.data.noFeedVotes.length))
                    }
                }
            }
        }
    }, [msg]);

    return {feed, noFeed, status, remaining, percentage};
}