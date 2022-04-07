import { useOnce } from '@react-spring/shared';
import { a, useSpring, config } from '@react-spring/web';
import { forwardRef, useImperativeHandle, useRef, useState, } from 'react';
import BouncyComp from './BouncyComp';

const BottomSheet = forwardRef((_, ref) => {

    const [showSeet, setShowSheet] = useState(false);

    let [props, setProps] = useState({})
    const callbackOnHide = useRef(null);
    const sheetRef = useRef();
    const nullFun=()=>{}
    const setSheet = (val, values) => {
        if (val) {
            setProps({
                message: values?.message ?? 'warning ⚠',
                declineText: values?.declineText ?? 'No',
                acceptAction: values?.acceptAction ?? nullFun,
                acceptText: values?.acceptText ?? 'Yes',
                declineAction: values?.declineAction ?? nullFun,
                customChild: values?.customChild,
                disableActions: values?.disableActions ?? false,
                customConfig: values?.customConfig,
                onlyOneBtn: values?.onlyOneBtn ?? false,
                preventHiding: values?.preventHiding ?? false,
            })
            if(values?.callOnHide)
                callbackOnHide.current = (values.onHide)
            else 
                callbackOnHide.current = nullFun
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

    const hide = ()=>{
        callbackOnHide.current?.()
        setShowSheet(false)
    }


    if (!showSeet)
        return <></>
    else
        return <MainFunction hide={hide} ref={sheetRef} {...props} />

})



const MainFunction = forwardRef(({
    message,
    declineText,
    acceptText,
    declineAction,
    acceptAction,
    hide,
    customChild,
    disableActions,
    customConfig,
    onlyOneBtn,
    preventHiding
}, ref) => {

    const [isActive, setIsActive] = useState(true);
    const sheetRef = useRef();
    const contentContRef = useRef();
    const [blackLayer, setBlackLayer] = useSpring(() => ({
        opacity: 0
    }))

    const [sheet, setSheet] = useSpring(() => ({
        y: 0,
        config: config[customConfig || 'wobbly']
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
        if(isActive){
        declineAction();
        hideSheet();
    }}

    return <div ref={sheetRef} style={{ display: 'none', zIndex: 1001 }} className='fp fh fw'>
        <a.div onClick={declineFun} style={{ background: 'black', ...blackLayer }} className="fh fw" />
 {   !customChild?     <a.div style={{ ...sheet, ...cardCont}} className="ap whiteCard">
        <div style={{ ...cardStyle}} ref={contentContRef} className="f whiteCard fw fc">
            <h4 style={{textAlign: 'center', fontWeight: 'normal', whiteSpace: "pre-line"}}>{message}</h4>

            <div style={{gap: 'var(--baseVal4)', marginTop: '1em'}} className="f">
              { onlyOneBtn ? null : <BouncyComp
                onClick={declineFun}
                bounceLevel={isActive? .9 : 1}
                    styles={{...btnStyle}}
                    outlined
                    text={declineText}
                />
}
                <BouncyComp
                onClick={()=>{
                    if(isActive){
                    acceptAction();
                    if(disableActions)
                        setIsActive(false);
                    }
                    
                }}
                showLoading={!isActive}
                bounceLevel={isActive? .9 : 1}
                    styles={{...btnStyle, ...secondBtn,
                        background: isActive? 'var(--mainHighlight)' : 'var(--mainHighlight75)',
                        // marginLeft: onlyOneBtn? 'auto' : 0, marginRight: onlyOneBtn? 'auto' : 0
                        width: onlyOneBtn ? '100%' : 'calc( 50% - var(--baseVal2) )'
                    }}
                    outlined
                    text={acceptText}
                />
            </div>
        </div>
        </a.div>
:
        <a.div onClick={()=>{
            if(!preventHiding)
                declineFun()
        }} style={{...sheet, top: window.innerHeight}} ref={contentContRef} className="ap f fw fh fc">
            {customChild}
            </a.div>}
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
    transition: "none"
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
    color: 'white',
    border: 'none',
    transition: 'opacity .3s',
    overflow: 'hidden',
}

export default BottomSheet;