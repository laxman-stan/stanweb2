import UpperNav from "../uiComps/UpperNav"
import BottomNav from "../uiComps/BottomNav"
import TabNavigator from "../uiComps/TabNavigator"
import RoasterComp from "../uiComps/RoasterComp"
import RankScreen from "./RankScreen"
import MatchComp from "../uiComps/MatchComp"
import WalletScreen from "./WalletScreen"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import useCheckIsLoggedIn from "../hooks/useCheckIsLoggedIn"
import { BouncyComp, EmptyTeam, Lineup, ActiveMatchComp } from "../uiComps"
import { useQuery } from 'react-query'
import { allPlayersRequest } from "../apis/calls"
import useShowBottomSheet from "../hooks/useShowBottomSheet"
import useUserData from "../hooks/useUserData"



export default function MainScreen() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useCheckIsLoggedIn(setIsLoggedIn);


    if (!isLoggedIn)
        return <div />

    if (isLoggedIn)
        return <MainFunction/>
}

const MainFunction = () => {

    let userData = useUserData();
    const playerDataSus=res=>{
        let data=res;
        let teams = ['kkr', 'rrr', 'blr']
        console.log('scuess')
        // console.log(res)
        data = data.map((i, j)=>{
            i.teamName = teams[j%3]
            return i
        })

        data = data.reduce((obj, item)=>{
            if(!obj[item.teamName])
                obj[item.teamName] = []
            item.playing_today = Math.random()>.5
            obj[item.teamName].push(item)
            return obj
        } , {})

 

        let x = userData.userData
        x.teamData = data
        userData.setData({
            ...x
        })
    }


    useEffect(()=>{
        allPlayersRequest(null, playerDataSus, err=>console.log('err', err))
    }, [])

    return <div className="app f fc fh">
        <UpperNav
        />

        <Outlet />
        <BottomNav />

    </div>
}

export const PlayScreen = () => {

    return <> <TabNavigator
        numberOfTabs={2}
        tabNames={["Today's Match", "My Roaster"]}
        renderTab={(i) => <RenderTabs index={i} />}
    />

    </>
}

const RenderTabs = ({ index }) => {
    if (index === 0)
        return <TodaysMatch />
    if (index === 1)
        return <MyRoaster />
}

const TodaysMatch = () => {
    let x = [1, 2]

    const bottomSheet = useShowBottomSheet();

    return <div className="f fc fh cardCont">
        {/* {x.map(i => <MatchComp Val={i} key={i} />)} */}
        {/* <Lineup/> */}
        <ActiveMatchComp/>
        <BouncyComp
            onClick={()=>bottomSheet(true, {customChild: <Lineup/>})}
            bounceLevel={.9}
            styles={{ marginTop: 'auto', marginBottom: '.5em', }}
            customClasses="cta"
            text="Create team for the day"
        />
    </div>
}

const MyRoaster = () => {

    let x = []
    return <div className="f fc fh cardCont">
        {x.length?
        x.map(i => <RoasterComp Val={i} key={i} />): 
        <EmptyTeam/>}
    </div>
}