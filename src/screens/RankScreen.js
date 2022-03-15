import TabNavigator from "../uiComps/TabNavigator"
import TableComp from "../uiComps/TableComp"
import { useEffect, useState } from "react"
import { getLeaderboardReq } from "../apis/calls"
import { useOnce } from "@react-spring/shared";
import useShowNotification from "../hooks/useShowNotification";
import { Loader } from "../uiComps";

export default function RankScreen() {


    const [rewards, setRewards] = useState(null);
    const [myRank, setMyRank] = useState('Undetermined');
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

<div style={{marginBottom: 'var(--baseVal3)', paddingLeft: 'var(--baseVal6)'}} className="f whiteCard hp hm">
        <div style={{width: "20%"}}>{myRank}</div>
        <div style={{width: "50%"}}>Name</div>
        <div style={{width: "30%"}}>500</div>
    </div>
    </div>

}

