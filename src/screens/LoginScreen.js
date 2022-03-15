import BouncyComp from "../uiComps/BouncyComp"
import InputField from "../uiComps/InputField"
import { useEffect, useState, useContext } from "react";
import { auth } from "../apis/calls";
import useShowNotification from "../hooks/useShowNotification";
import { useNavigate } from "react-router-dom";
import loginBg from '../assets/login.png'


export default function LoginScreen() {

    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const navigate = useNavigate();
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

    // const [value, setValue] = useState("");
    // const onChange = (e) => {
    //     let t = e.target.value.replace(/[^0-9]/g, '')
    //     if (t.length < 11)
    //         setValue(t);
    // }
    const isNewUser = true;
    const navigate = useNavigate();
    const notification = useShowNotification();
    const loginSuccessful = (res) => {
        sessionStorage.authToken = res.user.access_token
        notification('logged in successfully')
        if(isNewUser)
        navigate('/app-guide', {replace: true})
        else
        navigate('/main', {replace: true})
    }

    const loginFunction = () => {
        auth({}, (res) => loginSuccessful(res), (rs) => console.log('err', rs))
    }


    // useEffect(()=>{
    //     auth({}, (res)=>console.log('res', res), (rs)=>console.log('err',rs))
    // }, [])
    return <div className="f fc loginPg rp fw">
        {/* <InputField
         preComp={<p style={{color: 'var(--white3)'}} className="normalText">+91</p>}
         placeholder="9999999999"
         value={value}
         maxLen={10}
         type="number"
         onChange={onChange}
         /> */}

        <img
            src={loginBg}
            style={{ left: 0, objectFit: 'cover' }}
            className="ap fw fh"
        />

        <BouncyComp
            customClasses={"cta whiteBtn"}
            styles={{ marginTop: 'auto', marginLeft: 0, marginRight: 0 }}
            useDefaultBtnStyles
            text="Login with upstocks"
            onClick={loginFunction}
        />

        <BouncyComp
            customClasses={"cta whiteBtn"}
            outlined
            styles={ outlinedBtnStyles }
            useDefaultBtnStyles
            text="Login with upstocks"
            onClick={loginFunction}
        />

    </div>
}

const outlinedBtnStyles = {
    marginTop: 'var(--baseVal3)', marginLeft: 0, marginRight: 0, background: 'none',
    borderColor: 'white', color: 'white',
}