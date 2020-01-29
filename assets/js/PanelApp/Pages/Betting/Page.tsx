import React, {ReactElement, useEffect, useState} from "react";
import {Card, Container, Divider, Grid, Label, Header, List} from "semantic-ui-react";
import ReactApexChart from "react-apexcharts";
import {BettingStatus, useBets} from "../../../Hooks/Betting";
import RecentRounds from "./RecentRounds";
import TopList from "./TopList";
import SeasonInfo from "./SeasonInfo";

const options = {
    colors:['#2185d0', '#21ba45'],
    labels: ['Team A', 'Team B'],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
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

export default function Page(): ReactElement {
    const {aBets, bBets, status, remaining} = useBets();
    let min: string | number = Math.floor(remaining / 60);
    min = min < 10 ? '0' + min : min;
    let sec: string | number = Math.floor(remaining % 60);
    sec = sec < 10 ? '0' + sec : sec;
    const [labelColor, setLabelColor] = useState<'blue'|'orange'|'green'>('blue');

    useEffect(() => {
        if(status === BettingStatus.none || status === BettingStatus.finished) {
            setLabelColor('blue');
        } else if(status === BettingStatus.started) {
            setLabelColor('orange');
        } else {
            setLabelColor('green');
        }
    }, [status]);

    return <Container>
        <Divider hidden={true}/>

        <Grid divided>
            <Grid.Column mobile={16} tablet={8} computer={8}>
                <Card fluid={true}>
                    <Card.Content>
                        <Card.Header>
                            Wettstatus - <SeasonInfo/>
                        </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <Label color={labelColor}>
                            {(status === BettingStatus.none || status === BettingStatus.finished) && 'Nicht gestartet'}
                            {status === BettingStatus.started && 'Wettphase gestartet'}
                            {status === BettingStatus.running && 'Wettphase beendet, spiel läuft'}
                            {status === BettingStatus.started && <>&nbsp;{min}:{sec}</>}
                        </Label>
                    </Card.Content>
                </Card>
                <Card fluid={true}>
                    <Card.Content>
                        <Card.Header>Wettverteilung</Card.Header>
                    </Card.Content>

                    <Card.Content>
                        <ReactApexChart options={options} series={[aBets.length, bBets.length]} type="pie" width="380" />

                        <Divider hidden={true} />

                        {status !== BettingStatus.none && status !== BettingStatus.finished &&
                        <Grid>
                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <Label color={'blue'}><Header inverted={true} as={'h3'}>A Betters</Header></Label>
                                <List>
                                    {aBets.map(better => <List.Item key={better}>{better}</List.Item>)}
                                    {aBets.length === 0 && 'Noch keine'}
                                </List>
                            </Grid.Column>

                            <Grid.Column mobile={16} tablet={8} computer={8}>
                                <Label color={'green'}><Header inverted={true} as={'h3'}>B Betters</Header></Label>
                                <List>
                                    {bBets.map(better => <List.Item key={better}>{better}</List.Item>)}
                                    {bBets.length === 0 && 'Noch keine'}
                                </List>
                            </Grid.Column>
                        </Grid>}
                    </Card.Content>
                </Card>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
                <RecentRounds />
                <TopList />
            </Grid.Column>
        </Grid>
    </Container>;
}