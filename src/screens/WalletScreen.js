import { useEffect, useContext } from "react"
import { colors } from "../constants/colors"
import { BouncyComp } from "../uiComps"
import { ShowBottomBavContext } from "../App"
export default function WalletScreen(){

    return <div className="f fh fc">
        <TransctionList/>
    </div>
}

const TransctionList=()=>{

const data=[
    {
        title: 'Auction',
        date: '12/12/12',
        time: '12:12pm ',
        amount: -110,
    },
    {
        title: 'Auction',
        date: '12/12/12',
        time: '12:12pm ',
        amount: 100,
    },
    {
        title: 'facfjlas',
        data: '21/3/32',
        time: '12:12pm ',
        amount: 810,
    }
]



    return <div style={{backgroundColor: 'transparent', boxShadow: 'none', gap: 'var(--baseVal3)'}} className="f fc whiteCard">

        <div className="f walletCard sb">
                <h4>Total Balance
                <br/>
                <h2>3000</h2>
                </h4>
                
                <BouncyComp
                text="Redeem"
                styles={{ marginTop: 'auto', width: '4.7em', marginBottom: '.5em'}}
                customClasses="highlightedSmallBtn btnPrimeColor"
                />
            </div>

        <div style={{
            marginLeft: 0, marginRight: 0
        }} className="whiteCard">
        <div className="f sb ac">
        <h3>Transactions</h3>
        <BouncyComp
            customChild={<h5 style={{color: colors.secondaryHighlight}}>see all</h5>}
        />
        </div>
        

        {data.map(({title, date, time, amount}, index)=><div key={index} className="f sb">
            <h5 style={{lineHeight: '1.4em'}}><span>{title}</span>
            <br/>
            {date + "  " + time}
            </h5>
            
            <h4 style={{
                color: amount>0? colors.mainGreen: colors.mainRed,
            }}>{amount}</h4>
        </div>)}
        </div>
    </div>
}