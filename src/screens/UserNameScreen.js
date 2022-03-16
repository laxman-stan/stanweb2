import { useState } from 'react'
import { InputField, BouncyComp } from '../uiComps'
import { TitleComp } from './OtpScreen'
import { Call } from '../assets';
import useShowNotification from '../hooks/useShowNotification';
import { useNavigate } from 'react-router-dom';
import userIcon from '../assets/icons/userIcon.png'

export default function UserNameScreen() {

    const navigate = useNavigate();
    const notification = useShowNotification();
    const [phoneNo, setPhoneNo] = useState("");
    const [showLoader , setLoader] = useState(false);
    const onChange = e => {
        if(e.target.value.length<=20)
        setPhoneNo(e.target.value)
        else
        notification('Name should be less than 30 characters.')
    }

    const callApi=()=>{
        console.log('called');
    }

    return (
        <div
            style={{ backgroundColor: 'var(--mainHighlight)', paddingLeft: 'var(--baseVal3)', paddingRight: 'var(--baseVal3)' }}
            className="fh fw f fc">
            <TitleComp
                titleText={"Hi, Welcome to the Upstox"}
                line1={"What should we call you?"}
                line2={null}
            />

            <InputField
                
                preComp={<img style={{ height: '70%', transform: 'translateY(0px)' }} src={userIcon} />}
                placeholder="Your name"
                value={phoneNo}
                maxLength={21}
                type="text"
                onChange={onChange}
            />

            <BouncyComp
                customClasses={"cta whiteBtn"}
                styles={{ marginTop: 'var(--baseVal6)', marginLeft: 0, marginRight: 0 }}
                useDefaultBtnStyles
                text="Continue"
                showLoading={showLoader}
                onClick={showLoader? null : callApi}
            />

        </div>
    )
}