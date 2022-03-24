import UpperNav from "../uiComps/UpperNav"
import BottomNav from "../uiComps/BottomNav"
import TabNavigator from "../uiComps/TabNavigator"
import RoasterComp from "../uiComps/RoasterComp"
import RankScreen from "./RankScreen"
import MatchComp from "../uiComps/MatchComp"
import WalletScreen from "./WalletScreen"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import useCheckIsLoggedIn from "../hooks/useCheckIsLoggedIn"
import { BouncyComp, EmptyTeam, Lineup, ActiveMatchComp, Loader, BottomSheet, CloseBtn } from "../uiComps"
import { allPlayersRequest, myPlayersRequest, getTodaysMatchesReq } from "../apis/calls"
import useShowBottomSheet from "../hooks/useShowBottomSheet"
import useUserData from "../hooks/useUserData"
import { Sell } from "./TradeScreen"
import useShowNotification from "../hooks/useShowNotification"
import { Coin } from "../assets"
import { teamNameCorrection } from "../util"

export default function MainScreen({setHeight}) {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useCheckIsLoggedIn(setIsLoggedIn);
    const location = useLocation();
    const isNewUser = location?.state?.isNewUser;


    if (!isLoggedIn)
        return <div />

    if (isLoggedIn)
        return <MainFunction isNewUser={isNewUser} setHeight={setHeight}/>
}

const MainFunction = ({setHeight, isNewUser}) => {
    const notification = useShowNotification();
    const userData = useUserData();
    const bottomSheet = useShowBottomSheet(); 

    const apiFailed=(err)=>{
        notification(err?.message ?? 'Something went wrong.')
    }
    
    const myPlayerRequestSuccess = (myData, allPlayersData, todaysMatch) => {
        let todaysMatchData = todaysMatch.map(i=>{
            return {
                time: i.time,
                data: i.date,
                teamA: {
                    name: teamNameCorrection(i.teama),
                    players: i.teama_players
                },
                teamB: {
                    name: teamNameCorrection(i.teamb),
                    players: i.teamb_players
                }
            }
        })
        let todaysTeams = todaysMatch.reduce((arr, val)=>{
            arr.push(teamNameCorrection(val.teama))
            arr.push(teamNameCorrection(val.teamb))
            return arr
        }, [])
        
        const upruns = myData.upruns;
        let teamCreated = myData?.team_created ?? false
        let inventory = myData.inventory ?? []
        let myPlayers = inventory.map(i => {
            let player = { ...allPlayersData.find(j => j.id === i.id) }
            player.isPlayingToday = todaysTeams.includes(player.team)
            player.isLocked = i.locked
            player.buyPrice = i.buy_price
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
        x.teamCreated = teamCreated==="false" ? false : teamCreated;
        x.upruns = upruns;
        x.name = myData.name;
        x.gain = myData.uprun_gains?? 0;
        x.myPlayers = myPlayers
        x.todaysMatch=todaysMatchData
        x.teams = Object.keys(data).map(i=>({name: i, isPlayingToday: todaysTeams.includes(i)}))
        userData.setData({
            ...x
        }, false)

        const firstPopUpClosed=()=>{


            setTimeout(() => {
                bottomSheet(true, {
                    message: `Beginner's Luck 👍 Congratulations 🎉 on earning your first ${upruns ?? 400} UPruns. It’s only UPrunning from here!`,
                    onlyOneBtn: true,
                    acceptText: 'Got it',
                    acceptAction: ()=>bottomSheet(false)
                })
            }, 100);
        }

        if(!isNewUser){
            bottomSheet(
                true,
                {
                    customChild: <NewUserPopUp onClose={
                        ()=>bottomSheet(false)
                    }/>,
                    customConfig: 'gentle',
                    callOnHide: true,
                    onHide: firstPopUpClosed
                }
            )
        }
    }

    const playerDataSus = (allPlayerApiRes, todaysMatch) => {
        if(userData.userData.userFromLogin===null)
        myPlayersRequest(null, result => myPlayerRequestSuccess(result, allPlayerApiRes, todaysMatch), apiFailed)
        else
        myPlayerRequestSuccess(userData.userData.userFromLogin, allPlayerApiRes, todaysMatch)
    }

    const allPlayersRequestSuccess = (allPlayerApiRes) => {
        getTodaysMatchesReq(
            res=>playerDataSus(allPlayerApiRes.map(i=>{
                i.team = teamNameCorrection(i.team)
                return i
            }), res),
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
            tabNames={["Today's Match", "Player Portfolio"]}
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
    const  { myPlayers, teamCreated, todaysMatch, gain } = data
    
    const d = new Date();
    const matchTime = todaysMatch.map(i=>i.time)?.sort()[0]?.split(':').reduce((val, i, j)=>{
        i = parseInt(i)
        if(j===0) i *=60
        return val+i
    }, 0);
    const currentTime = d.getHours()*60 + d.getMinutes();
    const canEditTeam =  matchTime ? matchTime - currentTime > -10 : false

    const navigate = useNavigate();
    const myTeam = myPlayers?.filter(i => i.isPlayingToday)

    return <div style={{ paddingTop: 0 }} className="f fc fh cardCont">
        <div className="f fc" style={{ gap: 'var(--baseVal3)', paddingTop: 'var(--baseVal2)'}}>
        {
            teamCreated ? null : <>
                {todaysMatch?.map((i, j) => <MatchComp index={j} key={j} data={i}/>)}
            </>
        }
</div>
     {teamCreated? <ActiveMatchComp team={myTeam}/> : <EmptyTeam len={myPlayers.length || 1} createTeam/>}
     {teamCreated?  canEditTeam? <BouncyComp
     onClick={()=>navigate('/main/create-team', {state: {edit: true}})}
    // onClick={()=>navigate(len>4 && createTeam ? '/main/create-team' : '/main/trade', {state: 'toBuy'})}
    bounceLevel={.9}
    styles={{ marginBottom: '.5em', marginTop: 'auto', marginLeft: 'var(--baseVal3)', marginRight: 0, width: 'calc( 100*var(--vw) - var(--baseVal6))', flex: 'none' }}
    customClasses='cta'
    text={'Edit Team'}
    /> : <div style={{marginTop: 'auto', fontWeight: 'bold'}} className="f ac jc whiteCard">
            <p style={{color: 'var(--mainHighlight)'}}>{`Total UpRuns earned${gain? ": " : ""}`}</p>
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

const NewUserPopUp = (props) => {

    return <div 
    onClick={e=>e.stopPropagation()} 
    style={{ padding: 'var(--baseVal3) var(--baseVal3) var(--baseVal3) var(--baseVal3)', marginTop: 'auto', marginBottom:'auto', maxHeight: '85%' }} className="whiteCard rp f fc">
        <h4 style={{fontWeight: 'bold', color: 'var(--mainHighlight)', marginBottom: 'var(--baseVal)'}}>How to play?</h4>
            <ul style={{paddingLeft: 'var(--baseVal4)', overflowY: 'scroll'}}>
                <li>It’s very simple. After logging in, you will land on the homepage. There are three sections on the bottom of the page – Play, Trade, Leaderboard. The ‘Play’ section lets you pick a team of five players everyday and locks in your selection until the match ends. - In the ‘Play’ section, you will find two tabs on the top. ‘Player Portfolio’ shows you the list of all the players you’ve bought. To start, tap on ‘Create Player Portfolio’ and buy your favourite players. ‘Today’s Match’ shows you the match fixtures for today and the 5 players you’ve selected from your Player Portfolio to play Today’s Match You can tap on the ‘Trade’ section to buy new players or sell the ones that are already part of your portfolio.</li>
                <li>And the ‘Leaderboard’ section shows you where you are in the UPruns tally compared to other users on Upstox Cric Exchange. Motivation can be helpful, right!\n\nAt any instance of the game, you can click on the UPruns icon on the top to view your current UPruns and your transaction history of buying/selling players on the Upstox Cric Exchange.\n\nEasy enough, right?\nSo, go on and start playing!</li>
            </ul>

            <CloseBtn
        onClick={props.onClose}
        styles={{right: 'var(--baseVal3)'}}
        />
    </div>
}
