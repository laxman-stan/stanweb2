import { VS } from "./MatchComp"
import { ClockIcon, Coin } from "../assets"
import { Bar } from "."
import useUserData from "../hooks/useUserData"

export default function ActiveMatchComp({team}) {
    const matchData = useUserData()?.userData?.todaysMatch

    return <div style={{marginTop: 'calc( -1 * var(--baseVal2) )'}} className="whiteCard f fc">

        {   
            matchData?.map((i, j)=><CompToMap key={j} data={i}/>)
        }

        <RenderTeamList team={team.filter(i=>i.isLocked)}/>

    </div>
}

const RenderTeamList = ({team}) => {

    return <div style={{gap: 'var(--baseValH3)'}} className="f fc ">
        <div style={{
            marginTop: 'var(--baseVal2)',
            marginBottom: 'var(--baseVal2)',
            // marginLeft: 'var(--baseVal2)'
        }} className="f">
            <h4 style={{
                width: '60%'
            }}>My Team</h4>
            <h4>UPruns gain</h4>
        </div>

        {
            team.map((item, index)=><div key={index} className="f">
                <p style={{
                    width: '60%',
                    
                }}>{item.name}</p>
                <div alt="upruns" style={{marginLeft: 'var(--baseVal2)', gap: 'var(--baseVal)'}} className="f">
                    <img src={Coin}/>
                    <RenderP item={item}/>
                    </div>

                </div>)
        }
    </div>


}

const RenderP=({item})=>{

    let ci = Number(item.start_index_rating) || 0, si = Number(item.start_index_rating) || 0;
    const price = Math.max(ci-si, 0) * 50;
    return <p>{price}</p>
}


const CompToMap = ({data}) => {
const {teamA, teamB, time} = data

    return <>      <div style={{ marginBottom: 'var(--baseVal2)' }} className="f ac jc">
        <img alt={{}} style={{ height: 16 }} src={ClockIcon} />
        <p style={{ marginLeft: 'var(--baseVal2)', fontSize: '.83em' }}>{'Starts at ' + time+ " IST"}</p>
    </div>
        <MatchLine
            teams={[teamA, teamB]}
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
    let name1 = teams[0].name;
    let name2 = teams[1].name
    return <div className="f sb ac">
        <img alt={name1} style={{ width: 40, height: 40 }} src={require("../assets/teamLogos/" +name1 + ".webp" )} />
        <h4 style={{ width: '4.5em', marginRight: 'auto', marginLeft: 'var(--baseVal)' }}>{name1}</h4>
        <VS />
        <h4 style={{ width: '4.5em', marginLeft: 'auto', marginRight: 'var(--baseVal)', textAlign: 'end' }}>{name2}</h4>
        <img alt={name2} style={{ width: 40, height: 40 }} src={require("../assets/teamLogos/" +name2 + ".webp" )} />

    </div>
}