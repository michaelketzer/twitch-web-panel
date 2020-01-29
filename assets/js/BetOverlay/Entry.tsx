import React, {ReactElement} from "react";
import {ContextProvider} from "../Components/WebsocktContext/Context";
import {initialState, reducer} from "../Components/WebsocktContext/State";
import MessageHandler from "../Hooks/MessageHandler";
import Slider from "./Slider";
import TimeRemaining from "./TimeRemaining";
import TopTen from "./Toplist";

export default function Entry(): ReactElement {
    const urlParams = new URLSearchParams(location.search);
    const overlay = urlParams.get('overlay');

    return <ContextProvider initialState={initialState} reducer={reducer}>
        <MessageHandler />

        {overlay === 'slider' && <Slider/>}
        {overlay === 'timer' && <TimeRemaining/>}
        {overlay === 'toplist' && <TopTen/>}
    </ContextProvider>;
}