import React, {ReactElement, useEffect, useMemo} from "react";
import ReactApexChart from "react-apexcharts";
import ApexChart from "apexcharts";
import moment from 'moment';

const chartOptions = {
    chart: {
        id: 'liveviewer',
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 1000
            }
        },
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: 'Live Zuschauer',
        align: 'left'
    },
    xaxis: {
        type: "categories",
        tickAmount: 'dataPoints',
        categories: [],
        title: {
            text: 'Uhrzeit'
        },
    },
};

function maptoDataSet(stats: { date: number, viewer: number, chatter: number }[]): { name: string, data: number[] }[] {
    return stats.reduce<[{ name: string; data: number[] }, { name: string; data: number[] }]>((acc, {date, viewer, chatter}) => {
        acc[0].data.push(viewer);
        acc[1].data.push(chatter);
        return acc;
    }, [{name: 'Viewer', data: []}, {name: 'Chatter', data: []}]);
}

export default function ViewerCount({stats}: { stats: { date: number, viewer: number, chatter: number }[] }): ReactElement {
    const dataSet = [];

    useEffect(() => {
        dataSet.push(...maptoDataSet(stats.slice(-10)));
    }, []);
    useEffect(() => {
        ApexChart.exec('liveviewer', 'updateSeries', maptoDataSet(stats.slice(-10)))
    }, [stats]);

    useEffect(() => {
        ApexChart.exec('liveviewer', 'updateOptions', {
            xaxis: {
                categories: stats.slice(-10).map(({date}) => moment(date, 'X').format('HH:mm'))
            }
        })
    }, [stats]);

    return <>
        <ReactApexChart options={chartOptions} series={dataSet} type="line" height="350"/>
    </>;
}