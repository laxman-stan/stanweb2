import { useOnce } from "@react-spring/shared";
import { useEffect, useRef, useState } from "react";
import { Coin } from "../assets";
import {Bar, BouncyComp} from '../uiComps'
import {a} from '@react-spring/web'
import useShowNotification from "../hooks/useShowNotification";


export default function RoasterComp({
    batting_avg, batting_sr, bowling_eco, bowling_sr,
    isPlayingToday,
    showSelectionBtn, team, skill, isChecked,setIsChecked, name, isLocked, styleFromProp, setIh, price, btnText, change, buyAction, isBought, operation = 'buy', hideBtn}){
        //console.log('sfa', isPlayingToday);
    const data=[
        {
            key: 'Batting avg', value: batting_avg
        },
        {
            key: 'Batting sr', value: batting_sr,
        },
        {
            key: 'Bowling eco', value: bowling_eco,
        },
        {
            key: 'Bowling sr', value: bowling_sr,
        }
    ]
    const upruns = price;
    
    // const [ac, setIsChecked] = useState(false)
    const cardRef = useRef();

    useEffect(()=>{
        if(isChecked){
            cardRef.current.classList.add('checkedCard')
        }
        else{
            cardRef.current.classList.remove('checkedCard')
        }
    }, [isChecked])

    useOnce(()=>{
        if(setIh)
        setIh(cardRef.current.clientHeight)
        if(showSelectionBtn)
        cardRef.current.classList.add("rosterCard")
    })


    return <a.div
    onClick={()=>{
        showSelectionBtn &&
        setIsChecked(!isChecked)
    }}
    style={{...styleFromProp}}
    
     ref={cardRef} className="f fc rp whiteCard ">
        <div style={{gap: '.5em'}} className="f sb ac">
            <img style={{width: 40, height: 40}} 
            alt={team}
            src={team? require("../assets/teamLogos/" + team + '.webp') : null}
            />

            <div style={{marginRight: 'auto', marginLeft: 'var(--baseVal)'}}>
                <h3 style={{fontSize: '1em'}}>{name}</h3>
                <p style={{fontSize: '.8em'}}>{skill}</p>
            </div>

{   showSelectionBtn?  <BouncyComp
            onClick={()=>setIsChecked(!isChecked)}
            customChild={<Checkbox isChecked={isChecked}/> }
            /> 
:
       hideBtn ? null :  <BouncyComp
            onClick={buyAction}
            bounceLevel={.8}
            styles={{marginLeft: 'auto', width: '4.6em', backgroundColor: operation==='buy' ? 'var(--mainGreen)': 'var(--mainRed)', opacity: isBought? .6 : 1}}
            text={btnText}
            customClasses="highlightedSmallBtn"
            />}
        </div>
        {/* <div className="line" style={{marginTop: '.8em', marginBottom: '.5em', width: 'calc(100)'}}/> */}

        <Bar
        height={1}
        otherStyles={{
            marginTop: '.8em', marginBottom: '.5em', opacity: .2
        }}
        />

        <div className="f sb ac roasterInfo">
            {data.map((i, j)=><h5 key={j}>
                {i.key}<br/>
                <span>{i.value}</span>
            </h5>)}

        <div className="upruns rp">
            <h5><span style={{color: 'var(--mainHighlight)'}}>{upruns}</span><br/>
            <RenderChange change={change}/>
            </h5>
            <img className="ap" style={{top: 2, right: 2}}
            src={Coin}
            />
        </div>
        </div>

{   isLocked || (!isPlayingToday && showSelectionBtn) ?  <div className="f ap fc ac jc" style={{top: 0, left: 0, bottom: 0, right: 0, backgroundColor: 'var(--mainHighlight75)', borderRadius: 'var(--baseVal2)', color: 'white', gap: 8, fontSize: '.83em'}}>
        <Lock/>
       {showSelectionBtn?  "Player locked (Not playing today)" : "Player locked (Used in today's team)"}
        </div> : null}
    </a.div>
}

const RenderChange=({change})=>{
    return <p style={{
        color: change<0? 'var(--mainRed)': 'var(--mainGreen)',
    }}>
    {
         change + '%'
    }
    </p>
}

const Lock=()=>{
   return <svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"

  >
    <path
      d="M6 10V8c0-3.31 1-6 6-6s6 2.69 6 6v2M12 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      stroke="#FEFDFF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 22H7c-4 0-5-1-5-5v-2c0-4 1-5 5-5h10c4 0 5 1 5 5v2c0 4-1 5-5 5Z"
      stroke="#FEFDFF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
}

const Checkbox=({isChecked})=>{


    return <div style={{
        borderColor: isChecked? 'var(--superWhite)' : 'var(--mainHighlight)',
        backgroundColor: isChecked? 'var(--mainHighlight)': 'var(--superWhite)',
    }} className="checkBox f ac jc">
        {isChecked? <CheckMark/>: null}
    </div>
}
const CheckMark=()=>    <svg
width={12}

fill="none"
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 12 9"
>
<path
  d="m2 4.657 2.828 2.828 5.657-5.657"
  stroke="#fff"
  strokeWidth={2.5}
  strokeLinecap="round"
  strokeLinejoin="round"
/>
</svg>

/**<p style={{
                fontSize: '.83em', fontWeight: "bold", color: 'var(--mainHighlight)', marginBottom: 8
            }}>Not playing today</p> */