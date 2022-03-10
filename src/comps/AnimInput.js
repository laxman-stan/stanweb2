import { useState } from "react"
import { a, useSpring } from 'react-spring'
import { useEffect, useRef } from "react"


export default function AnimInput({placeholder}) {
const PLACE_HOLDER_TEXT = placeholder
const WID = PLACE_HOLDER_TEXT.length + 4 + 'ch'
    const [value, setValue] = useState('')
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const inputRef = useRef();
    const animInputRef = useRef();
    const [maxLen ,setMaxLen] = useState(12);
    // const firstDashAdded = useRef(false);
    // const secondDashAdded = useRef(false);
    // const actualValue = useRef("");
    // let isNum = useRef(false);

    const setInputVal = (e) => {
        let t = e.target.value.replace(/ /g, ""); 
        
        // let len = t.length, vLen = value.length;
        if(shouldAnimate!== (t.slice(0, -1) === value))
        setShouldAnimate(!shouldAnimate);

        if(t.length === 10 && !isNaN(t))
            setMaxLen(10);
        if(t!==value)
        setValue(t)
        
        // if(((len === 4 && !isNaN(t)) || (len ===8 && isNum.current))&& vLen<len){
        //     isNum.current = true
        //     if(len === 4)
        //     firstDashAdded = true
        //     else
        //     secondDashAdded = true
        //     setValue(t+'-')
        // }
        // else if((vLen > len) && isNum.current && (len === 4 || len === 8)){
        //     setValue(t.slice(0, -1))
        // }
        // isNum.current = !isNaN(t.replace(/-/g, ""))
        // if( !isNum.current && firstDashAdded || secondDashAdded ){
        //     //remove dashes
        // }
    }


    const scrollAnimInput = (left) => {
        animInputRef.current.scrollTo({ left , behavior: 'smooth'})
    }

    useEffect(() => {
        inputRef.current.addEventListener('scroll', () => {
            scrollAnimInput(inputRef.current.scrollLeft);
        })
    }, [])

    const verify=()=>{
        if(maxLen===10 || (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)))
        console.log("valid")
        else
        console.log(false);
    }

    return (
        <div className="f relPos emailInputCont">

            <div className="f absPos animInputCont" style={{ top: -1, width: WID}}>
                <div ref={animInputRef} style={{ overflowX: 'scroll', }} className="f noScrollBar">
                    {value.split('').map((value, index) => <AnimText key={index} item={value} shouldAnimate={shouldAnimate} />)}
                </div>
            </div>

            <input
                ref={inputRef}
                className="normalText creditoInput"
                maxLength={maxLen}
                value={value}
                style={{ zIndex: 3 , width: WID}}
                onChange={setInputVal}
                placeholder={PLACE_HOLDER_TEXT} />
                
            {/* <button onClick={verify} className="inputCTA stanBtn">Get link</button> */}
        </div>
    )
}

const AnimText = ({ item, shouldAnimate }) => {

    const animStyle =  useSpring({
        config: { mass: 1, tension: 180, friction: 12 },
        from: { opacity: 0, transform: 'scale(0)', y: -4 }, to: { opacity: 1, transform: 'scale(1)', y: 0 },
    }) 

    return (
        <a.pre className="normalText" style={{...animStyle}}>{item}</a.pre>
    )
}