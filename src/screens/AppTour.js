
import onBoarding1 from '../assets/Onboarding1.webp'
import onBoarding2 from '../assets/Onboarding2.webp'
import onBoarding3 from '../assets/Onboarding3.webp'
import {a, config, useSpring} from '@react-spring/web'
import { useEffect, useRef, useState } from 'react'
import { BouncyComp } from '../uiComps'
import { useNavigate } from 'react-router-dom'
import useCheckIsLoggedIn from '../hooks/useCheckIsLoggedIn'

export default function AppTour(){
    const [isLI, setIsLI] = useState(false);
    useCheckIsLoggedIn(setIsLI);

    if(isLI)
    return <MainFun />
    else
    return <div />
}


const MainFun=()=>{
    const navigate = useNavigate();
    const [style, setStyle] = useSpring(()=>({
        x: 0,
    }))
    const iteration = useRef(0);

const nextFun=()=>{
    iteration.current++
    if(iteration.current< 3)
    setStyle.start({
        x: -window.innerWidth*iteration.current
    })
    else
    navigate('/cricexchange/main', {replace: true})
}


return <div style={{ paddingBottom: 'var(--baseVal10)'}} className="fh fw f fc rp">

    <a.div style={{ ...style}} className="fh f ap fw">
         <div className='tourImg' style={{ backgroundImage: `url(${onBoarding1})`, }} />
         <div className='tourImg' style={{ backgroundImage: `url(${onBoarding2})`, }} />
         <div className='tourImg' style={{ backgroundImage: `url(${onBoarding3})`, }} />
    </a.div>

    <BouncyComp
            customClasses={"cta whiteBtn"}
            styles={{  marginTop: 'auto', }}
            useDefaultBtnStyles
            text="Next"
            onClick={nextFun}
        />
</div>
}