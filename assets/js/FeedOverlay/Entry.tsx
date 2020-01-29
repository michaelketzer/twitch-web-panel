import React, {ReactElement} from "react";
import Overlay from "./Overlays";
import {ContextProvider} from "../Components/WebsocktContext/Context";
import {initialState, reducer} from "../Components/WebsocktContext/State";
import MessageHandler from "../Hooks/MessageHandler";

export default function Entry(): ReactElement {
    return <ContextProvider initialState={initialState} reducer={reducer}>
        <MessageHandler />
        <Overlay/>
    </ContextProvider>;
}