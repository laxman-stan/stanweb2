import { useContext, useState, useEffect } from "react"
// import { NotificationContext } from "../App"
// import Logo from '../assets/logo.svg'
import { BackArrow, Logo } from "../assets"
import BouncyComp from "./BouncyComp"
import HelpWidget from "./HelpWidget"
import WalletWidget from "./WalletWidget"
import useShowNotification from "../hooks/useShowNotification"
import { useLocation, useNavigate } from "react-router-dom"

export default function UpperNav({showBackBtn}){
    let notification = useShowNotification();
    let history = useNavigate();
    const [showBackButton, setShowBackButton] = useState(false);

    const location = useLocation();
    const pathNamesToShow = ['/main/', '/main/trade', '/main/rank' ,'/main']

    useEffect(()=>{
        setShowBackButton(!pathNamesToShow.includes(location.pathname))
    }, [location])

    return <div
        style={showBackButton ? {paddingLeft: 'var(--baseVal4)'} : {}}
     className="f ac fw nav bgg1 upperNav">

        {showBackButton? 
 <BouncyComp
 onClick={()=>history(-1)}
 styles={{height: '40%'}}
 customChild={   <img
    style={{height: '100%', marginRight: 8}}
    src={BackArrow}
    />   }
 />: null  
    }

{  !showBackButton   ?   <img
        style={{height: '30%'}}
        src={Logo}
        /> : <h3 style={{color: 'white'}}>{location.pathname.includes('history')? 'History' : 'Wallet'}</h3>}

        <div style={{marginLeft: 'auto'}}/>
        <WalletWidget/>
        <HelpWidget/>
    </div>
}