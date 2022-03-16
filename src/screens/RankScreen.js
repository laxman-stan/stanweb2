import TabNavigator from "../uiComps/TabNavigator"
import TableComp from "../uiComps/TableComp"
import { useEffect, useState } from "react"
import { getLeaderboardReq } from "../apis/calls"
import { useOnce } from "@react-spring/shared";
import useShowNotification from "../hooks/useShowNotification";
import { Loader } from "../uiComps";
import useUserData from "../hooks/useUserData";

export default function RankScreen() {

    const myData = useUserData().userData
    const [rewards, setRewards] = useState(null);
    const [myRank, setMyRank] = useState(null);
    const notification = useShowNotification();

    const apiCalled = (isSuccess, result) => {
        if (isSuccess) {
            let x = result.leaderboard.sort((a,b)=>b.uprun_gains-a.uprun_gains)
            setRewards(x)
            setMyRank(result.userIndex + 1)
        }
        else
            notification(result?.message ?? "Something went wrong.")
    }

    useEffect(() => {
        getLeaderboardReq(
            (res) => apiCalled(true, res),
            err => apiCalled(false, err),
        )
    }, [])

    if(rewards===null)
    return <Loader/>
    return <div style={{overflowY: 'scroll', }} className="f fc fh">

        <div style={{height: 'calc( 100% - 80px )', overflowY: 'scroll'}} className="rankCont fc hm hp f">
    <TableComp myRank={myRank} data={rewards} />
</div>

 <div style={{marginBottom: 'var(--baseVal3)', paddingLeft: 'var(--baseVal6)', backgroundColor: 'var(--mainHighlight)'}} className="f whiteCard hp hm">
        <div style={{width: !myRank? "35%" : '20%' , color: 'white'}}>{myRank || 'Not available'}</div>
        <div style={{width: !myRank? "35%" : "50%" , color: 'white'}}>{myData?.name + " (You)"}</div>
        <div style={{width: "30%" , color: 'white', textAlign: 'right', paddingRight: 'var(--baseVal10)'}}>{myData.gain}</div>
    </div> 
    </div>

}

