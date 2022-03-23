import { useContext, useState, useEffect } from "react"
import { BackArrow } from "../assets"
import logo from '../assets/logo.png'
import BouncyComp from "./BouncyComp"
import HelpWidget from "./HelpWidget"
import WalletWidget from "./WalletWidget"
import useShowNotification from "../hooks/useShowNotification"
import { useLocation, useNavigate } from "react-router-dom"
import useUserData from "../hooks/useUserData"

export default function UpperNav(){
    let history = useNavigate();
    const [showBackButton, setShowBackButton] = useState(false);
    const userData = useUserData().userData;
    const location = useLocation();
    const pathName = location.pathname;
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
    alt="back"
    style={{height: '100%', marginRight: 8}}
    src={BackArrow}
    />   }
 />: null  
    }

{  !showBackButton   ?   <img
        className="upperNavLogo"
        src={logo}
        alt="Upstox"
        /> : <h3 style={{color: 'white'}}>{pathName.includes('history')? 'History' : 
        pathName.includes('team') ? userData.teamCreated? 'Edit team' : 'Create Team' : 
        pathName.includes('help')? "Help" : 'Wallet'}</h3>}

        <div style={{marginLeft: 'auto'}}/>
        <WalletWidget/>
        <HelpWidget/>
    </div>
}