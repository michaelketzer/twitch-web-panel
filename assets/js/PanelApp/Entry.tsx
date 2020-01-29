import React, {createContext, useContext, useReducer} from "react";
import { BrowserRouter,Route, Switch } from "react-router-dom";
import PanelMenu from "./Components/PanelMenu";
import DashboardPage from "./Pages/Dashboard/Page";
import BettingPage from "./Pages/Betting/Page";
import DrawAWinner from "./Pages/DrawWinner/Page";
import FeedVotes from "./Pages/FeedVotes/Page";
import {initialState, reducer} from "../Components/WebsocktContext/State";
import MessageHandler from "../Hooks/MessageHandler";
import {ContextProvider} from "../Components/WebsocktContext/Context";

export default (initialProps, context) => {
    return <BrowserRouter basename={context.base}>
        <ContextProvider initialState={initialState} reducer={reducer}>
            <MessageHandler />
            <PanelMenu/>
            <div style={{paddingTop: '50px'}}>
                <Switch>
                    <Route path="/feedVotes" component={FeedVotes}/>
                    <Route path="/betting" component={BettingPage}/>
                    <Route path="/draw-a-winner" component={DrawAWinner}/>
                    <Route path="/" component={DashboardPage}/>
                </Switch>
            </div>
        </ContextProvider>
    </BrowserRouter>;
}