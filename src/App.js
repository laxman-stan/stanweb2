import logo from './logo.svg';

import Navbar from './comps/NavBar';

import PopUpComp from './comps/PopUpComp';

import ParallaxPreview from './comps/ParallexPreview';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';

export const ShowLogo = React.createContext();

function App() {

const [showPopUp, setShowPopUp] = useState(false);
const isMobileDevice=useRef();

const navRef=useRef();
const pRef=useRef();
const logoRef = useRef();


useEffect(()=>{
  let details = navigator.userAgent;
  let regexp = /android|iphone|kindle|ipad/i;
  let isMobile = regexp.test(details);
  isMobileDevice.current = isMobile
  if(window.innerWidth<620){
    let x = logoRef.current.style
    x.display="flex"
    x.opacity=1
  }
}, [])



const [showLogo, setShowLogo] = useState(true);
const logoFun={
  value : showLogo,
  set: val=>setShowLogo(val)
}

useEffect(()=>{
  logoRef.current.style.display = showLogo? 'flex' : 'none'
  setTimeout(() => {
    logoRef.current.style.opacity = showLogo? 1 : 0
  }, 200);
}, [showLogo])

const btnPress=(operation)=>{

  if(!isMobileDevice.current){
    setShowPopUp(operation);
  }
  else
    window.open("https://play.google.com/store/apps/details?id=com.sharecard.sharecard")
}

const scrollTo=(index)=>{
  pRef.current.moveTo(index)
}

const navMoveTo=(index)=>{
  navRef.current.onClick(index);
}

  return <ShowLogo.Provider value={logoFun}>

  <ParallaxPreview navMoveTo={navMoveTo} ref={pRef} open={()=>btnPress(true)}/>

  <Navbar scrollTo={scrollTo} ref={navRef} showPopUp={()=>btnPress(true)}/>
  <div ref={logoRef} style={{height: '4.5em', left: '2em', top: 0, display: 'none', opacity: 0, transition: 'all .3s'}} className='f ac fixPos'>
  <img className='fixPos f logo ac jc' src={logo}/>
  <p className='relPos' style={{left: 'clamp(50px, 3.8vw, 4vw)', fontSize: 18}}>Credito</p>
  </div>

 {showPopUp && <PopUpComp close={()=>btnPress(false)}/>}
  </ShowLogo.Provider>;
}

export default App;
