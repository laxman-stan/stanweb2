import { useEffect, useState } from "react"
import { colors } from "../constants/colors"
import { BouncyComp, Bar, CloseBtn, Loader } from "../uiComps"
import { ShowBottomBavContext } from "../App"
import { Outlet, useNavigate } from "react-router-dom"
import { redeemRewardReq, rewardReq } from "../apis/calls"
import { Coin } from "../assets"
import useShowBottomSheet from "../hooks/useShowBottomSheet"
import useShowNotification from "../hooks/useShowNotification"
import useUserData from "../hooks/useUserData"

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
    ]
}

export const Wallet = () => {
    const {upruns, gain} = useUserData().userData;
    const navigate = useNavigate();
    const notification = useShowNotification();

    const [rewards, setRewards] = useState([]);
    const setRewardsFun = (all, claimed) => {

        let rewards = all
        rewards = rewards.map(i => {
            if (claimed.length) {
                let x = !~claimed.findIndex(j => j.reward.id === i.id)
                i.isClaimed = !x
            }
            i.canBuy = gain > i.price
            return i
        })

        setRewards(rewards)
    }

    const apiFailed = (err) => {
        notification(err?.message ?? 'Something went wrong');
    }

    useEffect(() => {
        rewardReq(
            (res) => setRewardsFun(res.rewards, res.claimedRewards),
            apiFailed
        )
    }, [])


    return <div style={{ overflowY: 'scroll' }} className="f fh fc">

        <div style={{paddingLeft: 'var(--baseVal)'}} className="f walletCard whiteCard sb">
            <h5 style={{ fontWeight: 'normal' }}>Total Balance
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
                data={i} key={index}
            />) : <Loader />
        }
    </div>
}

const RewardComp = ({ data }) => {
    const bottomSheet = useShowBottomSheet();
    const notification = useShowNotification();
    const { price, title, id, desc, isClaimed: isItemClaimed, canBuy, image } = data
    const count = data.availableCount + "/" + data.maxCount
    const [isClaimed, setIsClaimed] = useState(isItemClaimed)
    const userData = useUserData();
    const apiCalled = (isRedeemed, res) => {

        bottomSheet(false);
        //console.log(res.reward_claimed, 'll')
        notification(isRedeemed ?
            res?.reward_claimed ? "Claimed successfully" : "Reward not claimed."
            : res?.toString() ?? 'Something went wrong')

        if (isRedeemed) {
            showMsg(res.reward_claimed);
            if (res?.reward_claimed) {
                setIsClaimed(true)
                // let x = userData.userData;
                // x.upruns -= price
                // x.gain -= price
                // userData.setData({...x})
            }
        }
    }

    const clickFun = () => {
        if (isClaimed)
            notification('Already claimed')
        else if (!canBuy)
            notification("You haven't earned enough UPruns yet!")

        else {
            const props = {
                message: `Are you sure to claim ${title}?`,
                acceptAction: () => redeemRewardReq(
                    { "rewardId": id },
                    (res) => apiCalled(true, res),
                    (res) => apiCalled(false, res)
                ),
                disableActions: true
            }
            bottomSheet(true, props);
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
            message: "Congratulations 🎉! You have successfully claimed your reward. You will receive our communication within 7 days with the next steps for processing your reward.",
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
                    <span style={{ marginLeft: 'var(--baseVal2)' }}>{"Available: " + count}</span>
                </p>
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
                styles={{ marginLeft: 'var(--baseVal3)', width: '4.6em', backgroundColor: 'var(--mainHighlight)', opacity: isClaimed || !canBuy ? .6 : 1 }}
                text={isClaimed ? 'Claimed' : 'Claim'}
                customClasses="highlightedSmallBtn"
            />
        </div>

    </div>
}

const RewardInfo = (props) => {
    const { price, title, id, desc, data, image } = props.details;
    const listData = data ?? DATA

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
                    Valid till: {'\u00A0'}<span>Tata IPL 2022</span>
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

const subHeading = {
    color: 'var(--mainHighlight30)'
}