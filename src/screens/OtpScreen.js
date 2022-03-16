import { BouncyComp } from '../uiComps';
import OtpInput from 'react-otp-input';
import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.webp';
import { verifyOTP, sendOTP } from '../apis/calls';
import { useLocation, useNavigate } from 'react-router-dom';
import useShowNotification from '../hooks/useShowNotification';
import useUserData from '../hooks/useUserData';
import { getRandomString } from './PhoneNoScreen';

const inputWidth = '2.5em'


export default function OtpScreen() {
    const [isOtpCalled, setIsOtpCalled] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(location?.state?.phoneNo)
        setIsOtpCalled(true)
        else
        navigate('/phone-no', {replace: true})
    
    }, [])


    if(isOtpCalled)
        return <MainFun location={location} navigate={navigate}/>
    else return <div/>

}

const MainFun = ({location, navigate}) => {

    const notification = useShowNotification();
    const userData = useUserData();

    const x = userData.userData;
    const phone = useRef(location.state.phoneNo);
    const token = useRef(location.state.token);
    const reqID = useRef(location.state.reqID);

    // console.log(location.state);

    const [otp, setOtp] = useState("");

    const [isLoading, setIL] = useState(false);
    const [otpStatus, setOtpStatus] = useState(null);

    const [activeResendBtn, setActiveResendBtn] = useState(false);
    const [remainigTime, setRemainingTime] = useState(location.state.timeOut);
    const timeFun = useRef();

    // useEffect(() => {
    //     if (remainigTime > 0)
    //         timeFun.current = setTimeout(() => {
    //             setRemainingTime(remainigTime - 1)
    //         }, 1000);
    //     else
    //         setActiveResendBtn(true)
    //     return () => clearInterval(timeFun.current)
    // }, [remainigTime])


    const apiCalled = (isSuccess, res) => {
        setIL(false)
        console.log(res);
        if (isSuccess) {
            setOtpStatus(true);
            const { upruns, access_token, name, uprun_gains, is_new_user } = res.user
            sessionStorage.authToken = access_token
            notification('logged in successfully')
            x.upruns = upruns
            x.userFromLogin = res.user
            // x.name = name
            userData.setData({ ...x })
            if (is_new_user)
                navigate('/app-guide', { replace: true })
            else
                navigate('/main', { replace: true })
        }
        else {
            notification(res?.message ?? 'Something went wrong.')
        }

    }

    const verifyOTPfun = () => {
        if(otp.length===6){

        setIL(true)
        let props = {
            "validateOTPToken": token.current,
            "otp": otp.toString(),
            "requestId": reqID.current
        };
        console.log(props, 'ajfal')
        verifyOTP(
            props,
            res => apiCalled(true, res),
            res => apiCalled(false, res)
        )}
        else{
            notification('Please enter a valid 6 digit OTP')
        }
    }

    // const resendApiRes=(isSuccess, res)=>{

    // }

    // const resendOTP = () =>{
    //     setIL(true)
    //     let string = getRandomString(30);
    //     sendOTP(
    //         phone.current,
    //         res=>resendApiRes(true, res,),
    //         res=>resendApiRes(false, res),
    //         reqID.current
    //     )
    // }

    return <div
        style={{ backgroundColor: 'var(--mainHighlight)', paddingLeft: 'var(--baseVal3)', paddingRight: 'var(--baseVal3)' }}
        className="fh fw f fc">
        <TitleComp line2={
            "mobile no. " + phone.current
        } />

        <OtpInput
            value={otp}
            onChange={e => setOtp(e)}
            numInputs={6}
            // placeholder='000000'
            isInputNum={true}
            containerStyle={'f fw otpCont'}
            inputStyle={{ ...inputStyles, borderColor: otpStatus === false ? 'var(--mainRed)' : otpStatus === true ? 'var(--mainGreen)' : 'transparent' }}
        />
        {/* <div style={{ color: 'var(--mainHighlight30)' }} className='f'
        >
            Not received? <span style={{
                color: 'var(--secondaryHighlight)', marginLeft: 'var(--baseVal2)',
                textDecoration: activeResendBtn ? 'underline' : 'none', textUnderlineOffset: 1.5
            }}>{'Resend ' + (activeResendBtn ? 'OTP' : remainigTime + 's')}</span>
        </div> */}

        <BouncyComp
            customClasses={"cta whiteBtn"}
            styles={{ marginTop: 'var(--baseVal6)', marginLeft: 0, marginRight: 0 }}
            useDefaultBtnStyles
            text="Verify OTP"
            showLoading={isLoading}
            onClick={isLoading ? null : verifyOTPfun}
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
    line2 = "mobile number"
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
