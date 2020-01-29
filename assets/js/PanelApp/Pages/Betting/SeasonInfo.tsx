import React, {ReactElement, useEffect, useState} from "react";
import {Label} from "semantic-ui-react";
import {get, post} from "../../Network";
import {useBets} from "../../../Hooks/Betting";

interface SeasonInfo {
    season: number;
    round: number;
}

export default function SeasonInfo(): ReactElement {
    const {status} = useBets();
    const [season, setSeason] = useState<number>(1);
    const [round, setRound] = useState<number>(1);

    const fetchSeason = async () => {
        const {season, round} = await get<SeasonInfo>('/_api/season');
        setSeason(season);
        setRound(round);
    };

    useEffect(() => {
        fetchSeason();
    }, [status]);

    const createSeason = async () => {
      await post('/_api/season');
      await fetchSeason();
    };

    return <>Season {season} - Round {round} <Label onClick={createSeason} attached={'top right'} size={'small'} color={'green'}>Neue
        Season</Label></>;
}