
import {BouncyComp, Bar, Lineup} from "../uiComps";
import { ClockIcon } from "../assets";
import useShowBottomSheet from "../hooks/useShowBottomSheet";
import { useEffect } from "react";


export default function MatchComp({data}) {
    const {teamA, teamB, time} = data;
    const bottomSheet = useShowBottomSheet();

    const hideSheet=()=>{
        bottomSheet(false)
    };
    const bottomSheetProps = {
        customChild: <Lineup close={hideSheet} teamA={teamA} teamB={teamB}/>, customConfig: 'gentle'
    }

const showLineUp=()=>{
    bottomSheet(true, bottomSheetProps)
}

    return <div className="f fc whiteCard">
        <h5 style={{ textAlign: 'center' }}>Indian T20 League</h5>

        <Bar
            height={1}
            otherStyles={{
                marginTop: '.8em', marginBottom: '.5em', opacity: .2
            }}
        />

        <div className="f sb ac">
            <img style={{ width: 40, height: 40 }} alt={teamA.name} src={
                require('../assets/teamLogos/'+ teamA.name + '.webp')
                } />
            <h4 style={{marginRight: 'auto', marginLeft: 'var(--baseVal3)'}}>{teamA.name}</h4>
                <VS/>
            <h4 style={{marginLeft: 'auto',  marginRight: 'var(--baseVal3)'}}>{teamB.name}</h4>
            <img style={{ width: 40, height: 40 }} alt={teamB.name} src={
                require('../assets/teamLogos/'+ teamB.name + '.webp')
                } />

        </div>


        <Bar
            height={1}
            otherStyles={{
                marginTop: '.8em', marginBottom: '.5em', opacity: .2
            }}
        />

        <div className="f ac sb">
            <img style={{height: 16}} src={ClockIcon}/>
            <p style={{marginLeft: 'var(--baseVal2)', marginRight: 'auto', fontSize: '.83em'}}>{"Starts at "+time }</p>
            <BouncyComp
            onClick={showLineUp}
            text='View lineup'
            styles={{width: '6.5em'}}
            customClasses={"highlightedSmallBtn btnPrimeColor"}
            />
        </div>


    </div>
}

export const VS=()=>  <svg
width={58}
height={24}
fill="none"
xmlns="http://www.w3.org/2000/svg"

>
<circle cx={29} cy={12} r={12} fill="#B4A2BF" />
<path stroke="#B4A2BF" d="M0 11.5h58" />
<path
  d="M27.564 9h1.36l-2.56 7h-1.17l-2.56-7h1.39l1.77 5.2 1.77-5.2Zm4.987 7.18c-.8 0-1.48-.227-2.04-.68-.56-.453-.84-1.08-.84-1.88h1.3c.02.467.177.827.47 1.08.293.247.66.37 1.1.37.36 0 .663-.087.91-.26.247-.18.37-.41.37-.69a.651.651 0 0 0-.22-.52c-.133-.127-.3-.22-.5-.28-.22-.067-.517-.143-.89-.23a9.254 9.254 0 0 1-1.16-.36c-.793-.333-1.19-.917-1.19-1.75 0-.673.247-1.2.74-1.58.493-.38 1.113-.57 1.86-.57.747 0 1.36.19 1.84.57.487.38.73.933.73 1.66h-1.31c-.04-.727-.473-1.09-1.3-1.09-.4 0-.713.08-.94.24-.227.153-.34.377-.34.67.02.313.137.537.35.67.22.133.593.26 1.12.38.46.1.87.213 1.23.34.32.113.61.31.87.59.273.293.41.687.41 1.18 0 .66-.247 1.183-.74 1.57-.487.38-1.097.57-1.83.57Z"
  fill="#fff"
/>
</svg>