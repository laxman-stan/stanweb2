
import { useState } from 'react'
import { InputField, BouncyComp } from '../uiComps'
import { TitleComp } from './OtpScreen'
import { Call } from '../assets';
import useShowNotification from '../hooks/useShowNotification';
export default function PhoneNoScreen() {

    const notification = useShowNotification();
    const [phoneNo, setPhoneNo] = useState("");
    const onChange = e => {
        let x = e.target.value.replace(/[^0-9]/g, '')
        if (!isNaN(x) && x.length < 11)
            setPhoneNo(x);
    }

    const getOTP=()=>{
        if(phoneNo.length===10)
        console.log('phoneNo',phoneNo)
        else
        notification('Enter a valid phone number')
    }

    return (
        <div
            style={{ backgroundColor: 'var(--mainHighlight)', paddingLeft: 'var(--baseVal3)', paddingRight: 'var(--baseVal3)' }}
            className="fh fw f fc">
            <TitleComp
                tilteText={"Log In"}
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
            onClick={getOTP}
            />

        </div>
    )
}