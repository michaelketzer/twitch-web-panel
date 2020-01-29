import React, {ReactElement, useEffect, useState} from "react";
import './design.css';
import {useBets} from "../Hooks/Betting";
import {get} from "../PanelApp/Network";

interface TopListEntry {
    rank: number;
    name: string;
    won: number;
    total: number;
    winPercentage: number;
}

export default function TopTen(): ReactElement {
    const {status} = useBets();
    const [toplist, setToplist] = useState<TopListEntry[]>([]);

    const fetchToplist = async () => setToplist(await get<TopListEntry[]>('/_api/toplist'));
    useEffect(() => {
        fetchToplist();
    }, [status]);

    return <div className={`overlayContainer show`}>
        {toplist.map(({rank, name, won, winPercentage}) => <div className={'top-row'} key={name}>
            <div className={'name-col'}>{rank}. {name}</div>
            <div className={'stats'}>{won} ({winPercentage}%)</div>
        </div>)}
    </div>;
}
