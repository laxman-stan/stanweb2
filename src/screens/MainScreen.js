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
import { BouncyComp, EmptyTeam, Lineup, ActiveMatchComp, Loader } from "../uiComps"
import { useQuery } from 'react-query'
import { allPlayersRequest, myPlayersRequest, getTodaysMatchesReq } from "../apis/calls"
import useShowBottomSheet from "../hooks/useShowBottomSheet"
import useUserData from "../hooks/useUserData"
import { Sell } from "./TradeScreen"
import useShowNotification from "../hooks/useShowNotification"
import { Coin } from "../assets"


function convertTime12To24(time) {
    var hours   = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM    = time.match(/\s(.*)$/)[1];
    if (AMPM === "PM" && hours < 12) hours = hours + 12;
    if (AMPM === "AM" && hours === 12) hours = hours - 12;
    var sHours   = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return (sHours + ":" + sMinutes);
}


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
    const  { myPlayers, teamCreated, todaysMatch, gain  } = data
    // const canEditTeam = false;
    const matchTime = todaysMatch.map(i=>i.time)?.sort()[0]?.split(':').reduce((val, i, j)=>{
        i = parseInt(i)
        if(j===0) i *=60
        return val+i
    }, 0);
    const currentTime = convertTime12To24(new Date().toLocaleTimeString()).split(":").reduce((val, i, j)=>{
        i = parseInt(i)
        if(j===0) i *=60
        return val+i
    }, 0);

    const canEditTeam =  matchTime ? matchTime - currentTime > -10 : false

    const navigate = useNavigate();
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
     {teamCreated?  canEditTeam? <BouncyComp
     onClick={()=>navigate('/main/create-team', {state: {edit: true}})}
    // onClick={()=>navigate(len>4 && createTeam ? '/main/create-team' : '/main/trade', {state: 'toBuy'})}
    bounceLevel={.9}
    styles={{ marginBottom: '.5em', marginTop: 'auto', marginLeft: 'var(--baseVal3)', marginRight: 0, width: 'calc(100vw - var(--baseVal6))', flex: 'none' }}
    customClasses='cta'
    text={'Edit Team'}
    /> : <div style={{marginTop: 'auto', fontWeight: 'bold'}} className="f ac jc whiteCard">
            <p style={{color: 'var(--mainHighlight)'}}>{`Total upruns earned${gain? ": " : ""}`}</p>
          {gain? <> <img alt="upruns" style={{width: 14, marginTop: 4, marginLeft: 8, marginRight: 4}} src={Coin}/>
            <p style={{color: 'var(--mainHighlight)'}}>{gain}</p> </> : <p style={{color: 'var(--mainHighlight)', marginLeft: 12}}>--</p>}
    </div> : null}
    
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
