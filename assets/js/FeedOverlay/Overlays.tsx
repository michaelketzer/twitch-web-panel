import React, {ReactElement} from "react";
import './design.css';
import {BettingStatus, useVoteFeed} from "../Hooks/VoteFeed";

export default function Overlay(): ReactElement {
    const {feed, noFeed, status, remaining, percentage} = useVoteFeed();

    return <div>
        <div className={`vote-overlayContainer ${status === BettingStatus.started ? 'show' : ''}`}>
            <div className="vote-info">jetzt abstimmen!&nbsp;&nbsp;00:{remaining < 10 ? '0' : ''}{remaining}</div>
            <div className="vote-progress">
                <div className="vote-a">!FEED</div>
                <div className="vote-progress-bar">
                    <div className="vote-perc-a" style={{width: percentage + '%'}} />
                </div>
                <div className="vote-b">!KEINFEED</div>
            </div>
            <div className="vote-standings">
                <div className="vote-standings-a">{feed}</div>
                |
                <div className="vote-standings-b">{noFeed}</div>
            </div>
        </div>
        <div className={`feed ${feed > noFeed ? '' : 'noFeed'} ${status === BettingStatus.finished ? 'show' : ''}`}>{feed > noFeed ? 'FEED' : 'KEIN FEED'}</div>
    </div>;
}
