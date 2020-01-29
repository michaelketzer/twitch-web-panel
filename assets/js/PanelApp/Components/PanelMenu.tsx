import React, {ReactElement} from 'react';
import {Container, Menu} from "semantic-ui-react";
import {NavLink} from 'react-router-dom';

const MENU_ITEMS = [{
    name: 'Dashboard',
    path: '/'
}, {
    name: 'Betting',
    path: '/betting'
}, {
    name: 'Draw a winner',
    path: '/draw-a-winner'
}, {
    name: 'FeedVotes',
    path: '/feedVotes'
}];

export default function PanelMenu(): ReactElement {
    return <Menu inverted={true} fixed={"top"}>
        <Container>
            {MENU_ITEMS.map(({name, path}) => <Menu.Item
                key={path}
                name={path}
            >
                <NavLink exact to={path} activeStyle={{color: '#47ff90'}}>{name}</NavLink>
            </Menu.Item>)}
        </Container>
    </Menu>;
}