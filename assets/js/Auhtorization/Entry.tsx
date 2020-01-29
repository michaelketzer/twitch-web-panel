import React, {ReactElement} from "react";
import {Button, Icon, Message} from "semantic-ui-react";

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    backgroundColor: '#41464d',
};

export default function Entry({isLogged}: {isLogged: boolean}): ReactElement {
    return <div style={containerStyle}>
        {isLogged
            ? <Message negative>
                <Message.Header>Unallowed access</Message.Header>
                <p>You are not allowed on this website :-(</p>
            </Message>
            : <Button color={'purple'} as={'a'} href={'https://api.shokz.tv/connect'}>
                <Icon name={'twitch'}/> Login
            </Button>
        }
    </div>;
}