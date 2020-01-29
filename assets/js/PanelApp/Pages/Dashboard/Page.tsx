import React, {ReactElement, useEffect, useState} from "react";
import {Card, Container, Divider, Grid} from "semantic-ui-react";
import ViewerCount from "./Components/ViewerCount";
import {useMessageListener} from "../../../Hooks/MessageHandler";

export default function Page(): ReactElement {
    const [liveViewer, setLiveViewer] = useState([]);
    const {msg} = useMessageListener();

    useEffect(() => {
        const viewerHistory = async () => {
            const response = await fetch('https://api.shokz.tv/panel/viewerHistory');
            const json = await response.json();
            setLiveViewer(json.map(([viewer, chatter, date]) => ({viewer, chatter, date: date})));
        };

        viewerHistory();
    }, []);

    useEffect(() => {
        if (msg && msg.type === 'viewers') {
            const viewer = msg.viewer.totalCount;
            const chatter = msg.viewer.chatter.joined.length + msg.viewer.chatter.stayed.length;
            setLiveViewer([...liveViewer, {viewer, chatter, date: msg.time}]);
        }
    }, [msg]);

    return <Container>
        <Divider hidden={true}/>

        <Grid divided>
            <Grid.Column mobile={16} tablet={8} computer={8}>
                <Card fluid={true}>
                    <Card.Content>
                        <ViewerCount stats={liveViewer}/>
                    </Card.Content>
                </Card>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>

            </Grid.Column>
        </Grid>
    </Container>;
}