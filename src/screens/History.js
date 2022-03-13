import { BouncyComp, Bar } from "../uiComps"
import { colors } from "../constants/colors"
import { useOnce } from "@react-spring/shared"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { historyReq } from "../apis/calls"

export default function History() {
    const location = useLocation();
    const [history, setHisotry] = useState(null);
    const [dates, setDates] = useState([]);

    const getHistorySuccess=res=>{
        
        let x = res.map(i=>{
            let d = new Date(i.updated_at).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
            d = d.split(',')
            i['date'] = d[0]
            i['time'] = d[1]
            return i
        })

        x = res.reduce((obj, item)=>{
            if (!obj[item.date])
                obj[item.date] = []
            obj[item.date].push(item)
            return obj
        }, {})

        setHisotry(x)
        setDates(Object.keys(x));
    }

    useEffect(() => {
        if(location.pathname.includes('history')){
            historyReq(
                res=>getHistorySuccess(res),
                res=>console.log('ff', res) 
            )
        }
       
    },) //[location]

    return <div style={{overflowY: 'scroll', paddingBottom: 'var(--baseVal4)'}} className="f fc fh">
        {
            dates.map(i =><TransctionList
            key={i}
            date={i}
            data={history[i]}
            />)
        }
    </div>
}

const TransctionList = ({date, data}) => {
  

    return <div style={{ gap: 'var(--baseVal3)', marginTop: 'var(--baseVal3)' }} className="f fc whiteCard">


        <h3 className="f sb ac">{date}</h3>

        {data.map(({ message, time, amount }, index) =><div key={index}> <div  className="f sb">
            <h5 style={{ lineHeight: '1.4em' }}><span>{message}</span>
                <br />
                {time}
            </h5>

            <h4 style={{
                color: amount > 0 ? colors.mainGreen : colors.mainRed,
            }}>{amount}</h4>
        </div>
{   index!==data.length -1 ? <Bar
        height={1}
        otherStyles={{
            marginTop: '.8em', opacity: .2
        }}
        /> : null}
        </div>
        )}

    </div>
}