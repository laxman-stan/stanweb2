import TabNavigator from "../uiComps/TabNavigator"
import TableComp from "../uiComps/TableComp"
import { useEffect, useState } from "react"
import { getLeaderboardReq } from "../apis/calls"
import { useOnce } from "@react-spring/shared";
import useShowNotification from "../hooks/useShowNotification";

export default function RankScreen() {
    const getRewardEnum = ['DAILY', 'WEEKLY', 'OVERALL']
    const uprunContants = ['daily_upruns', 'weekly_upruns', 'overall_upruns'];

    const [currentRequest, setCurrentRequest] = useState(0)
    const [rewards, setRewards] = useState({
        DAILY: [], WEEKLY: [], OVERALL: []
    });
    const notification = useShowNotification();

    const apiCalled = (isSuccess, result) => {
        if (isSuccess) {
            let x = result, y = rewards;
            x.sort((a, b) => a[uprunContants[currentRequest]] - b[uprunContants[currentRequest]])
            y[getRewardEnum[currentRequest]] = result.map((i, j)=>{
                return  [j , i.name, i[uprunContants[currentRequest]]] // {name: i.name, rank: j, upruns: i[uprunContants[currentRequest]]} //
            });
            setRewards(y);
            if (currentRequest < 2)
                setCurrentRequest(currentRequest + 1);
        }
        else
            notification(result?.message ?? "Something went wrong.")
    }

    useEffect(() => {
        getLeaderboardReq(
            {
                "type": getRewardEnum[currentRequest],
            },
            (res) => apiCalled(true, res),
            err => apiCalled(false, err),
        )
    }, [currentRequest])

    return <TabNavigator
        numberOfTabs={3}
        tabNames={["Daily", "Weekly", "Overall"]}
        renderTab={i => <RenderTabs data={rewards[getRewardEnum[i]]} index={i} />}
    />

}

const RenderTabs = ({ index, data }) => {
    if (index === 0)
        return <Daily data={data} />
    if (index === 1)
        return <div /> //<Weekly/>
    if (index === 2)
        return <div /> // <Overall/>
}

const Daily = ({ data }) => {


    return <div className="rankCont fc hm hp f">
        <TableComp data={data} />
    </div>
}