import { popUpStrings } from "../data/Strings";
import AnimInput from "./AnimInput";
import arrowIcon from '../icons/arrowRight.svg'
import playStore from '../icons/playStore.svg'
import appStore from '../icons/appStore.svg'
import qr from '../icons/qrCode.svg'
import crossIcon from '../icons/crossIcon.svg'
import {a, useSpring, config} from 'react-spring';
import { useEffect } from "react";

export default function PopUpComp({close}) {
  const { qrCodeText } = popUpStrings;
    const [style, setStyle] = useSpring(()=>({
      scale: 0,
      opacity: 0,
      config: config.wobbly
    }))
  useEffect(()=>{
    console.log('acalfjal')
    setStyle.start({
      opacity: 1,
      scale: 1
    })
  }, [])
  return (
    <div onClick={close} style={{zIndex: 1000}} className="jc fixPos allPopUpBg f">
    <a.div onClick={e=>e.stopPropagation()} style={style} className="f popUpCont ac jc absPos">
      <div style={{gap: '1em'}} className="f fc">

      <div style={{gap: '1em',width: '15em'}} className="f fc">
      <p className="grey" dangerouslySetInnerHTML={qrCodeText}/>

          <img style={{width: '15em'}} src={qr}/>
      </div>

        {/* <h2 dangerouslySetInnerHTML={mainString} /> */}
        {/* <div className="f phoneNoCont ac jc">
          <AnimInput placeholder={placeHolderNo} />
          <div className="f arrowIcon jc ac">
            <img style={{height: "1em"}} src={arrowIcon} />
          </div>
        </div> */}
        <div style={{marginTop: '1em'}} className="f storeIcons ac">
            <img onClick={ ()=>window.open("https://play.google.com/store/apps/details?id=com.sharecard.sharecard")
            } style={{width: '1.25em', cursor: 'pointer'}} src={playStore}/>
            {/* <img style={{width: '1.25em', cursor: 'pointer'}} src={appStore}/> */}
        </div>
      </div>


      <img onClick={close} src={crossIcon} className='f ac jc crossIcon absPos' />
    </a.div>
    </div>
  );
}
