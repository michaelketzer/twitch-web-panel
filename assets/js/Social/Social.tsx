import React, {ReactElement} from "react";
import './social.css';

export default function Social(): ReactElement {
    return <div className={'socialWrapper'}>
        <div className={'socialContent'}>
            <div className={'wd'} />
            <div className={'other'}>
                <div className={'logo'} />
                <a className={'row twitter'} href={'https://twitter.com/shokztv'} target={'_blank'} />
                <a className={'row insta'} href={'https://www.instagram.com/shokztv/'} target={'_blank'} />
                <a className={'row disc'} href={'https://discordapp.com/invite/hagYNWg'} target={'_blank'} />
            </div>
        </div>
    </div>;
}