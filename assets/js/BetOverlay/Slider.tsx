import React, {ReactElement} from "react";
import './design.css';
import {BettingStatus, useBets} from "../Hooks/Betting";


export default function Slider(): ReactElement {
    const {percentage, aBets, bBets, status} = useBets();

    return <div className={`vote-overlayContainer ${status === BettingStatus.started ? 'show' : ''}`}>
        <div className="vote-info">jetzt abstimmen!</div>
        <div className="vote-progress">
            <div className="vote-a">!BET A</div>
            <div className="vote-progress-bar">
                <div className="vote-perc-a" style={{width: percentage + '%'}}/>
            </div>
            <div className="vote-b">!BET B</div>
        </div>
        <div className="vote-standings">
            <div className="vote-standings-a">{aBets.length}</div>
            |
            <div className="vote-standings-b">{bBets.length}</div>
        </div>
    </div>;
}
