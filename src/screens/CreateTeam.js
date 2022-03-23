
import useUserData from "../hooks/useUserData";
import { useEffect, useState, useRef } from "react";
import useShowNotification from "../hooks/useShowNotification";
import { a, useSpring, config } from '@react-spring/web'
import { BouncyComp, Loader } from "../uiComps";
import RoasterComp from "../uiComps/RoasterComp";
import { createTeamReq } from "../apis/calls";
import { useLocation, useNavigate } from "react-router-dom";

export default function CreateTeam() {
    const userInfo = useUserData()
    const userData = userInfo.userData.myPlayers;
    const location = useLocation();

    const [shouldUpdate, setSU] = useState(location?.state?.edit);
    const [selected, setSelected] = useState(shouldUpdate? userData.reduce((arr, i, j)=>{
            if(i.isLocked)
            arr.push(j)
            return arr
    }, []) : []);
    const [isLoading, setIsLoading] = useState(false);
    const notification = useShowNotification();
    const navigate = useNavigate();

    const [sheet, setSheet] = useSpring(() => ({
        y: 120,
        config: config.wobbly
    }))

    const selectionFun = index => {
        if(userData[index].isPlayingToday){
        if (selected.length < 5)
            setSelected(selected.includes(index) ? selected.filter(i => i !== index) : [...selected, index])
        else if(selected.includes(index))
            setSelected(selected.filter(i => i !== index))
        else
            notification("You can select only 5 players.")}
        else
        notification("You can't select players who are not playing today.")
    }

    useEffect(() => {
        if (selected.length)
            setSheet.start({ y: 0, config: config.stiff })
        else
            setSheet.start({ y: 120 })

    }, [selected])

    const apiCalled = (teamCreated, res) => {

        setIsLoading(false);
        setSelected([]);
        if (teamCreated) {
            notification(shouldUpdate? "Team updated successfully." :  'You team has been created successfully.')
            userInfo.userData.myPlayers = userData.map((i, j) => {
                i.isLocked = selected.includes(j)
                return i
            })
            userInfo.userData.teamCreated = true;
            userInfo.setData({ ...userInfo.userData })
            navigate(-1)
        }
        else{
            // ////console.log(")
            notification(res?.toString() ?? 'Something went wrong.')
        }

    }

    const clickFun = () => {
        if (selected.length < 5)
            notification("Please select 5 players.")
        else {
            setIsLoading(true)
            createTeamReq({
                "playerIds": selected.map(i => userData[i].id)
            },
                res => apiCalled(true, res),
                res => apiCalled(false, res)
            )
        }

    }

    if (userData === null)
        return <Loader />

    return <div

        className="f fc rp fw fh">
        <div className="f fc" style={{ gap: 'var(--baseVal3)', overflowY: 'scroll', paddingTop: 'var(--baseVal2)', paddingBottom: selected.length ? 192 : 80 }}>
            {
                userData.map((item, index) => <RoasterComp
                    key={index}
                    showSelectionBtn
                    name={item.name}
                    price={item.price}

                    batting_avg={item.batting_avg}
                    batting_sr={item.batting_sr}
                    bowling_eco={item.bowling_eco}
                    bowling_sr={item.batting_avg}

                    team={item.team}
                    skill={item.skill}

                    isPlayingToday={item.isPlayingToday}
                    change={item.growth_perc}
                    setIsChecked={() => selectionFun(index)}
                    isChecked={selected.includes(index)}
                />)
            }
        </div>
        <a.div style={{ ...sheet, ...cardCont }} className="ap f fc whiteCard">

            <h4 style={{ textAlign: 'center', fontWeight: 'bold' }}>
                <span style={{ color: 'var(--mainHighlight30)', }}>Players Selected: </span>
                {selected.length} <span style={{ color: 'var(--mainHighlight30)' }}>/5</span> </h4>
            <BouncyComp
                onClick={clickFun}
                showLoading={isLoading}
                bounceLevel={!isLoading ? .9 : 1}
                styles={{
                    ...btnStyle,
                    background: !isLoading ? 'var(--mainHighlight)' : 'var(--mainHighlight75)'
                }}
                outlined
                text={"Create Team"}
            />

        </a.div>

    </div>
}


const cardCont = {
    bottom: 30,
    width: '100%',
    margin: 0,
    gap: 'var(--baseVal3)',
    height: 150,
    transition: "none",
    padding: 'var(--baseVal6)',
    paddingTop: 'var(--baseVal4)',
    borrderRadius: 'var(--baseVal4)',
}

const btnStyle = {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    paddingTop: 'var(--baseVal3)',
    paddingBottom: 'var(--baseVal3)',
    borderRadius: 'var(--baseVal)',
    color: 'white',
    border: 'none',
    transition: 'opacity .3s',
    overflow: 'hidden',
}
