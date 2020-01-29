import React, {ReactElement, useEffect, useState} from 'react';
import {useBets} from "../../../Hooks/Betting";
import {get} from "../../Network";
import {Card, Table} from 'semantic-ui-react';

interface TopListEntry {
    rank: number;
    name: string;
    won: number;
    total: number;
    winPercentage: number;
}

export default function TopList(): ReactElement {
    const {status} = useBets();
    const [toplist, setToplist] = useState<TopListEntry[]>([]);
    const fetchBets = async () => setToplist(await get<TopListEntry[]>('/_api/toplist'));

    useEffect(() => {
        fetchBets();
    }, [status]);

    return <Card fluid={true}>
        <Card.Content>
            <Card.Header>Aktuelle Top 10</Card.Header>
        </Card.Content>
        <Card.Content>
            <Table striped celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Rank</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell textAlign={'right'}>Statistik</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {toplist.map(({rank, name, won, total, winPercentage}) => <Table.Row key={rank}>
                        <Table.Cell>#{rank}</Table.Cell>
                        <Table.Cell>{name}</Table.Cell>
                        <Table.Cell textAlign={'right'}>{won}/{total}&nbsp;({winPercentage}%)</Table.Cell>
                    </Table.Row>)}
                </Table.Body>
            </Table>
        </Card.Content>
    </Card>;
}