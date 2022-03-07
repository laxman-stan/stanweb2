import BouncyComp from "../uiComps/BouncyComp"
import InputField from "../uiComps/InputField"
import { useEffect, useState, useContext } from "react";
import { auth } from "../apis/calls";
import { NotificationContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {

    // const [value, setValue] = useState("");
    // const onChange = (e) => {
    //     let t = e.target.value.replace(/[^0-9]/g, '')
    //     if (t.length < 11)
    //         setValue(t);
    // }

    const navigate = useNavigate();
    const showNoification = useContext(NotificationContext)
    const loginSuccessfull=(res)=>{
        // console.log(res.user.accessToken)
        sessionStorage.authToken = res.user.accessToken
        showNoification('logged in successfully')
        setTimeout(() => {
            navigate('/main')
        }, 3000);
    }

    const loginFunction=()=>{
        auth({}, (res)=>loginSuccessfull(res), (rs)=>console.log('err',rs))
    }


    // useEffect(()=>{
    //     auth({}, (res)=>console.log('res'), (rs)=>console.log('err',rs))
    // }, [])
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
            styles={{ marginTop: 'var(--baseVal3', marginTop: 'auto' }}
            useDefaultBtnStyles
            text="Login with upstocks"
            onClick={() => showNoification()}
        />

        <BouncyComp
            styles={{ marginTop: 'var(--baseVal3' }}
            useDefaultBtnStyles
            text="Create an account"
            outlined
            onClick={loginFunction}
        />
    </div>
}