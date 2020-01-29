import React, {createContext, Dispatch, useContext, useReducer} from 'react';
import {State} from "./State";

export const WebsocketContext = createContext({});
export const ContextProvider = ({reducer, initialState, children}) =>(
    <WebsocketContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </WebsocketContext.Provider>
);
export const useStateValue = (): [State, Dispatch<{}>] => useContext(WebsocketContext) as  [State, Dispatch<{}>];