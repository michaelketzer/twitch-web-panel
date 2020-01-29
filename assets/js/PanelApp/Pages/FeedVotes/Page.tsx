import React, {ReactElement, useEffect, useState} from "react";
import {Button, Card, Container, Divider, Header, Label, Table} from "semantic-ui-react";
import {useVoteFeed} from "../../../Hooks/VoteFeed";
import {BettingStatus} from "../../../Hooks/Betting";
import moment from 'moment';
import ReactApexChart from "react-apexcharts";


const options = {
    colors:['#2185d0', '#21ba45'],
    labels: ['Feed', 'Kein Feed'],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                height: 150
            },
            legend: {
                position: 'bottom'
            }
        }
    }],
    dataLabels: {
        formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex]
        },
    },
};

interface FeedVoteHistory {
    key: number;
    feedVotes: number;
    noFeedVotes: number;
    result: string;
}

export default function Page(): ReactElement {
    const {status, feed, noFeed, remaining} = useVoteFeed();
    let min: string | number = Math.floor(remaining / 60);
    min = min < 10 ? '0' + min : min;
    let sec: string | number = Math.floor(remaining % 60);
    sec = sec < 10 ? '0' + sec : sec;
    const [labelColor, setLabelColor] = useState<'blue'|'orange'|'green'>('blue');

    const [history, setHistory] = useState<FeedVoteHistory[]>([]);

    useEffect(() => {
        if(status === BettingStatus.none) {
            setLabelColor('blue');
        } else if(status === BettingStatus.started) {
            setLabelColor('orange');
        } else {
            setLabelColor('green');
        }

        if(status === BettingStatus.finished) {
            const newHistory = [
                {
                    key: moment().unix(),
                    feedVotes: feed,
                    noFeedVotes: noFeed,
                    result: feed > noFeed ? 'Feed' : 'Kein Feed',
                },
                ...history
            ];
            setHistory(newHistory);
        }
    }, [status]);

    return <Container>
        <Divider hidden={true}/>
        <Button floated={'right'} color={'red'} onClick={() => setHistory([])}>Reset</Button>
        <Divider hidden={true}/>
        <Label color={labelColor}>
            {(status === BettingStatus.none) && 'Nicht gestartet'}
            {status === BettingStatus.started && <>Abstimmung gestartet:&nbsp;{min}:{sec}</>}
            {status === BettingStatus.finished && 'Abstimmung beendet.'}
        </Label>
        {status !== BettingStatus.none && <>
            <Divider hidden={true}/>
            <Header as={'h4'}>Verteilung</Header>
            <ReactApexChart options={options} series={[feed, noFeed]} type="pie" height="150" width={'200'}/>
        </>}
        <Divider hidden={true}/>
        <Header as={'h4'}>History</Header>

        <Table striped celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Datum</Table.HeaderCell>
                    <Table.HeaderCell textAlign={'center'}>Ergebniss</Table.HeaderCell>
                    <Table.HeaderCell textAlign={'right'}>Feed-Votes</Table.HeaderCell>
                    <Table.HeaderCell textAlign={'right'}>Keine-Feed-Votes</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {history.map(({key, feedVotes, noFeedVotes, result} ) => <Table.Row key={key}>
                    <Table.Cell>{moment(key, 'X').format('Y-M-D H:m:s')}</Table.Cell>
                    <Table.Cell textAlign={'center'}><Label color={result === 'Feed' ? 'red':'green'}>{result}</Label></Table.Cell>
                    <Table.Cell textAlign={'right'}>{feedVotes}</Table.Cell>
                    <Table.Cell textAlign={'right'}>{noFeedVotes}</Table.Cell>
                </Table.Row>)}
            </Table.Body>
        </Table>
    </Container>;
}