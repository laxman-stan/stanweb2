
import { useState } from "react"
import { BouncyComp, RoseterComp, TabNavigator } from "../uiComps"
import {a, useSprings, config} from '@react-spring/web'
import { colors } from "../constants/colors"
import useShowBottomSheet from "../hooks/useShowBottomSheet"
const {mainHighlight, mainHighlig30} = colors

export default function () {

    return <TabNavigator
        numberOfTabs={2}
        tabNames={["Sell", "Buy"]}
        renderTab={(i) => <RenderTabs index={i} />}
    />
}

const RenderTabs = ({ index }) => {

    if (index === 0) {
        return <Sell />
    }
    else
        return <Buy />
}

const Sell = () => {
    const myPlayers = [0, 1, 2, 3, 4]

    return <div className="f fc fh cardCont">
        {myPlayers.map(i => <RoseterComp key={i}/>)}
    </div>

}

const Buy = () => {

    let show = useShowBottomSheet();
    setTimeout(() => {
        show(true);
    }, 3000);

    setTimeout(() => {
        show(false);
    }, 6000);

    const myPlayers = [0, 1, 2, 3, 4]
    const [activeCategory, setActive] = useState(1);
    const categories = [
        {
            type: 'all',
            applyOperation: false,
        },
        {
            type: 'Playing today',
            applyOperation: true,
            operation: arr => arr
        },
        {
            type: 'top Gainers',
            applyOperation: true,
            operation: arr => arr
        },
        {
            type: 'top Losers',
            applyOperation: true,
            operation: arr => arr
        }
    ]

    const styles = useSprings(categories.length, categories.map((_, i)=>({
        background: activeCategory === i ? mainHighlight : '#00000000',
        borderColor: activeCategory !== i ? mainHighlig30 : '#00000000',
        color: activeCategory === i ? '#fff' : mainHighlight,
        config: config.slow
    })))
    return <div className="f fc fh cardCont">
        <div    
             className="f fw sortCont">
            {categories.map((item, index) =>
                <BouncyComp
                key={index}
                onClick={()=>setActive(index)}
                customChild={<a.h5
                    
                     style={styles[index]}
                     className="sortingCategory"  >{item.type}</a.h5>}
                />
            )
            }
            <div className="f priceCont ac">
                Price
                <Arrow angle={0}/>
                </div>
            </div>

        {myPlayers.map(i => <RoseterComp key={i}/>)}
    </div>

}

const Arrow=({angle})=>{
    return   <svg
    width={10}
    viewBox="0 0 14 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{transform: `rotate(${angle}deg)`, marginLeft: 'var(--baseVal2)'}}
  >
    <path
      d="M7.701 11.74a1 1 0 0 1-1.732 0L.2 1.75a1 1 0 0 1 .866-1.5h11.536a1 1 0 0 1 .866 1.5L7.7 11.74Z"
      fill="#fff"
    />
  </svg>
    
}