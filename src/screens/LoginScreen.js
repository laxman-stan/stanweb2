import BouncyComp from "../uiComps/BouncyComp"
import InputField from "../uiComps/InputField"
import { useEffect, useState, useContext } from "react";
import { auth, loginViaTokenAuth } from "../apis/calls";
import useShowNotification from "../hooks/useShowNotification";
import { useLocation, useNavigate } from "react-router-dom";
import loginBg from '../assets/login.webp'
import useUserData from "../hooks/useUserData";


export default function LoginScreen() {

    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const navigate = useNavigate();
    const location = useLocation();
    // console.log(location.search.split("=")[1]);

    useEffect(() => {
        if (sessionStorage.authToken)
            navigate('/cricexchange/main')
        else
            setIsLoggedIn(false)
    }, [])

    if (isLoggedIn === null)
        return <div />
    if (isLoggedIn === false)
        return <MainFunction location={location} />

}

const MainFunction = ({location}) => {

    const z = location.search?.split("=")[1];
    const userData = useUserData();
    const x = userData.userData;
    
    
    const navigate = useNavigate();
    const notification = useShowNotification();
    const loginSuccessful = (res) => {
        console.log('success', res)
        const {upruns, access_token, name, uprun_gains, is_new_user} = res.user
        sessionStorage.authToken = access_token
        notification('logged in successfully')
        x.upruns = upruns
        x.userFromLogin = res.user
        // x.name = name
        userData.setData({...x})
        if(is_new_user || name===" ")
        navigate('/cricexchange/user-info', {replace: true, state: {isNameEmpty: name===" ", isNewUser: is_new_user}})
        else
        navigate('/cricexchange/main', {replace: true})
    }

    const loginFail=err=>{
        console.log('fail', err)
        notification(err?.message ?? err?.toString() ?? "Something  went wrong.")
    }

    const loginFunction = () => {
        auth({}, loginSuccessful, loginFail)
    }

    useEffect(() => {
        if(location.search.includes("code=")){
            
            console.log('yha tq shi h', x)
            if(z){
                loginViaTokenAuth(
                    {
                        "code" : z
                    },
                    loginSuccessful,
                    loginFail
                )
            }
        }
    }, [])
 
    return <div className="f fc loginPg rp fw">

        <img
            alt="login-background"
            src={loginBg}
            style={{ left: 0, objectFit: 'cover' }}
            className="ap fw fh"
        />

        <BouncyComp
            customClasses={"cta whiteBtn"}
            styles={{ marginTop: 'auto', marginLeft: 0, marginRight: 0 }}
            useDefaultBtnStyles
            showLoading={z?true:false}
            text={z?`Logging in...`:`Login with Phone No.`}
            onClick={()=>navigate('/cricexchange/phone-no')}
        />

        {/* <BouncyComp
            customClasses={"cta whiteBtn"}
            outlined
            // showLoading={z?true:false}
            styles={ outlinedBtnStyles }
            useDefaultBtnStyles
            text={"Login with Upstox"}
            onClick={loginFunction}
        /> */}

    </div>
}

const outlinedBtnStyles = {
    marginTop: 'var(--baseVal3)', marginLeft: 0, marginRight: 0, background: 'none',
    borderColor: 'white', color: 'white',
}