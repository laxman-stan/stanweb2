
import { useState } from 'react'
import { InputField, BouncyComp } from '../uiComps'
import { TitleComp } from './OtpScreen'
import { Call } from '../assets';
import { sendOTP } from '../apis/calls';
import useShowNotification from '../hooks/useShowNotification';
import { useNavigate } from 'react-router-dom';


export function getRandomString(length) {

    
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

export default function PhoneNoScreen() {

    const navigate = useNavigate();
    const notification = useShowNotification();
    const [phoneNo, setPhoneNo] = useState("");
    const [showLoader , setLoader] = useState(false);
    const onChange = e => {
        let x = e.target.value.replace(/[^0-9]/g, '')
        if (!isNaN(x) && x.length < 11)
            setPhoneNo(x);
    }

    const apiRes=(isSuccess, res, reqID)=>{
        console.log(res);
        setLoader(false);
        if(isSuccess && res.success){
            console.log( res?.data)
            let {validateOTPToken: token, nextRequestInterval: timeOut} = res?.data
            notification('OTP sent successfully.');
            console.log(phoneNo, token, timeOut, reqID);
            navigate('/otp', { state: { phoneNo, token, timeOut, reqID } });
        }else
            notification(
                res?.message?? 'Something went wrong.'
            );
    }

    const getOTP=()=>{
        if(phoneNo.length===10){
            let reqId = getRandomString(30);
            setLoader(true);
            console.log(reqId);
        sendOTP(
            phoneNo,
            res=>apiRes(true, res, reqId),
            res=>apiRes(false, res),
            reqId
        )}
        else
        notification('Enter a valid phone number')
    }

    return (
        <div
            style={{ backgroundColor: 'var(--mainHighlight)', paddingLeft: 'var(--baseVal3)', paddingRight: 'var(--baseVal3)' }}
            className="fh fw f fc">
            <TitleComp
                titleText={"Log In"}
                line1={"Enter your mobile number"}
                line2={"We will send you OTP to verfify"}
            />

            <InputField
                
                preComp={<img style={{ height: '70%', transform: 'translateY(0px)' }} src={Call} />}
                placeholder="9999999999"
                value={phoneNo}
                maxLen={10}
                type="number"
                onChange={onChange}
            />

            <BouncyComp
                customClasses={"cta whiteBtn"}
                styles={{ marginTop: 'var(--baseVal6)', marginLeft: 0, marginRight: 0 }}
                useDefaultBtnStyles
                text="Continue"
                showLoading={showLoader}
                onClick={showLoader? null : getOTP}
            />

        </div>
    )
}