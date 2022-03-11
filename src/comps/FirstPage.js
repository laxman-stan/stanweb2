import { useEffect, useRef, useState, useContext } from 'react'
import { firstPgStrings } from "../data/Strings"
import appStore from '../appStorePlayStoreStickers/appStoreS.svg'
import playStore from '../appStorePlayStoreStickers/playStoreS.svg'
import qrCodeIcon from '../icons/qrCodeIcon.svg'
import Lottie from 'react-lottie';
import contactLottie from '../lotties/contacts.json'
import rupee from '../lotties/rupee.json'
import wallet from '../lotties/wallet.json'
import { a, config, useSprings } from 'react-spring'
import logo from '../logo.svg';
import { ShowLogo } from '../App'


const FirstPage = ({ open, navMove }) => {
    const { introPage } = firstPgStrings;
    const headerRef = useRef();
    const stickerRef = useRef();
    const subHeadingRef = useRef();
    const appStoreRef = useRef();
    const playStoreRef = useRef();
    const qrRef = useRef();
    const pgRf = useRef();

    const logoFun = useContext(ShowLogo);
    const showLogo=logoFun.set

    function getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }

        return "unknown";
    }



    useEffect(() => {
        let os = getMobileOperatingSystem();

        appStoreRef.current.style.display = "none"
            // qrRef.current.style.display = "none"
        if (os === 'Android' ||os === 'iOS') {
            // appStoreRef.current.style.display = "none"
            qrRef.current.style.display = "none"
        }
        // if (os === 'iOS') {
        //     playStoreRef.current.style.display = "none"
        //     qrRef.current.style.display = "none"
        // }


        headerRef.current?.classList.add('firstPgHeadingFinal');
        setTimeout(() => {
            headerRef.current?.classList.add('firstPgHeadingFulOpacity')
        }, 800);
        setTimeout(() => {
            subHeadingRef.current?.classList.add('firstPgHeadingFulOpacity')
            stickerRef.current?.classList.add('fullOpacity')
        }, 1000);
    }, [])

    const lotties = [wallet, rupee, contactLottie]
    const lottieTims = [ 2.23*1000 + 150, 2.03*2000+150 ,5000 + 150]

    const [currentLottie, setCL] = useState(0)

    const defaultOptions = {
        loop: true,
        autoplay: true,
    }

    const lottieAnimation = useSprings(3, lotties.map((j, i)=> ({
        opacity: i === currentLottie ? 1 : 0,
        config: config.slow
    })))
    let time = useRef();


//    const isBLA = useOnScreen(logoRef)

//    useEffect(()=>{
//         if(window.innerWidth>620)
//             showLogo(!isBLA)
//    }, [isBLA])

    useEffect(() => {

        time.current =setTimeout(() => {
            setCL(i=>(i+1)%3)
        }, lottieTims[currentLottie]);

        return ()=>clearInterval(time.current)
    }, [currentLottie])

    return <div ref={pgRf} className="f fullPg ac jc fc">
        <div className='f ac fpc'>
            <div className='f fc firstPgLeft'>


                <h1 ref={headerRef} className='firstPgHeading' dangerouslySetInnerHTML={introPage.heading} />
                <h3 className='firstPgSubheading' ref={subHeadingRef} dangerouslySetInnerHTML={introPage.subHeading} />

                <div ref={stickerRef} style={{ gap: '1em', }} className='f ac storeStickerCont '>
            <img ref={appStoreRef} className='stickerImage' src={appStore} />
            <img onClick={ ()=>window.open("https://play.google.com/store/apps/details?id=com.sharecard.sharecard")
            } ref={playStoreRef} className='stickerImage' src={playStore} />
            <img ref={qrRef} onClick={open} className='stickerImage' style={{ height: '2.5em', marginLeft: '1em' }} src={qrCodeIcon} />
        </div>
            </div>

            <div className='f firstPgRight'>
                {
                    lottieAnimation.map(({ opacity }, index) => <a.div key={index} className=" f" style={{
                         opacity, 
                         width: 'calc(100%-2em)',
                         height: '100%',
                         position: 'absolute',
                         transform: `translateY(${index===0? `-10%` : 0}) translateX(${index===2? '-5%' : 0})`
                        }}
                    >
                        <Lottie
                            width={index===2? '60%': '100%'}
                            isStopped={currentLottie!==index}
                            options={{
                                ...defaultOptions,
                                animationData: lotties[index]
                            }}
                        />
                    </a.div>)
                }

            </div>

        </div>


    </div>
}

function useOnScreen(ref, rootMargin = "0px") {
    // State and setter for storing whether element is visible
    const [isIntersecting, setIntersecting] = useState(false);
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Update our state when observer callback fires
          setIntersecting(entry.isIntersecting);
        },
        {
          rootMargin,
        }
      );
      if (ref.current) {
        observer.observe(ref.current);
      }
      return () => {
        observer.unobserve(ref.current);
      };
    }, []); // Empty array ensures that effect is only run on mount and unmount
    return isIntersecting;
  }

export default FirstPage
