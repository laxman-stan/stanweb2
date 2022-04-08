import { useEffect, useRef, useState } from "react"
import { colors } from "../constants/colors"
import { BouncyComp, Bar, CloseBtn, Loader, InputField } from "../uiComps"
import { ShowBottomBavContext } from "../App"
import { Outlet, useNavigate } from "react-router-dom"
import { redeemRewardReq, rewardReq } from "../apis/calls"
import { Coin } from "../assets"
import useShowBottomSheet from "../hooks/useShowBottomSheet"
import useShowNotification from "../hooks/useShowNotification"
import useUserData from "../hooks/useUserData"
import { detectBrowser, NormalInput } from './PhoneNoScreen'

export default function WalletScreen() {

    return <Outlet />
}

const DATA = {
    howToRedeem: [
        "UPruns collected during the gameplay help unlock rewards on the platform. Based on your performance, you can level up in the game, and when a new level unlocks, a new reward can be claimed.",
        "Once a reward gets unlocked, all you have to do is click on the ‘Claim’ button.",
        "Once you press the button, you will receive further communication from us  within the next 7 working days. The rest of the process to claim the reward would be explained in this communication.",
    ],
    tnC: [
        "Every person who signs up and accesses this gaming app agrees to abide by the terms, rules, and regulations set by Upstox, RKSV Securities India Pvt. Ltd. If you have any questions, please contact us.",
        "UCE reserves the right to review, update, change or replace any part of these Terms of Use or other terms of the agreement as it may consider appropriate at its sole and absolute discretion.",
        "Every user’s continued usage of the platform before or/and after the update, change, modification, or replacement in the agreement accounts for their valid consent to the terms.",
        "UCE offers only a free match ticket as a reward. The reward does not include travel or any other offering. Every person who claims a match ticket will be asked to collect their ticket in advance from a communicated location in the city where the match is scheduled."
    ]
}

export const Wallet = () => {
    const { upruns, gain } = useUserData().userData;
    const navigate = useNavigate();
    const notification = useShowNotification();
    const rewardApiRes = useRef();

    const [isDailyCalimed, setIsDailyClaimed] = useState(false);

    const [rewards, setRewards] = useState([]);
    const setRewardsFun = (all, claimed) => {
        let isDailyRewardClaimed = false;
        let rewards = all
        rewards = rewards.map(i => {
            if (claimed.length) {
                let x = !~claimed.findIndex(j => j.reward.id === i.id)
                i.isClaimed = !x
                if (!x && i.daily)
                    isDailyRewardClaimed = true
            }
            i.canBuy = gain > i.price
            let expiryTime = new Date(i.expiredDate).getTime();
            i.isExpired = i.expiredDate && (new Date().getTime() > expiryTime)
            return i
        })
        if (isDailyRewardClaimed)
            setIsDailyClaimed(true)
        setRewards(rewards)
    }

    const apiFailed = (err) => {
        notification(err?.message ?? 'Something went wrong');
    }

    useEffect(() => {
        rewardReq(
            (res) => {
                rewardApiRes.current = res;
                setRewardsFun(res.rewards, res.claimedRewards)
            },
            apiFailed
        )
    }, [])

    useEffect(() => {
        if (rewardApiRes.current) {
            setRewardsFun(rewardApiRes.current.rewards, rewardApiRes.current.claimedRewards)
        }
    }, [gain])


    return <div style={{ overflowY: 'scroll' }} className="f fh fc">

        <div style={{ paddingLeft: 'var(--baseVal)' }} className="f walletCard whiteCard sb">
            <h5 style={{ fontWeight: 'normal', marginLeft: 'var(--baseVal2)' }}>Total Balance
                <br />
                <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{upruns?.toLocaleString('en-IN')}</p>
            </h5>

            <h5 style={{ fontWeight: 'normal' }}>Earned Upruns
                <br />
                <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{gain?.toLocaleString('en-IN')}</p>
            </h5>

            <BouncyComp
                onClick={() => navigate('/main/wallet/history')}
                text="History"
                styles={{ marginTop: 'auto', width: '4.7em', }}
                customClasses="highlightedSmallBtn btnPrimeColor"
            />
        </div>

        <h3 className="heading">Redeem Offers</h3>

        {
            rewards.length ? rewards.map((i, index) => <RewardComp
                data={i} key={index} setDaily={setIsDailyClaimed} isDailyRewardClaimed={isDailyCalimed}
            />) : <Loader />
        }
    </div>
}

const RewardComp = ({ data, isDailyRewardClaimed, setDaily }) => {
    const bottomSheet = useShowBottomSheet();
    const notification = useShowNotification();
    const { price, title, id, desc, isClaimed: isItemClaimed, canBuy, image, isExpired, daily } = data
    const count = data.availableCount + "/" + data.maxCount
    const [isClaimed, setIsClaimed] = useState(isItemClaimed)

    // const apiCalled = (isRedeemed, res) => {

    //     bottomSheet(false);
    //     //console.log(res.reward_claimed, 'll')
    //     notification(isRedeemed ?
    //         res?.reward_claimed ? "Claimed successfully" : "Reward not claimed."
    //         : res?.toString() ?? 'Something went wrong')

    //     if (isRedeemed) {
    //         showMsg(res.reward_claimed);
    //         if (res?.reward_claimed) {
    //             setIsClaimed(true)
    //             // let x = userData.userData;
    //             // x.upruns -= price
    //             // x.gain -= price
    //             // userData.setData({...x})
    //         }
    //     }
    // }

    const redeemed = res => {
        showMsg(res.reward_claimed);
        if (res?.reward_claimed) {
            setIsClaimed(true)
            if (daily)
                setDaily(true)
        }
        bottomSheet(false)
    }

    const formSheet = {
        customChild: <BottomSheetForm close={() => bottomSheet(false)} redeemed={redeemed} id={id} />,
        customConfig: "gentle",
        // disableActions: true,
        preventHiding: true,
    }

    const clickFun = () => {


        if (isExpired)
            notification('Reward expired')
        else if (isClaimed)
            notification('Already claimed')
        else if (isDailyRewardClaimed && daily)
            notification('Only one daily reward can be claimed.')
        else if (!data.availableCount)
            notification('Not available')
        else if (!canBuy)
            notification("You haven't earned enough UPruns yet!")

        else {
            bottomSheet(true, formSheet)
            // const props = {
            //     message: `Are you sure to claim ${title}?`,
            //     acceptAction: () => ,
            //     disableActions: true
            // }
            // bottomSheet(true, props);
        }

    }

    const viewDetails = () => {
        const bottomsheetPropsForDetails = {
            customChild: <RewardInfo details={data} close={() => bottomSheet(false)} />,
            customConfig: 'gentle'
        }
        bottomSheet(true, bottomsheetPropsForDetails);
    }

    const showMsg = (isClaimed) => {
        const props = {
            message: "Congratulations 🎉 You have successfully claimed your reward. We will communicate about processing your claimed reward within the next 7 working days or at least 2 days before the match, whichever is earlier.",
            acceptAction: () => bottomSheet(false),
            // declineText: "Later",
            acceptText: "Got it",
            onlyOneBtn: isClaimed,
        }
        setTimeout(() => {
            bottomSheet(true, props)
        }, 500);
    }
    return <div style={{ marginBottom: 'var(--baseVal3)' }} className="f whiteCard fc">

        <div style={{ gap: '.5em' }} className="f sb ac">
            <img style={{ width: 40, height: 40, borderRadius: 2 }} src={image} />

            <div style={{ marginRight: 'auto', marginLeft: 'var(--baseVal)' }}>
                <h3 style={{ fontSize: '1em' }}>{title}</h3>
                <p style={{ fontSize: '.8em' }}>{desc}
                    <span style={{ marginLeft: 'var(--baseVal2)' }}>{"Available: " + count}<span style={{ color: 'var(--secondaryHighlight)' }}>{daily ? "\u00A0\u00A0Daily reward" : ""}</span></span>
                </p>
                {/* {daily? <p style={{ fontSize: '.8em', marginTop: 'var(--baseVal)', marginBottom: 'var(--baseVal)'}}><span>Daily reward</span></p> : null} */}
            </div>
        </div>

        <Bar
            height={1}
            otherStyles={{
                marginTop: '.8em', opacity: .2,
                marginBottom: '.5em'
            }}
        />

        <div className="f sb ac">

            <BouncyComp
                text='More details'
                // onClick={showMsg}
                onClick={viewDetails}
                styles={{
                    fontSize: '.8em',
                    color: 'var(--secondaryHighlight)',
                    textDecoration: 'underline'
                }}
            />
            <div style={{ marginLeft: 'auto', gap: 'var(--baseVal)' }} className="f ac">
                <h5>Earn:</h5>
                <img
                    style={{ width: 16, height: 16 }}
                    src={Coin} />
                <h4>{price}</h4>
            </div>

            <BouncyComp
                onClick={clickFun}
                bounceLevel={.8}
                styles={{ marginLeft: 'var(--baseVal3)', width: '4.6em', backgroundColor: 'var(--mainHighlight)', opacity: isClaimed || !canBuy || isExpired || (isDailyRewardClaimed && daily) ? .6 : 1 }}
                text={isClaimed ? 'Claimed' : 'Claim'}
                customClasses="highlightedSmallBtn"
            />
        </div>

    </div>
}

const RewardInfo = (props) => {

    const { price, title, id, desc, data, image, expiredDate: ed } = props.details;
    const listData = data ?? DATA
    const modifyEd = ed => {
        let cd = new Date(ed)
        cd.setDate(cd.getDate() - 1)
        return cd.toLocaleDateString()
    }
    const expiredDate = ed ? modifyEd(ed) : "Tata IPL 2022"

    return <div onClick={e => e.stopPropagation()} style={rewardInfoCard} className="f whiteCard">
        <div style={{ height: '100%', overflowY: 'scroll', paddingBottom: 'calc( 30% + 200px )' }} className="f fc">
            <div className="f ">
                <img
                    alt="reward"
                    style={{ width: 40, height: 40, transform: 'translateY(5px)', borderRadius: 2 }}
                    src={image}
                />
                <div style={{ marginLeft: 'var(--baseVal2)', textTransform: 'capitalize', }} className="f fc">
                    <h3 style={{ fontWeight: 'bold', color: 'var(--mainHighlight)' }}>{title}</h3>
                    <p style={subHeading}>{desc}</p>
                </div>
            </div>

            <Bar
                height={1}
                otherStyles={{
                    marginTop: '.8em', marginBottom: '.5em', opacity: .2, flex: 'none'
                }}
            />

            <div className="sb f">
                <div className="f">
                    Valid till: {'\u00A0'}<span>{expiredDate}</span>
                </div>
                <div className="f">
                    Avail for: {'\u00A0'}<img src={Coin} style={{ width: 16 }} /> <span>{'\u00A0' + price}</span>
                </div>
            </div>

            <Bar
                height={1}
                otherStyles={{
                    marginTop: '.8em', marginBottom: '.5em', opacity: .2, flex: 'none'
                }}
            />

            <div style={{ paddingLeft: 'var(--baseVal4)', paddingRight: 'var(--baseVal4)' }}>
                <h4>How to Redeem</h4>
                <ol>{
                    listData.howToRedeem.map((item, index) => <li key={index}>{item}</li>)
                }
                </ol>
            </div>

            <div style={{ paddingLeft: 'var(--baseVal4)', paddingRight: 'var(--baseVal4)', marginTop: 'var(--baseVal4)' }}>
                <h4>Terms and Conditions</h4>
                <ul style={{ transform: 'translateX(2px)' }}>
                    {
                        listData.tnC.map((item, index) => <li key={index}>{item}</li>)
                    }
                </ul>
            </div>

            <CloseBtn
                onClick={props.close}
                styles={{ right: 'var(--baseVal3)' }}
            />
        </div>

    </div>
}

const rewardInfoCard = {
    margin: 0,
    height: '100%',
    overflowY: 'scroll',
    marginTop: 'auto',
    alignSelf: 'flex-end',
    transform: 'translateY(30%)',
    paddingLeft: 'var(--baseVal4)',
    paddingRight: 'var(--baseVal4)',
}

const BottomSheetForm = ({ id, redeemed, close }) => {

    const browser = detectBrowser();

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const notification = useShowNotification();

    const setEmailFun = e => {
        let t = e.target.value.replace(/ /g, '').toLowerCase();
        setEmail(t)
    }
    const setPhoneFun = e => {
        let x = e.target.value.replace(/[^0-9]/g, '')
        if (!isNaN(x) && x.length < 11)
            setPhone(x);
    }

    const apiCalled = (isRedeemed, res, close) => {
        setIsLoading(false);

        notification(isRedeemed ?
            res?.reward_claimed ? "Claimed successfully" : "Reward not claimed."
            : res?.toString() ?? 'Something went wrong')

        if (isRedeemed) {
            redeemed(res)
        }
    }

    const submitAction = () => {
        redeemRewardReq(
            {
                "rewardId": id,
                "email": email,
                "phone": "+91" + phone
            },
            (res) => apiCalled(true, res),
            (res) => apiCalled(false, res)
        )
    }

    const verifyEmail = () => {
        let t = /\S+@\S+\.\S+/
        return t.test(email)
    }

    const submitForm = () => {
        if (!verifyEmail())
            return notification('Please enter a valid email')

        if (phone.length < 10)
            return notification('Please enter a valid phone number')

        setIsLoading(true);
        submitAction(email, phone)
    }

    const formSet = [
        {
            type: 'email',
            placeholder: 'Your email id',
            value: email,
            onChange: setEmailFun,
            title: 'Email ID',
            preComp: null
        },
        {
            type: 'number',
            placeholder: '10-digit mobile number',
            value: phone,
            onChange: setPhoneFun,
            title: 'Mobile number on WhatsApp',
            preComp: <p style={{ color: 'var(--mainHighlight)', fontSize: 18 }}>+91</p>
        },
    ]

    return <div onClick={e => e.stopPropagation()} style={{ marginTop: 'auto', marginLeft: 0, marginRight: 0, paddingBottom: '100px', transform: 'translateY(calc(100px - var(--baseVal3)))' }} className="f fc whiteCard">
        <h4 style={{
            marginLeft: 'var(--baseVal4)',
            paddingBottom: 'var(--baseVal)',
            marginRight: 'var(--baseVal6)',
            paddingRight: 'var(--baseVal3)'
        }}>We will communicate about your claimed reward within the next 7 working days or at least 2 days before the match, whichever is earlier.</h4>
        {
            formSet.map(i => (<div key={i.title}>
                <p className="lable" >{i.title}</p>
                {
                    browser === 'ok' ? <InputField
                        ourterContStyle={{ backgroundColor: "#41246E4d", marginBottom: 'var(--baseVal2)' }}
                        type={i.type}
                        placeholder={i.placeholder}
                        value={i.value}
                        onChange={i.onChange}
                        inputClassName="blackPlacehoder"
                        textClassName="primeText"
                        preComp={i.preComp}
                    /> : <NormalInput
                        ourterContStyle={{ marginBottom: 'var(--baseVal2)', marginTop: 0 }}
                        type={i.type}
                        placeholder={i.placeholder}
                        value={i.value}
                        onChange={i.onChange}
                        preComp={i.preComp}
                        customStyles={{ color: 'var(--mainHighlight)', backgroundColor: '#41246E4d', paddingLeft: browser !== 'ok' ? 'var(--baseVal4)' : i.preComp ? 46 : 'var(--baseVal4)', borderRadius: 4 }}
                    />
                }
            </div>
            ))
        }

        <BouncyComp
            onClick={submitForm}
            text={'Submit'}
            styles={{ marginBottom: '.5em', marginTop: 'var(--baseVal)', marginLeft: 0, marginRight: 0, width: 'calc( (100 * var(--vw) ) - var(--baseVal6))', flex: 'none' }}
            customClasses='cta'
            showLoading={isLoading}
        />

        <CloseBtn
            onClick={close}
            styles={{ right: 'var(--baseVal3)' }}
        />
    </div>
}

const subHeading = {
    color: 'var(--mainHighlight30)'
}

// sin(con(tan(30))) = 