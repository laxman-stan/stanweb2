import { VS } from "./MatchComp"
import { ClockIcon, Coin } from "../assets"
import { Bar } from "."

export default function ActiveMatchComp({team}) {

    return <div className="whiteCard f fc">

        <CompToMap />
        <CompToMap />

        <RenderTeamList team={team}/>

    </div>
}

const RenderTeamList = ({team}) => {

    return <div style={{gap: 'var(--baseValH3)'}} className="f fc ">
        <div style={{
            marginTop: 'var(--baseVal2)',
            marginBottom: 'var(--baseVal2)'
        }} className="f">
            <h4 style={{
                width: '50%'
            }}>My Team</h4>
            <h4>UPruns earned</h4>
        </div>

        {
            team.map((item, index)=><div key={index} className="f">
                <p style={{
                    width: '50%'
                }}>{item.name}</p>
                <div style={{marginLeft: 'var(--baseVal3)', gap: 'var(--baseVal)'}} className="f">
                    <img src={Coin}/>
                    <p>{"not determined"}</p>
                    </div>

                </div>)
        }
    </div>


}


const CompToMap = () => {


    return <>      <div style={{ marginBottom: 'var(--baseVal2)' }} className="f ac jc">
        <img style={{ height: 16 }} src={ClockIcon} />
        <p style={{ marginLeft: 'var(--baseVal2)', fontSize: '.83em' }}>Starts in 05:12 hrs</p>
    </div>
        <MatchLine
            teams={['laxmikant', 'swami']}
        />

        <Bar
            height={1}
            otherStyles={{
                marginTop: '.8em', marginBottom: '.5em', opacity: .2
            }}
        /></>
}

const MatchLine = ({
    teams
}) => {

    return <div className="f sb ac">
        <img style={{ width: 40, height: 40 }} src={"https://source.unsplash.com/random/60×60"} />
        <h4 style={{ width: '4.5em', marginRight: 'auto', marginLeft: 'var(--baseVal3)' }}>{teams[0]}</h4>
        <VS />
        <h4 style={{ width: '4.5em', marginLeft: 'auto', marginRight: 'var(--baseVal3)', textAlign: 'end' }}>{teams[1]}</h4>
        <img style={{ width: 40, height: 40 }} src={"https://source.unsplash.com/random/60×60"} />

    </div>
}