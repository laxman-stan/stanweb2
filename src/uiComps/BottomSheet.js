import { useOnce } from '@react-spring/shared';
import { a, useSpring, config } from '@react-spring/web';
import { forwardRef, useImperativeHandle, useRef, useState, } from 'react';
import BouncyComp from './BouncyComp';

const BottomSheet = forwardRef((_, ref) => {

    const [showSeet, setShowSheet] = useState(false);

    let [props, setProps] = useState({})
    const sheetRef = useRef();
    const nullFun=()=>{}
    const setSheet = (val, message = "Alert ⚠", values) => {
        console.log('here', message)
        if (val) {
            setProps({
                message: message,
                declineText: values?.declineText ?? 'cancel',
                acceptAction: values?.acceptAction ?? nullFun,
                acceptText: values?.acceptText ?? 'accept',
                declineAction: values?.declineAction ?? nullFun
            })
            setShowSheet(true)
        }
        else{
            if(sheetRef.current?.isActive){
                sheetRef.current.hideSheet();
            }
            else {
                setShowSheet(false)
            }
        }
    }

    useImperativeHandle(ref, () => ({
        showSheet: setSheet
    }));


    if (!showSeet)
        return <></>
    else
        return <MainFunction hide={()=>setShowSheet(false)} ref={sheetRef} {...props} />

})



const MainFunction = forwardRef(({
    message,
    declineText,
    acceptText,
    declineAction,
    acceptAction,
    hide
}, ref) => {

    const sheetRef = useRef();
    const contentContRef = useRef();
    const [blackLayer, setBlackLayer] = useSpring(() => ({
        opacity: 0
    }))

    const [sheet, setSheet] = useSpring(() => ({
        y: 0,
        config: config.wobbly
    }))

    useOnce(() => {
        sheetRef.current.style.display = 'flex'
        setBlackLayer.start({ opacity: .6 })
        setSheet.start({ y: -contentContRef.current.offsetHeight })
    })

    const hideSheet=()=>{
        setBlackLayer.start({ opacity: 0, config: config.stiff })
        setSheet.start({ y: 0, config: config.stiff,
        onRest: hide })
    }

    useImperativeHandle(ref, ()=>({
        isActive: true,
        hideSheet
    }))

    const declineFun=()=>{
        console.log('called')
        declineAction();
        hideSheet();
    }

    return <div ref={sheetRef} style={{ display: 'none', zIndex: 21 }} className='fp fh fw'>
        <a.div onClick={declineFun} style={{ background: 'black', ...blackLayer }} className="fh fw" />
        <a.div style={{ ...sheet, ...cardCont}} className="ap whiteCard">
        <div style={{ ...cardStyle}} ref={contentContRef} className="f whiteCard fw fc">
            <h4 style={{textAlign: 'center', fontWeight: 'normal'}}>{message}</h4>

            <div style={{gap: 'var(--baseVal4)', marginTop: '1em'}} className="f">
                <BouncyComp
                onClick={declineFun}
                bounceLevel={.9}
                    styles={btnStyle}
                    outlined
                    text={declineText}
                />

                <BouncyComp
                onClick={acceptAction}
                bounceLevel={.9}
                    styles={{...btnStyle, ...secondBtn}}
                    outlined
                    text={acceptText}
                />
            </div>
        </div>
        </a.div>
    </div>
})


const cardStyle={
    margin: 0,
    padding: 'var(--baseVal6)',
    paddingTop: 'var(--baseVal4)',
    borrderRadius: 'var(--baseVal4)',
    boxShadow: 'none'
}
const cardCont={
    borrderRadius: 'var(--baseVal4)',
    top: window.innerHeight,
    margin: 0,
    padding: 0,
    borrderRadius: 'var(--baseVal4)',
    paddingBottom: 100,
}

const btnStyle={
    display: 'flex',
    width: 'calc( 50% - var(--baseVal2) )',
    justifyContent: 'center',
    paddingTop: 'var(--baseVal3)',
    paddingBottom: 'var(--baseVal3)',
    borderRadius: 'var(--baseVal)'
}

const secondBtn={
    background: 'var(--mainHighlight)',
    color: 'white',
    border: 'none'
}

export default BottomSheet;
