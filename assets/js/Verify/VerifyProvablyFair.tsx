import React, {ReactElement, useState} from "react";
import {Button, Container, Divider, Grid, Input} from "semantic-ui-react";
import {post} from "../PanelApp/Network";

export default function VerifyProvablyFair(): ReactElement {
    const [loading, setLoading] = useState(false);
    const [serverSeed, setServerSeed] = useState('0dd0925b43b9e36dbbc78a4ec9e4ae5d');
    const [clientSeed, setClientSeed] = useState('');
    const [entryCount, setEntryCount] = useState<number|string>(0);
    const [result, setResult] = useState(0);

    const verify = async () => {
        setLoading(true);
        const response = await post('/public/provablyVerify', {clientSeed, count: entryCount});
        const {result} = await response.json();

        setResult(result);
        setLoading(false);
    };

    return <Container>
        <Grid>
            <Grid.Column mobile={16} tablet={8} computer={8}>
                <Divider hidden={true} />

                <div>
                    <Input fluid={true} value={serverSeed} label={'Server Seed'} onChange={(_e, {value}) => setServerSeed(value)} disabled={true} />
                </div>
                <Divider hidden={true} />
                <div>
                    <Input fluid={true}  value={clientSeed} label={'Client Seed'} onChange={(_e, {value}) => setClientSeed(value)} />
                </div>
                <Divider hidden={true} />
                <div>
                    <Input type={'number'} fluid={true}  value={entryCount} label={'Entry Count'} onChange={(_e, {value}) => setEntryCount(value)} />
                </div>

                <Divider hidden={true} />

                <Button onClick={verify} loading={loading} size={'large'} color={'green'}>Verify</Button>

                <Divider hidden={true} />

                Ergebnis: {result}

            </Grid.Column>
        </Grid>
    </Container>;
}