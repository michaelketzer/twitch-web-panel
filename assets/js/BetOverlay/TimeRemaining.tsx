import React, {ReactElement} from "react";
import './design.css';
import {BettingStatus, useBets} from "../Hooks/Betting";


export default function TimeRemaining(): ReactElement {
    const {status, remaining} = useBets();
    let min: string | number = Math.floor(remaining / 60);
    min = min < 0 ? '00' : (min < 10 ? '0' + min : min);
    let sec: string | number = Math.floor(remaining % 60);
    sec = sec < 0 ? '00' : (sec < 10 ? '0' + sec : sec);

    return <div className={`overlayContainer ${status === BettingStatus.started ? 'show' : ''}`}>{min}:{sec}</div>;
}
