import { useEffect, useContext, useState } from "react"
import { colors } from "../constants/colors"
import { BouncyComp, Bar } from "../uiComps"
import { ShowBottomBavContext } from "../App"
import { Outlet, useNavigate } from "react-router-dom"
import { redeemRewardReq, rewardReq } from "../apis/calls"
import { Coin } from "../assets"
import useShowBottomSheet from "../hooks/useShowBottomSheet"
import useShowNotification from "../hooks/useShowNotification"

export default function WalletScreen() {

    return <Outlet />
}


export const Wallet = () => {
    const navigate = useNavigate();

    const [rewards, setRewards] = useState([]);

    const setRewardsFun=(all, claimed)=>{

        let rewards = all
        if(claimed.length)
        rewards = rewards.map(i=>{
            let x = !~claimed.findIndex(j=>j.reward.id===i.id)

            i.isClaimed=!x
            return i
        })

        setRewards(all)
    }

    useEffect(() => {
        rewardReq(
            (res) => setRewardsFun(res.rewards, res.claimedRewards),
            (res) => console.log('fail', res)
        )
    }, [])


    return <div style={{overflowY: 'scroll'}} className="f fh fc">

        <div className="f walletCard whiteCard sb">
            <h5 style={{ fontWeight: 'normal' }}>Total Balance
                <br />
                <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>3000</p>
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
            rewards.map((i, index)=><RewardComp
            data={i} key={index}
             />)
        }
    </div>
}

const RewardComp = ({data}) => {
    const bottomSheet = useShowBottomSheet();
    const notification = useShowNotification();

    const { price, title, id, desc, isClaimed: isItemClaimed } = data

    const [isClaimed, setIsClaimed] = useState(isItemClaimed)

    const apiCalled=(isRedeemed, res)=>{

        bottomSheet(false);
        notification(isRedeemed? 'Redeemed successfully' : res ?? 'Something went wrong')
        if(isRedeemed)
        setIsClaimed(true)
    }
    

    const clickFun=()=>{
        if(isClaimed)
        notification('Already claimed')
        else{

            const props ={ message: `Are you sure to redeem ${title}?`,
            acceptAction: ()=>redeemRewardReq(
                { "rewardId" : id },
                (res)=>apiCalled(true, res),
                (res)=>apiCalled(false, res)
            ),
            disableActions: true}
            bottomSheet(true, props);
        }

    }


    return <div style={{marginBottom: 'var(--baseVal3)'}} className="f whiteCard fc">

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
            onClick={()=>console.log('click')}
            styles={{
                fontSize: '.8em',
                color: 'var(--secondaryHighlight)',
                textDecoration: 'underline'
            }}
            />
            <div style={{marginLeft: 'auto',gap: 'var(--baseVal)'}} className="f ac">
                <h5>Avail for:</h5> 
                <img
                style={{width: 16, height: 16}}
                 src={Coin}/>
                <h4>{price}</h4>
            </div>

            <BouncyComp
            onClick={clickFun}
            bounceLevel={.8}
            styles={{marginLeft: 'var(--baseVal3)', width: '4.6em', backgroundColor: 'var(--mainHighlight)',  opacity: isClaimed? .6 : 1}}
            text={'Redeem'}
            customClasses="highlightedSmallBtn"
            />
            </div>

    </div>
}