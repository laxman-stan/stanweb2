import { useState } from 'react'
import Home from '../svgComps/Home'
import LeaderBoard from '../svgComps/LeaderBoard'
export default function BottomNav(){

    const [isHome, setIsHome] = useState(false);
    const clickFun=()=>setIsHome(!isHome)

    return <div className="f se ac fw absPos nav bgg1 bottomNav">

            <Home clickFun={clickFun} text={"Home"} isActive={isHome}/>
        
            <LeaderBoard clickFun={clickFun} text="Leaderboard" isActive={!isHome}/>

    </div>
}
