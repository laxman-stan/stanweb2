import BouncyComp from "../uiComps/BouncyComp"
import InputField from "../uiComps/InputField"
import { useEffect, useState, useContext } from "react";
import { auth } from "../apis/calls";
import useShowNotification from "../hooks/useShowNotification";
import { useNavigate } from "react-router-dom";


export default function LoginScreen() {

    const [isLoggedIn, setIsLoggedIn ] = useState(null)
    const navigate = useNavigate();
    useEffect(()=>{
        if(sessionStorage.authToken)
            navigate('/main')
        else
            setIsLoggedIn(false)
    }, [])
    
    if(isLoggedIn===null)
    return <div/>
    if(isLoggedIn===false)
    return <MainFunction/>

}

const MainFunction = () =>{

    // const [value, setValue] = useState("");
    // const onChange = (e) => {
    //     let t = e.target.value.replace(/[^0-9]/g, '')
    //     if (t.length < 11)
    //         setValue(t);
    // }

    const navigate = useNavigate();
    const notification = useShowNotification();
    const loginSuccessfull=(res)=>{
        sessionStorage.authToken = res.user.accessToken
        notification('logged in successfully')
        navigate('/main')
    }

    const loginFunction=()=>{
        auth({}, (res)=>loginSuccessfull(res), (rs)=>console.log('err',rs))
    }


    useEffect(()=>{
        auth({}, (res)=>console.log('res'), (rs)=>console.log('err',rs))
    }, [])
    return <div className="f fc loginPg fw">
        {/* <InputField
         preComp={<p style={{color: 'var(--white3)'}} className="normalText">+91</p>}
         placeholder="9999999999"
         value={value}
         maxLen={10}
         type="number"
         onChange={onChange}
         /> */}

        <BouncyComp
            customClasses={"cta"}
            styles={{ marginTop: 'var(--baseVal3', marginTop: 'auto', marginLeft: 0, marginRight: 0 }}
            useDefaultBtnStyles
            text="Login with upstocks"
            onClick={loginFunction}
        />

    </div>
}