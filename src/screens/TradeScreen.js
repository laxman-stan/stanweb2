
import { useCallback, useEffect, useRef, useState } from "react"
import { BouncyComp, RoseterComp, TabNavigator, Dropdown } from "../uiComps"
import { a, useSprings, config, useTransition, easings } from '@react-spring/web'
import { colors } from "../constants/colors"
import useShowBottomSheet from "../hooks/useShowBottomSheet"
import useUserData from "../hooks/useUserData"
import RoasterComp from "../uiComps/RoasterComp"
import { useOnce } from "@react-spring/shared"
import { buyPlayerRequest, sellPlayerRequest } from "../apis/calls"
import useShowNotification from "../hooks/useShowNotification"

const { mainHighlight, mainHighlig30 } = colors


export default function () {

    const playerData = useUserData();
    const key=useRef(0);
    const [si, setSi] = useState(0);

    const set=(index=0)=>{

        let x = {...playerData.userData};
        key.current++;
        setSi(index)
        playerData.setData(x)
        
    }
    if(playerData.userData.allPlayers===null){
        
        return <div>Loading...</div>
    }
    else{
        
    return <TabNavigator
        numberOfTabs={2}
        initialIndex={si}
        key={key.current}
        tabNames={["Sell", "Buy"]}
        renderTab={(i) => <RenderTabs set={set} data={playerData.userData} index={i} />}
    />}
}

const RenderTabs = ({ index, data, set }) => {


    if (index === 0) {
        return <Sell set={set} data={data}/>
    }
    else
        return <Buy set={set} data={data} players={data.allPlayers}/>
}

export const Sell = ({data, set, styles}) => {

    const bottomSheet = useShowBottomSheet();
    const notification = useShowNotification();


    const [dataToShow, setDataToShow] = useState([...data.myPlayers])

    const endOfCall=(isPlayerSold=true, response, index, team)=>{

        bottomSheet(false);
        let message = isPlayerSold ? 'Player Sold successfully' : response??'Could not sell the player.'
        notification(message);

        if(isPlayerSold){
            
            data.myPlayers.splice(index, 1)
            let i = data.allPlayers[team].findIndex(p=>p.id===data.myPlayers[index].id)
            data.allPlayers[team][i].isBought = false
            // setDataToShow([...data.myPlayers])
            set(0);

        }

    }

    const callSellPlayerApi=(val, index, team)=>{

        sellPlayerRequest(
        { "playerId": val },
        ()=>endOfCall(true, null, index, team),
        err=>endOfCall(false, err)
        )
    }

    const sellPlayer=(item, index)=>{

            let props={
                message: `Are you sure you want to sell ${item.name}?`,
                acceptAction: ()=>callSellPlayerApi(item.id, index, item.team),
                disableActions: true
            }
            bottomSheet(true, props);
    }  

    return <div style={{...styles}} className="f fc fh cardCont">
        {dataToShow.map((i, index) => {
  
            const {price, name, id, growth_perc, isPlayingToday} = i
            return <RoseterComp
            name={name}
            price={price}
            key={id} 
            buyAction={()=>sellPlayer(i, index)}
            btnText="Sell"
            operation='sell'
            change={growth_perc}
            isLocked={isPlayingToday}
         />
        })}
    </div>
}

const Buy = ({players, data, set}) => {

    const teams = Object.keys(players);

    const [ih , setIh] = useState(null);

    const [isIncreasingSort, setIsIncreasingSort] = useState(false)
    const [activeCategory, setActive] = useState(1);
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
    const categories = [
        {
            type: 'all',
            applyOperation: false,
            // operation: ()=>{},
        },
        {
            type: 'Playing today',
            applyOperation: true,
            operation: val=>val.isPlayingToday
        },
        {
            type: 'top Gainers',
            applyOperation: true,
            operation: val=>val.growth_perc > 0
        },
        {
            type: 'top Losers',
            applyOperation: true,
            operation: val=>val.growth_perc < 0
        }
    ]


    const styles = useSprings(categories.length, categories.map((_, i) => ({
        background: activeCategory === i ? mainHighlight : '#00000000',
        borderColor: activeCategory !== i ? mainHighlig30 : '#00000000',
        color: activeCategory === i ? '#fff' : mainHighlight,
        config: config.slow
    })))


    const mutatePlayers=(playerToPush)=>{

        data.myPlayers.push({...playerToPush})
        set(1);
    }    

    return <div className="f fc fh cardCont">
        <div
            className="f fw sortCont">
            <div style={{ overflow: 'scroll', gap: '4px' }} className="f">
                {categories.map((item, index) =>
                    <BouncyComp
                        key={index}
                        onClick={() => {
                            document.querySelector(`#${item.type.replace(/ /g, "")}`).scrollIntoView({ behavior: 'smooth', block: 'end' })
                            // console.log(document.querySelector(`#${item.type}`))
                            setActive(index)
                        }}
                        customChild={<a.h5
                            id={item.type.replace(/ /g, "")}
                            style={styles[index]}
                            className="sortingCategory">{item.type}</a.h5>}
                    />
                )
                }
            </div>

            <div onClick={() => setIsIncreasingSort(!isIncreasingSort)} className="f priceCont ac">
                Price
                <Arrow angle={isIncreasingSort ? 180 : 0} />
            </div>
        </div>

        <Dropdown
            items={teams}
            activeIndex={currentTeamIndex}
            setIndex={i=>setCurrentTeamIndex(i)}
        />

        <RenderTeam 
        mutatePlayers={mutatePlayers}
        ih={ih}
        setIh={h=>setIh(h)}
        key={currentTeamIndex}
        operation={categories[activeCategory]}
        isIncreasingSort={isIncreasingSort} 
        teamName={teams[currentTeamIndex]} 
        teamData={players[teams[currentTeamIndex]]} />  

    </div>

}

const RenderTeam = ({ teamData, isIncreasingSort, operation,ih, setIh, mutatePlayers }) => {


    const ref=useRef();
    let [x, set] = useState(()=>{
        if(operation.applyOperation){   
            return  teamData.filter(operation.operation)           
        }
            return teamData
    })
    
    const originalX = useRef(
        isIncreasingSort? teamData.sort((a,b)=>a.price-b.price) : teamData.sort((a,b)=>b.price-a.price)
        
    );

    useEffect(()=>{

        let newX = [...originalX.current]
        if(operation.applyOperation){
            
              newX = newX.filter(operation.operation)           
        }
            set(newX)

    }, [operation])

    useEffect(()=>{

            if(isIncreasingSort){
                set([...x.sort((a,b)=>a.price-b.price)])
            }
            else
                set([...x.sort((a,b)=>b.price-a.price)])
     

    }, [isIncreasingSort])


    const transitions = useTransition(x.map((i, j) => ({
        y: j* ih, ...i, index: j
    })), {
        keys: (item) => item.id,
        from: {  opacity: 0, y: 0 },
        leave: ({y})=>({  opacity: 0, y: y+ih }),
        enter: ({ y }) => ({ y , opacity: 1 }),
        update: ({ y }) => ({ y }),
    })

    useEffect(() => {
        if(ih)
        ref.current.style.height = ih*teamData.length+'px'
    }, [setIh])

    const bottomSheet = useShowBottomSheet();
    const notification = useShowNotification();

    const endOfCall=(isPlayerBought=true, response, id)=>{

        bottomSheet(false);
        let message = isPlayerBought ? 'Player bought successfully' : response??'Could not buy the player.'
        notification(message);

        if(isPlayerBought){
            let u = originalX.current;
            let i = u.findIndex(i=>i.id===id)
            u[i].isBought = true;

            // let v = x;
            // let j = v.findIndex(i=>i.id===id)
            // v[j].isBought = true;
            // set([ ...v ])

            mutatePlayers(u[i]);

        }

    }

    const callBuyPlayerApi=(val)=>{

        buyPlayerRequest(
        { "playerId": val },
        ()=>endOfCall(true, null, val),
        err=>endOfCall(false, err)
        )
    }

    const buyPlayer=(item)=>{
        if(item.isBought){
            notification('Player already bought')
        }
        else{
            let props={
                message: `Are you sure you want to buy ${item.name}?`,
                acceptAction: ()=>callBuyPlayerApi(item.id),
                disableActions: true
    
            }
            bottomSheet(true, props);
        }

    }


    if (ih)
        return <div ref={ref} style={{marginTop: -8, marginBottom: -8}} className="rp f fc cardCont">

            {
                transitions((style, item, t, i) => <RoasterComp
                price={item.price}
                isBought={item.isBought}
                item={item}
                btnText={item.isBought ? 'Bought' : 'Buy'}
                buyAction={()=>buyPlayer(item)}
                change={item.growth_perc}
                styleFromProp={{ top: -(ih)*i, ...style, transitions: 'none', zIndex: x.length-i}}
                name={item.name} />)
            }
        </div>
    else
        return <RoasterComp setIh={h => setIh(h+12)} />
}

const Arrow = ({ angle }) => {
    return <svg
        width={10}
        viewBox="0 0 14 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: `rotate(${angle}deg)`, marginLeft: 'var(--baseVal2)', transition: 'all .3s' }}
    >
        <path
            d="M7.701 11.74a1 1 0 0 1-1.732 0L.2 1.75a1 1 0 0 1 .866-1.5h11.536a1 1 0 0 1 .866 1.5L7.7 11.74Z"
            fill="#fff"
        />
    </svg>

}
