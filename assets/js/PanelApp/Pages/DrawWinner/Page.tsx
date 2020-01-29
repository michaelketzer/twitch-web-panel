import React, {ReactElement, useEffect, useState} from "react";
import {Button, Container, Divider, Header, Label, List, Grid} from "semantic-ui-react";
import {get, post} from "../../Network";
import {useMessageListener} from "../../../Hooks/MessageHandler";

const serverSeed = '0dd0925b43b9e36dbbc78a4ec9e4ae5d';
export default function DrawAWinner(): ReactElement {
    const {broadcast} = useMessageListener();
    const [loading, setLoading] = useState<boolean>(false);
    const [clientSeed, setClientSeed] = useState<string>('Not generated yet.');
    const [result, setResult] = useState<number | null>(null);
    const [entries, setEntries] = useState<number>(0);
    const [winner, setWinner] = useState<string>(' ');
    const [participants, setParticipants] = useState<string[]>([]);
    const [buttonLabel, setButtonLabel] = useState<string>('Draw a winner!');

    const drawWinner = async() => {
        if(!loading) {
            setLoading(true);

            const response = await post('/_api/drawWinner');
            const data = await response.json();

            setClientSeed(data.clientSeed);
            setResult(data.result);
            setWinner(data.winner);
            setLoading(false);

            broadcast(`Gewinner ist ${data.winner} mit der Zahl ${data.result}. Prüfe es hier https://panel.shokz.tv/public/verify | Teilnehmer: ${entries} | Client Seed: ${data.clientSeed}`);
            window.scrollTo({ behavior: 'smooth', top: document.getElementById(data.result).offsetTop - 100})
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await get<{entries: string[]}>('/_api/participantList');
            setParticipants(data.entries);
            setEntries(data.entries.length);
        };

        fetchData();
        setTimeout(() => setButtonLabel('% ?'), 10000);
    }, []);

    return <Container>
        <Divider hidden={true}/>

        <Grid>
            <Grid.Column mobile={16} tablet={8} computer={8} style={{position: 'fixed'}}>
                <Button loading={loading} color={'green'} size={'huge'} onClick={drawWinner}>{buttonLabel}</Button>

                <Divider hidden={true} />
                <Header as={'h3'}>Provably fair!</Header>
                <List>
                    <List.Item>Server Seed: {serverSeed}</List.Item>
                    <List.Item>Client Seed: {clientSeed}</List.Item>
                    <List.Item>Einträge: <Label color={result === null ? 'blue' : 'orange'}>{entries}</Label></List.Item>
                    <List.Item>Ergebnis: <Label color={result === null ? 'blue' : 'green'}>{result}</Label></List.Item>
                    <List.Item>Gewinner: <Label color={result === null ? 'blue' : 'green'}>{winner}</Label></List.Item>
                </List>

                <Divider hidden={true} />
                <Divider hidden={true} />
                <Divider hidden={true} />

                <a target={'_blank'} href={'https://panel.shokz.tv/public/verify'}>Verify link</a>

            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8} floated='right'>
                <Header as={'h3'}>Teilnehmerliste</Header>

                <List>
                    {participants.map((name, index) => <List.Item key={index + '-' + name}>
                        <div id={`${index}`}>
                            {index+1 === result && <Label color={'green'}>{index+1}. {name}</Label>}
                            {index+1 !== result && <>{index+1}. {name}</>}
                        </div>
                    </List.Item>)}
                </List>
            </Grid.Column>
        </Grid>
    </Container>;
}