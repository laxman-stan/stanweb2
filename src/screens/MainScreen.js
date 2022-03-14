import UpperNav from "../uiComps/UpperNav"
import BottomNav from "../uiComps/BottomNav"
import TabNavigator from "../uiComps/TabNavigator"
import RoasterComp from "../uiComps/RoasterComp"
import RankScreen from "./RankScreen"
import MatchComp from "../uiComps/MatchComp"
import WalletScreen from "./WalletScreen"
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import useCheckIsLoggedIn from "../hooks/useCheckIsLoggedIn"
import { BouncyComp, EmptyTeam, Lineup, ActiveMatchComp, Dropdown } from "../uiComps"
import { useQuery } from 'react-query'
import { allPlayersRequest, myPlayersRequest } from "../apis/calls"
import useShowBottomSheet from "../hooks/useShowBottomSheet"
import useUserData from "../hooks/useUserData"
import { Sell } from "./TradeScreen"



export default function MainScreen() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useCheckIsLoggedIn(setIsLoggedIn);


    if (!isLoggedIn)
        return <div />

    if (isLoggedIn)
        return <MainFunction />
}

const MainFunction = () => {

    let userData = useUserData();

    const myPlayerRequestSuccess = (myData, allPlayersData, upruns) => {
        let teamCreated = myData?.team_created ?? false
        let inventory = myData.inventory ?? []
        let myPlayers = inventory.map(i => {
            let player = { ...allPlayersData.find(j => j.id === i.id) }
            player.isPlayingToday = i.locked
            return player
        })


        let data = allPlayersData.map((i, j) => {
            i.isBought = (myPlayers.find(k => k.id === i.id) ? true : false)
            i.growth_perc = parseFloat(i.growth_perc)
            i.isPlayingToday = Math.random() > .5
            return i
        })

        data = data.reduce((obj, item) => {
            if (!obj[item.team])
                obj[item.team] = []
            obj[item.team].push(item)
            return obj
        }, {})


        let x = userData.userData;
        x.allPlayers = data;
        x.teamCreated = teamCreated;
        x.upruns = upruns;
        x.myPlayers = myPlayers
        userData.setData({
            ...x
        })

    }
    const playerDataSus = res => {

        myPlayersRequest(null, result => myPlayerRequestSuccess(result, res, result.upruns), err => console.log('err', err))
    }


    useEffect(() => {

        allPlayersRequest(null, playerDataSus, err => console.log('err', err))
    }, [])

    return <div className="app f fc fh">
        <UpperNav
        />

        <Outlet />
        <BottomNav />

    </div>
}

export const PlayScreen = () => {

    const playerData = useUserData();
    if (playerData.userData.myPlayers === null)
        return <div>loading...</div>

    else
        return <> <TabNavigator
            numberOfTabs={2}
            tabNames={["Today's Match", "My Roaster"]}
            renderTab={(i) => <RenderTabs data={playerData.userData} index={i} />}
        />
        </>
}

const RenderTabs = ({ index, data }) => {
    if (index === 0)
        return <TodaysMatch data={data} />
    if (index === 1)
        return <MyRoaster data={data} />
}

const TodaysMatch = ({ data }) => {
    const { myPlayers, teamCreated } = data

    const myTeam = myPlayers?.filter(i => i.isPlayingToday)

    return <div style={{ paddingTop: 0
    }} className="f fc fh cardCont">
        <div className="f fc" style={{ gap: 'var(--baseVal3)'}}>
        {
            teamCreated ? null : <>
                <MatchComp />
                <MatchComp />
            </>
        }
</div>
     {teamCreated? <ActiveMatchComp team={myTeam}/> : <EmptyTeam len={myPlayers.length} createTeam/>}

    </div>
}

const MyRoaster = ({ data }) => {
    let len = data.myPlayers.length
    return <div style={{padding: 0}} className="f fc fh rp cardCont">
        {len ?<div style={{overflowY: 'scroll'}} >
            <Sell
                styles={{marginTop: 'var(--baseVal)'}}
                data={data}
            /></div> : null}

        {len < 5 ? <EmptyTeam len={len} /> : null}
    </div>
}
