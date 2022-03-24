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
    
    useEffect(() => {
        if (localStorage.getItem("authToken")){
            if(Date.now() - localStorage.getItem("savingTime") > 86400000){
            localStorage.removeItem("authToken")
            localStorage.removeItem("savingTime")
            setIsLoggedIn(false)
            }else{
                if(!location.search.includes('code='))
                navigate('/main')
                else{
                    localStorage.removeItem("authToken")
                    localStorage.removeItem("savingTime")
                    setIsLoggedIn(false)
                }
            }
            
        }
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
    const [isLoading, setIsLoading] = useState(z? true : false);
    
    const navigate = useNavigate();
    const notification = useShowNotification();
    const loginSuccessful = (res) => {
        const {upruns, access_token, name, uprun_gains, is_new_user} = res.user
        localStorage.setItem("authToken", access_token)
        localStorage.setItem("savingTime", Date.now())
        notification('logged in successfully')
        x.upruns = upruns
        x.userFromLogin = res.user
        userData.setData({...x})
        if(is_new_user || name===" ")
        navigate('/user-info', {replace: true, state: {isNameEmpty: name===" ", isNewUser: is_new_user}})
        else
        navigate('/main', {replace: true})
    }

    const loginFail=err=>{
        notification(err?.message ?? err?.toString() ?? "Something  went wrong.")
        setIsLoading(false);
    }

    const loginFunction = () => {
        auth({}, loginSuccessful, loginFail)
        
    }

    useEffect(() => {
        if(location.search.includes("code=")){
            
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
            showLoading={isLoading}
            text={z?isLoading? `Logging in...`: "Verification failed" :`Login with Mobile No.`}
            onClick={
                z? ()=>{} : ()=> navigate('/phone-no')
            }
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