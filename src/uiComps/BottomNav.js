import { useEffect, useState, useRef } from 'react'
import Home from '../svgComps/Home'
import LeaderBoard from '../svgComps/LeaderBoard'
import {a, useSprings, config} from '@react-spring/web'
import { colors } from '../constants/colors'
import BouncyComp from './BouncyComp'
import { useNavigate, useLocation } from 'react-router-dom'
import useShowNotification from '../hooks/useShowNotification'


import { RankIcon, TradeIcon, PlayIcon } from '../assets';
import { useOnce } from '@react-spring/shared'
export default function BottomNav() {

    const navData=[
        {
            source: PlayIcon, name: 'Play', path: '/main/'
        },
        {
            source: TradeIcon, name: 'Trade', path: '/main/trade'
        },
        {
            source: RankIcon, name: 'Rank', path: '/main/rank'
        },
    ]
    const ref=useRef();



    const [activeIndex, setActiveIndex] = useState(0);
    
    const styles = useSprings(navData.length, navData.map((_, i) => ({
        background: i===activeIndex? colors.mainHighlight : colors.mainHighlig30,
        color: i===activeIndex? colors.mainHighlight : colors.mainHighlig30,
        config: config.slow
    })))

    const navigate = useNavigate();
    // const showNotifi= useShowNotification();
    const setActiveIndexFun = index =>{

        setActiveIndex(index)
        // console.log(index);
        navigate(navData[index].path)}

    const location = useLocation();
    const pathNamesToShow = ['/main/', '/main/trade', '/main/rank' ,'/main']

    useEffect(()=>{
        ref.current.style.display=pathNamesToShow.includes(location.pathname)? 'flex' : 'none'
        let x = navData.findIndex(item=>item.path===location.pathname)
        if(activeIndex!== x && x!==-1){
            setActiveIndexFun(x)
        }
    }, [location])

    useOnce(()=>{
        if(location.pathname === '/main/trade')
        setActiveIndex(1)
if(location.pathname === '/main/rank')
        setActiveIndex(2)
    })

    return <div ref={ref} className="f se ac fw nav bgg1 bottomNav">

        {navData.map((item, index)=>(
            <BouncyComp
            key={index}
            onClick={()=>setActiveIndexFun(index)}
            customChild={<div className='f fc ac navIcon' key={index}>
            <a.div style={styles[index]} className="navIconCont f ac jc" >
            <img style={{
                height: '65%',
            }} className='navIconImg' src={item.source}/>
            </a.div>
            <a.h6 style={{...styles[index], background: 'none', fontWeight: 'bold', marginTop: '2px'}}>{item.name}</a.h6>
            </div>}
            />
        ))}
    </div>
}
