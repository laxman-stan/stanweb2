import { BouncyComp } from '../uiComps';
import OtpInput from 'react-otp-input';
import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.webp';
const inputWidth = '2.5em'
export default function OtpScreen() {


    const [otp, setOtp] = useState("");
    const [otpStatus, setOtpStatus] = useState(null);
    const [activeResendBtn, setActiveResendBtn] = useState(false);
    const [remainigTime, setRemainingTime] = useState(30);
    const timeFun = useRef();

    useEffect(()=>{
        if(remainigTime>0)
      timeFun.current = setTimeout(() => {
        setRemainingTime(remainigTime - 1)
      }, 1000);
      else
      setActiveResendBtn(true)
    return ()=>clearInterval(timeFun.current)
    }, [remainigTime])

    return <div
        style={{ backgroundColor: 'var(--mainHighlight)', paddingLeft: 'var(--baseVal3)', paddingRight: 'var(--baseVal3)' }}
        className="fh fw f fc">
        <TitleComp />

        <OtpInput
            value={otp}
            onChange={e => setOtp(e)}
            numInputs={6}
            // placeholder='000000'
            isInputNum={true}
            containerStyle={'f fw otpCont'}
            inputStyle={{ ...inputStyles, borderColor: otpStatus === false ? 'var(--mainRed)' : otpStatus === true ? 'var(--mainGreen)' : 'transparent' }}
        />
        <div style={{color: 'var(--mainHighlight30)'}} className='f'
        >
            Not received? <span style={{ 
                color: 'var(--secondaryHighlight)', marginLeft: 'var(--baseVal2)',
                textDecoration: activeResendBtn? 'underline':'none', textUnderlineOffset: 1.5
                 }}>{'Resend ' + (activeResendBtn? 'OTP' : remainigTime + 's')}</span>
        </div>

        <BouncyComp
            customClasses={"cta whiteBtn"}
            styles={{ marginTop: 'var(--baseVal6)',  marginLeft: 0, marginRight: 0 }}
            useDefaultBtnStyles
            text="Verify OTP"
            // onClick={loginFunction}
        />
    </div>
}

const inputStyles = {
    width: inputWidth, height: inputWidth, borderRadius: "var(--baseVal2)", fontSize: '1.2em', padding: 0,
    backgroundColor: '#573d7e', fontWeight: 'bold', color: 'white', border: '2px solid'
}


export const TitleComp = ({
    titleText = "Enter OTP",
    line1 = "Enter the OTP sent to your",
    line2 = "mobile number +9188812128887"
}) => {


    return <div style={titleCont} className="f fc">
        <img
            src={logo} alt="logo"
            style={{
                width: '50%', marginBottom: '10%'
            }}
        />

        <h1 style={{ color: 'var(--superWhite)' }}>{titleText}</h1>
        <p style={{ ...para, marginTop: '.5em', marginBottom: '.1em' }}>{line1}</p>
        <p style={{ ...para, marginBottom: '10%' }}>{line2}</p>
    </div>
}



const titleCont = {
    marginTop: '5%'
}

const para = {
    color: 'var(--mainHighlight30)'
}
