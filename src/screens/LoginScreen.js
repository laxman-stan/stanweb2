import BouncyComp from "../uiComps/BouncyComp"
import InputField from "../uiComps/InputField"
import { useEffect, useState, useContext } from "react";
import { auth } from "../apis/calls";
import useShowNotification from "../hooks/useShowNotification";
import { useLocation, useNavigate } from "react-router-dom";
import loginBg from '../assets/login.webp'
import useUserData from "../hooks/useUserData";


export default function LoginScreen() {

    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);

    useEffect(() => {
        if (sessionStorage.authToken)
            navigate('/main')
        else
            setIsLoggedIn(false)
    }, [])

    if (isLoggedIn === null)
        return <div />
    if (isLoggedIn === false)
        return <MainFunction />

}

const MainFunction = () => {

    const userData = useUserData();
    const x = userData.userData;
    
    
    const navigate = useNavigate();
    const notification = useShowNotification();
    const loginSuccessful = (res) => {
        const {upruns, access_token, name, uprun_gains, is_new_user} = res.user
        sessionStorage.authToken = access_token
        notification('logged in successfully')
        x.upruns = upruns
        x.userFromLogin = res.user
        // x.name = name
        userData.setData({...x})
        if(is_new_user || name===" ")
        navigate('/user-info', {replace: true, state: {isNameEmpty: name===" ", isNewUser: is_new_user}})
        else
        navigate('/main', {replace: true})
    }

    const loginFail=err=>{
        notification(err?.message?? 'Something went wrong.')
    }

    const loginFunction = () => {
        auth({}, (res) => loginSuccessful(res), err => loginFail(err))
    }



 
    return <div className="f fc loginPg rp fw">

        <img
            src={loginBg}
            style={{ left: 0, objectFit: 'cover' }}
            className="ap fw fh"
        />

        <BouncyComp
            customClasses={"cta whiteBtn"}
            styles={{ marginTop: 'auto', marginLeft: 0, marginRight: 0 }}
            useDefaultBtnStyles
            text="Login with phone no."
            onClick={()=>navigate('./phone-no')}
        />

        <BouncyComp
            customClasses={"cta whiteBtn"}
            outlined
            styles={ outlinedBtnStyles }
            useDefaultBtnStyles
            text="Login with Upstox"
            onClick={loginFunction}
        />

    </div>
}

const outlinedBtnStyles = {
    marginTop: 'var(--baseVal3)', marginLeft: 0, marginRight: 0, background: 'none',
    borderColor: 'white', color: 'white',
}