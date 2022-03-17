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
import { BouncyComp, EmptyTeam, Lineup, ActiveMatchComp, Loader } from "../uiComps"
import { useQuery } from 'react-query'
import { allPlayersRequest, myPlayersRequest, getTodaysMatchesReq } from "../apis/calls"
import useShowBottomSheet from "../hooks/useShowBottomSheet"
import useUserData from "../hooks/useUserData"
import { Sell } from "./TradeScreen"
import useShowNotification from "../hooks/useShowNotification"



export default function MainScreen({setHeight}) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useCheckIsLoggedIn(setIsLoggedIn);

    if (!isLoggedIn)
        return <div />

    if (isLoggedIn)
        return <MainFunction setHeight={setHeight}/>
}

const MainFunction = ({setHeight}) => {
    const notification = useShowNotification();
    const userData = useUserData(); 

    const apiFailed=(err)=>{
        notification(err?.message ?? 'Something went wrong.')
    }
    
    const myPlayerRequestSuccess = (myData, allPlayersData, todaysMatch) => {
        let todaysMatchData = todaysMatch.map(i=>{
            return {
                time: i.time,
                data: i.date,
                teamA: {
                    name: i.teama,
                    players: i.teama_players
                },
                teamB: {
                    name: i.teamb,
                    players: i.teamb_players
                }
            }
        })
        let todaysTeams = todaysMatch.reduce((arr, val)=>{
            arr.push(val.teama)
            arr.push(val.teamb)
            return arr
        }, [])


        const upruns = myData.upruns;
        let teamCreated = myData?.team_created ?? false
        let inventory = myData.inventory ?? []
        let myPlayers = inventory.map(i => {
            let player = { ...allPlayersData.find(j => j.id === i.id) }
            player.isPlayingToday = todaysTeams.includes(player.team)
            player.isLocked = i.locked
            return player
        })

        let data = allPlayersData.map((i, j) => {
            i.isBought = (myPlayers.find(k => k.id === i.id) ? true : false)
            i.growth_perc = parseFloat(i.growth_perc)
            i.isPlayingToday = todaysTeams.includes(i.team)
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
        x.name = myData.name;
        x.gain = myData.uprun_gains
        x.myPlayers = myPlayers
        x.todaysMatch=todaysMatchData
        x.teams = Object.keys(data).map(i=>({name: i, isPlayingToday: todaysTeams.includes(i)}))
        userData.setData({
            ...x
        })

    }

    const playerDataSus = (allPlayerApiRes, todaysMatch) => {
        if(userData.userData.userFromLogin===null)
        myPlayersRequest(null, result => myPlayerRequestSuccess(result, allPlayerApiRes, todaysMatch), apiFailed)
        else
        myPlayerRequestSuccess(userData.userData.userFromLogin, allPlayerApiRes, todaysMatch)
    }

    const allPlayersRequestSuccess = (allPlayerApiRes) => {
        getTodaysMatchesReq(
            res=>playerDataSus(allPlayerApiRes, res),
            apiFailed
        )
    }

    useEffect(() => {
        setHeight();
        allPlayersRequest(null, allPlayersRequestSuccess, apiFailed)
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
        return <Loader/>

    else
        return <> 
        <TabNavigator
            numberOfTabs={2}
            tabNames={["Today's Match", "My Roster"]}
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
    const  { myPlayers, teamCreated, todaysMatch  } = data

    const myTeam = myPlayers?.filter(i => i.isPlayingToday)

    return <div style={{ paddingTop: 0
    }} className="f fc fh cardCont">
        <div className="f fc" style={{ gap: 'var(--baseVal3)', paddingTop: 'var(--baseVal2)'}}>
        {
            teamCreated ? null : <>
                {todaysMatch?.map((i, j) => <MatchComp key={j} data={i}/>)}
            </>
        }
</div>
     {teamCreated? <ActiveMatchComp team={myTeam}/> : <EmptyTeam len={myPlayers.length || 1} createTeam/>}

    </div>
}

const MyRoaster = ({ data }) => {
    let len = data.myPlayers.length
    return <div style={{padding: 0}} className="f fc fh rp cardCont">
        {len ?<div style={{overflowY: 'scroll'}} >
            <Sell
                styles={{marginTop: 'var(--baseVal)'}}
                data={data}
                hideBuy
            /></div> : null}

        {len < 5 ? <EmptyTeam len={len} /> : null}
    </div>
}
