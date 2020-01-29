import React, {ReactElement, useEffect, useState} from 'react';
import {BettingStatus, useBets} from "../../../Hooks/Betting";
import {get, patch} from "../../Network";
import {Button, Card, Icon, Label, Table} from 'semantic-ui-react';

interface BetRound {
    id: number;
    date: string;
    winner: 'a' | 'b';
    aBets: number;
    bBets: number;
}

export default function RecentRounds(): ReactElement {
    const {status} = useBets();
    const [recentBets, setRecentBets] = useState<BetRound[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const fetchBets = async () => setRecentBets(await get<BetRound[]>('/_api/rounds'));

    useEffect(() => {
        fetchBets();
    }, []);

    useEffect(() => {
        if(status === BettingStatus.finished) {
            fetchBets();
        }
    }, [status]);

    const onChangeWinner = async (round: number) => {
        setLoading(true);
        await patch(`/_api/roundChangeWinner/${round}`);
        await fetchBets();
        setLoading(false);
    };

    return <Card fluid={true}>
        <Card.Content>
            <Card.Header>Letzte Wettrunden</Card.Header>
        </Card.Content>
        <Card.Content>
            <Table striped celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell textAlign={'center'}>Gewinner</Table.HeaderCell>
                        <Table.HeaderCell textAlign={'right'}>A-Votes</Table.HeaderCell>
                        <Table.HeaderCell textAlign={'right'}>B-Votes</Table.HeaderCell>
                        <Table.HeaderCell />
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {recentBets.map(({id, date, winner, aBets, bBets}) => <Table.Row key={id}>
                        <Table.Cell>{date}</Table.Cell>
                        {winner.length ? <Table.Cell textAlign={'center'}><Label color={winner === 'a' ? 'blue':'green'}>Team {winner.toUpperCase()}</Label></Table.Cell>
                                       : <Table.Cell textAlign={'center'}><Label color={'orange'}>Neue Season</Label></Table.Cell>}
                        <Table.Cell textAlign={'right'}>{aBets}</Table.Cell>
                        <Table.Cell textAlign={'right'}>{bBets}</Table.Cell>
                        <Table.Cell textAlign={'center'}>
                            <Button icon labelPosition='left' onClick={() => onChangeWinner(id)} loading={loading}>
                                <Icon name='exchange' />
                                Change Winner
                            </Button>
                        </Table.Cell>
                    </Table.Row>)}
                </Table.Body>
            </Table>
        </Card.Content>
    </Card>;
}