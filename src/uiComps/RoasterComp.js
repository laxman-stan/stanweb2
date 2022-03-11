import { useState } from "react";
import { Coin } from "../assets";
import {Bar, BouncyComp} from '../uiComps'

export default function RoasterComp({Val}){

    const data=[
        {
            key: 'Eco. rate', value: 54
        },
        {
            key: 'Most wkts', value: 5,
        },
        {
            key: 'Avg. wkts', value: 3,
        },
        {
            key: 'total wkts', value: 10,
        }
    ]
    const upruns = 50;
    const change = 10;
    const operation = 'buy'
    const showSelectionBtn = false;
    const [isChecked, setIsChecked] = useState(false)

    return <div  className="f fc rp whiteCard">
        <div style={{gap: '.5em'}} className="f sb ac">
            <img style={{width: 40, height: 40}} src={"https://source.unsplash.com/random/60×60"}/>

            <div>
                <h3 style={{fontSize: '1em'}}>Player Name</h3>
                <p style={{fontSize: '.8em'}}>Bowl</p>
            </div>

            <BouncyComp
            onClick={()=>setIsChecked(!isChecked)}
            customChild={<Checkbox isChecked={isChecked}/>}
            />

            {/* <BouncyComp
            bounceLevel={.8}
            styles={{marginLeft: 'auto', width: '3.5em', backgroundColor: operation==='buy'? 'var(--mainGreen)': 'var(--mainRed)'}}
            text='Sell'
            customClasses="highlightedSmallBtn"
            /> */}
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
            <h5><span>{upruns}</span><br/>
            <RenderChange change={change}/>
            </h5>
            <img className="ap" style={{top: 2, right: 2}}
            src={Coin}
            />
        </div>
        </div>

{   Val&1 ?  <div className="f ap ac jc" style={{top: 0, left: 0, bottom: 0, right: 0, backgroundColor: 'var(--mainHighlight75)', borderRadius: 'var(--baseVal2)'}}>
        <Lock/>
        </div> : null}
    </div>
}

const RenderChange=({change})=>{

    return <p style={{
        color: change<0? 'var(--mainRed)': 'var(--mainGreen)',
    }}>
    {
        (change>0?"+":"") + change + '%'
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
        borderColor: isChecked? 'transparent' : 'var(--mainHighlight)',
        backgroundColor: isChecked? 'var(--mainHighlight)': 'transparent',
    }} className="checkBox f ac jc">
        {isChecked? <CheckMark/>: null}
    </div>
}
const CheckMark=()=>  <svg
width={12}
viewBox="0 0 10 8"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M3.578 7.168a.75.75 0 0 1-.53-.22l-2.83-2.83a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l2.3 2.3 5.14-5.14c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-5.67 5.67a.75.75 0 0 1-.53.22Z"
  fill="#fff"
/>
</svg>