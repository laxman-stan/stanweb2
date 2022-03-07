import {a, useSpring, useSprings} from '@react-spring/web'
import { useEffect, useRef, useState } from 'react'
import { useDrag } from "@use-gesture/react";
import { colors } from '../constants/colors';
import Bar from './Bar';
import _ from 'lodash';

export default function TabNavigator({
    numberOfTabs=2,
    tabNames=['tab1','tab2'],
    renderTab=(i)=><p>{i}</p>
}){

    const tabs = useRef([...Array(numberOfTabs).keys()]);
    const outerRef = useRef();
    const tabOuterStyle = {
        height: '100%',
        overflowX: 'scroll',
        // flexFlow: 'column nowrap;',
        // scrollSnapType: 'x mandatory'
    }
    const tabInnerCont = {
        height: '100%',
        flex: 'none',
        // scrollSnapAligh: 'start'
    }
    const tabTitle={
        width: `${100/numberOfTabs}vw`,
        flex: 'none',
    }



    const [{tx, barX}, set] = useSpring(()=>({
        tx: 0, barX: 0
    }))


   const setActiveTab=(i)=>{
                set({
            from: {
                tx: outerRef.current.scrollLeft,
            },
            to: {
                tx: i*window.innerWidth,
            },
            
            config: {
                clamp: true
            },
            delay: 100,
            onStart: ()=>outerRef.current.classList.remove('outerTabSnap'),
        })
setTimeout(() => {
    outerRef.current.classList.add('outerTabSnap');
}, 1000);
    }

    const scroll=()=>{

        set.start({
            barX: outerRef.current.scrollLeft/numberOfTabs,
        })
    }

    return <> 
    <div className='tabBarCont f fw sb rp'>
        {
            tabNames.map((name, i) => <a.div className="f jc tabTitle"
            style={{ ...tabTitle, 
                color: barX.to([-1, window.innerWidth/numberOfTabs*i, window.innerWidth/numberOfTabs*(i+1), window.innerWidth+1], ['blue','red', 'blue', 'red']),
            }}
            onClick={()=>setActiveTab(i)}
            key={i}
            ><h3>{name}</h3></a.div>)
        }
    <Bar
    width={tabTitle.width}
    x={barX}
    otherStyles={{position: 'absolute', bottom: 0}}
    />
        </div>
    <a.div onScroll={scroll} ref={outerRef} scrollLeft={tx} style={tabOuterStyle} className="f tabOuterCont outerTabSnap fw">

        {tabs.current.map(tab=><a.div
         key={tab}
        //  {...scrollingFun()}
         style={{...tabInnerCont, opacity: .5, backgroundColor: tab===0?'red':tab===1? 'blue' : 'green'}}
         className="tabInnercont fw">
            {renderTab(tab)}
        </a.div>)}

    </a.div>
    </>
}