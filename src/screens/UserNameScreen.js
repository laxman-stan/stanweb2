import { useEffect, useState } from 'react'
import { InputField, BouncyComp } from '../uiComps'
import { TitleComp } from './OtpScreen'
import { Call } from '../assets';
import useShowNotification from '../hooks/useShowNotification';
import { useLocation, useNavigate } from 'react-router-dom';
import userIcon from '../assets/icons/userIcon.png'
import { detectBrowser, NormalInput } from './PhoneNoScreen';
import { updateUserName } from '../apis/calls';

export default function UserNameScreen() {
    const navigate = useNavigate();
    const location = useLocation();

    const [emptyName, set] = useState(true);

    useEffect(()=>{
        if(!location.state?.isNameEmpty){
            navigate('/')
        }
        else
        set(false)
    })
    if(!emptyName)
    return <MainFun navigate={navigate} location={location}/>
    else return <div/>
}

const MainFun=({location, navigate})=>{

    const {isNewUser} = location.state;
    const notification = useShowNotification();
    const [name, setName] = useState("");
    const [showLoader, setLoader] = useState(false);
    const browser = detectBrowser();
    const onChange = e => {
        if (e.target.value.length <= 24)
            setName(e.target.value)
        else
            notification('Name should be less than 25 characters.')
    }

    const apiCalled=(isSuccess, res)=>{
        setLoader(false)
        if(isSuccess){
            notification('Name updated successfully.')
            if(isNewUser)
                navigate('/app-guide', {replace: true, state: {isNewUser: true}})
            else
                navigate('/main', {replace: true})
    
        }
        else{
            notification(res?.message?? 'Something went wrong.')
        }  
    }

    const callApi = () => {
        setLoader(true);
        updateUserName(
            {
                "name": name
              },
            res=>apiCalled(true, res),
            res=>apiCalled(false, res)
        )
    }

    return (
        <div
            style={{ backgroundColor: 'var(--mainHighlight)', paddingLeft: 'var(--baseVal3)', paddingRight: 'var(--baseVal3)' }}
            className="fh fw f fc">
            <TitleComp
                titleText={"Welcome to Upstox."}
                line1={"How should we address you?"}
                line2={null}
            />

            {browser === 'ok' ? <InputField

                preComp={<img style={{ height: '60%', transform: 'translateY(0px)' }} src={userIcon} />}
                placeholder="Your name"
                value={name}
                maxLength={25}
                type="text"
                onChange={onChange}
            />
                :
                <NormalInput
                    preComp={<img style={{ height: '60%', transform: 'translateY(0px)' }} src={userIcon} />}
                    placeholder="Your name"
                    value={name}
                    maxLength={21}
                    type="text"
                    onChange={onChange}
                />}

            <BouncyComp
                customClasses={"cta whiteBtn"}
                styles={{ marginTop: 'var(--baseVal6)', marginLeft: 0, marginRight: 0 }}
                useDefaultBtnStyles
                text="Continue"
                showLoading={showLoader}
                onClick={showLoader ? null : callApi}
            />

        </div>
    )
}