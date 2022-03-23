import {a, config, useSpring} from '@react-spring/web'
import { useEffect, useRef, useState } from 'react'
import { useDrag } from "@use-gesture/react";
import { colors } from '../constants/colors';
import { useOnce } from '@react-spring/shared';
import Bar from './Bar';
import _ from 'lodash';

const {mainHighlight, mainHighlight30} = colors

export default function TabNavigator({
    numberOfTabs=2,
    tabNames=['tab1','tab2'],
    initialIndex=0,
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
        width: `calc( ${100/numberOfTabs} * var(--vw))`,
        flex: 'none',
        color: mainHighlight,
        fontSize: '.83em',
    }

    const [innerWid, setInnerWid] = useState(0);

    const [{tx, barX}, set] = useSpring(()=>({
        tx: 0, barX: 0
    }))

    useOnce(()=>{
        let x = document.querySelector('.app').offsetWidth;
        // ////console.log(document.querySelector('.app').offsetWidth)
        setInnerWid(x)
        set.start({
            tx: initialIndex*x,
            barX: initialIndex*x/numberOfTabs,
            immediate: true
        })
    })


const timer = useRef();
   const setActiveTab=(i)=>{
       ////console.log(' click registered ',innerWid, i)
       clearTimeout(timer.current);
                set.start({
            from: {
                tx: outerRef.current.scrollLeft,
            },
            to: {
                tx: i*innerWid,
            },
            
            config: {
                ...config.stiff,
                clamp: true
            },
            delay: 100,
            onStart: ()=>outerRef.current.classList.remove('outerTabSnap'),
        })
timer.current = setTimeout(() => {
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
                opacity: barX.to({
                    range: [innerWid/numberOfTabs*(i-1) ,innerWid/numberOfTabs*i, innerWid/numberOfTabs*(i+1)],
                    output: [.3, 1, 0.3],
                    extrapolate: 'clamp',
                })
            }}
            onClick={()=>setActiveTab(i)}
            key={i}
            ><h3 style={{fontWeight: 'bold'}}>{name}</h3></a.div>)
        }
    <Bar
    height={1}
    color={'var(--grey1)'}
    otherStyles={{position: 'absolute', bottom: 0}}
    />
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
         style={{...tabInnerCont}}
         className="tabInnercont fw">
            {renderTab(tab)}
        </a.div>)}

    </a.div>
    </>
}