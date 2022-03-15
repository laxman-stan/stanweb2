import { useEffect, useContext, useState } from "react"
import { colors } from "../constants/colors"
import { BouncyComp, Bar, CloseBtn, Lineup, Loader } from "../uiComps"
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


export const Wallet = () => {
    const upruns = useUserData().userData.upruns;
    const navigate = useNavigate();
    const notification = useShowNotification();
    
    const [rewards, setRewards] = useState([]);
    const setRewardsFun = (all, claimed) => {

        let rewards = all
        if (claimed.length)
            rewards = rewards.map(i => {
                let x = !~claimed.findIndex(j => j.reward.id === i.id)
                i.isClaimed = !x
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

        <div className="f walletCard whiteCard sb">
            <h5 style={{ fontWeight: 'normal' }}>Total Balance
                <br />
                <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{upruns?.toLocaleString('en-IN')}</p>
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
    const { price, title, id, desc, isClaimed: isItemClaimed } = data
    const [isClaimed, setIsClaimed] = useState(isItemClaimed)
    const userData = useUserData();
    const apiCalled = (isRedeemed, res) => {

        bottomSheet(false);
        notification(isRedeemed ? 'Redeemed successfully' : res ?? 'Something went wrong')
        if (isRedeemed){
            setIsClaimed(true)
            let x = userData.userData
            x.upruns -= price
            userData.setData({...x})
    }}


    const clickFun = () => {
        if (isClaimed)
            notification('Already claimed')
        else {

            const props = {
                message: `Are you sure to redeem ${title}?`,
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

    return <div style={{ marginBottom: 'var(--baseVal3)' }} className="f whiteCard fc">

        <div style={{ gap: '.5em' }} className="f sb ac">
            <img style={{ width: 40, height: 40 }} src={"https://source.unsplash.com/random/60×60"} />

            <div style={{ marginRight: 'auto', marginLeft: 'var(--baseVal)' }}>
                <h3 style={{ fontSize: '1em' }}>{title}</h3>
                <p style={{ fontSize: '.8em' }}>{desc}</p>
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
                text='See details'
                onClick={viewDetails}
                styles={{
                    fontSize: '.8em',
                    color: 'var(--secondaryHighlight)',
                    textDecoration: 'underline'
                }}
            />
            <div style={{ marginLeft: 'auto', gap: 'var(--baseVal)' }} className="f ac">
                <h5>Avail for:</h5>
                <img
                    style={{ width: 16, height: 16 }}
                    src={Coin} />
                <h4>{price}</h4>
            </div>

            <BouncyComp
                onClick={clickFun}
                bounceLevel={.8}
                styles={{ marginLeft: 'var(--baseVal3)', width: '4.6em', backgroundColor: 'var(--mainHighlight)', opacity: isClaimed ? .6 : 1 }}
                text={'Redeem'}
                customClasses="highlightedSmallBtn"
            />
        </div>

    </div>
}

const RewardInfo = (props) => {
    const { price, title, id, desc } = props.details;
    console.log(props.details);

    return <div onClick={e => e.stopPropagation()} style={rewardInfoCard} className="f whiteCard">
        <div style={{ height: '100%', overflowY: 'scroll', paddingBottom: 'calc( 30% + var(--baseVal4) )' }} className="f fc">
            <div className="f">
                <img
                    alt="reward"
                    style={{ width: 40, height: 40 }}
                    src={"https://source.unsplash.com/random/60×60"}
                />
                <div style={{marginLeft: 'var(--baseVal2)', textTransform: 'capitalize', }} className="f fc">
                    <h3 style={{fontWeight:'bold'}}>{title}</h3>
                    <p style={subHeading}>{desc}</p>
                </div>
            </div>

            <Bar
                height={1}
                otherStyles={{
                    marginTop: '.8em', marginBottom: '.5em', opacity: .2
                }}
            />

            <div className="sb f">
                <div className="f">
                    Valid till: {'\u00A0'}<span>Never expires</span>
                </div>
                <div className="f">
                    Avail for: {'\u00A0'}<img src={Coin} /> <span>{'\u00A0' + price}</span>
                </div>
            </div>

            <Bar
                height={1}
                otherStyles={{
                    marginTop: '.8em', marginBottom: '.5em', opacity: .2
                }}
            />

            <div style={{ paddingLeft: 'var(--baseVal4)', paddingRight: 'var(--baseVal4)' }}>
                <h4>How to Redeem</h4>
                <ol>
                    <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam, animi!</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum fugiat asperiores numquam, ipsa deserunt rem porro a facilis magni eveniet quia sunt optio, temporibus quod?</li>
                    <li>Lorem ipsum dolor sit amet consectetur.</li>
                </ol>
            </div>

            <div style={{ paddingLeft: 'var(--baseVal4)', paddingRight: 'var(--baseVal4)', marginTop: 'var(--baseVal4)' }}>
                <h4>Terms and conditions</h4>
                <ul style={{ transform: 'translateX(2px)' }}>
                    <li>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam, animi!</li>
                    <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum fugiat asperiores numquam, ipsa deserunt rem porro a facilis magni eveniet quia sunt optio, temporibus quod?</li>
                    <li>Lorem ipsum dolor sit amet consectetur.</li>
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
}

const subHeading = {
    
}