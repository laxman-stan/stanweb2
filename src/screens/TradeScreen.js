
import { useCallback, useEffect, useRef, useState } from "react"
import { BouncyComp, RoseterComp, TabNavigator, Dropdown, EmptyTeam, Loader } from "../uiComps"
import { a, useSprings, config, useTransition, easings } from '@react-spring/web'
import { colors } from "../constants/colors"
import useShowBottomSheet from "../hooks/useShowBottomSheet"
import useUserData from "../hooks/useUserData"
import RoasterComp from "../uiComps/RoasterComp"
import { useOnce } from "@react-spring/shared"
import { buyPlayerRequest, sellPlayerRequest } from "../apis/calls"
import useShowNotification from "../hooks/useShowNotification"
import { useLocation } from "react-router-dom"

const { mainHighlight, mainHighlig30 } = colors


export default function TradeScreen() {
    let location = useLocation();
    let initialIndex = useRef(location.state === 'toBuy' ? 1 : 0);
    const playerData = useUserData();
    const [key, setK] = useState(0);
    const [preData, setPd] = useState(null);

    const set=(index=0, preData=null)=>{
        let x = {...playerData.userData};
        // preData.current = preData;
        initialIndex.current = index;
        setTimeout(() => {
            setPd(preData);
            playerData.setData(x)  
            setK(key+1)
        }, 300);
    }

    if(playerData.userData.allPlayers===null){ 
        return <Loader/>
    }
    else{
        
    return <TabNavigator
        numberOfTabs={2}
        initialIndex={initialIndex.current}
        key={key}
        callBackOnMount={i=>set(i)}
        tabNames={["Sell", "Buy"]}
        renderTab={(i) => <RenderTabs preData={preData} data={playerData.userData} set={set} index={i} />}
    />}
}

const RenderTabs = ({ index, set, data, preData }) => {


    if (index === 0) {
        return <Sell data={data} set={set}/>
    }
    else
        return <Buy data={data} preData={preData} set={set}/>
}

export const Sell = ({set, styles, hideBuy, data}) => {
    const bottomSheet = useShowBottomSheet();
    const notification = useShowNotification();
    const [dataToShow, setDataToShow] = useState([...data.myPlayers])

    const endOfCall=(isPlayerSold=true, response, index, team)=>{

        bottomSheet(false);
        let message = isPlayerSold ? 'Player Sold successfully' : response.message??'Could not sell the player.'
        notification(message);

        if(isPlayerSold){ 
            let i = data.allPlayers[team].findIndex(p=>p.id===data.myPlayers[index].id)
            data.allPlayers[team][i].isBought = false
            data.myPlayers.splice(index, 1)
            data.upruns +=data.allPlayers[team][i].price
            setDataToShow([...data.myPlayers])
            setTimeout(()=>{
                set(0);
            }, 300)
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
        { dataToShow.length? dataToShow.map((i, index) => {
            {/* console.log(i) */}
            const {price, name, id, growth_perc, skill, isLocked, team, batting_avg, batting_sr, bowling_eco, bowling_sr} = i
            return <RoseterComp
            name={name}
            price={price}
            key={id} 
            buyAction={()=>sellPlayer(i, index)}
            btnText="Sell"
            hideBtn={hideBuy??false}
            operation='sell'
            skill={skill}

            batting_avg={batting_avg} 
            batting_sr={ batting_sr} 
            bowling_eco={bowling_eco} 
            bowling_sr={ bowling_sr}

            team={team}
            change={growth_perc}
            isLocked={isLocked}
         />
        }) : <EmptyTeam hideBtn/>}
    </div>
}

const Buy = ({data, set, preData}) => {

    const players = data.allPlayers;
    const teams = data.teams;

    const [ih , setIh] = useState(null);

    const [isIncreasingSort, setIsIncreasingSort] = useState(false)
    const [activeCategory, setActive] = useState(preData?.activeCategory ?? 0);
    const [currentTeamIndex, setCurrentTeamIndex] = useState(preData?.currentTeamIndex ?? 0);
    const categories = [
        {
            type: 'All',
            applyOperation: false,
            // operation: ()=>{},
        },
        {
            type: 'Top Gainers',
            applyOperation: true,
            operation: val=>val.growth_perc > 0
        },
        {
            type: 'Top Losers',
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
        let preData={
            activeCategory: activeCategory,
            currentTeamIndex: currentTeamIndex,
        }
        data.myPlayers.push({...playerToPush})
        data.upruns -= playerToPush.price
        set(1, preData);
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
        teamName={teams[currentTeamIndex].name} 
        teamData={players[teams[currentTeamIndex].name]} />  

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
        from: ({y})=>({  opacity: 0, y }),
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
        let message = isPlayerBought ? 'Player bought successfully' : response?.message ??'Could not buy the player.'
        notification(message);

        if(isPlayerBought){
            let u = originalX.current;
            let i = u.findIndex(i=>i.id===id)
            u[i].isBought = true;
            u[i].buyPrice = u[i].price;
            set([...x])
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
                team={item.team}
                skill={item.skill}
                
                batting_avg={item.batting_avg}
                batting_sr={item.batting_sr}
                bowling_eco={item.bowling_eco}
                bowling_sr={item.batting_avg}


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
