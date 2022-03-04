
import './App.css';
import {useEffect, useRef} from 'react'
import BottomNav from './uiComps/BottomNav';
import UpperNav from './uiComps/UpperNav';
import UpperNotification from './uiComps/UpperNotification';

function App() {

  const appRef = useRef();
  useEffect(()=>{
    appRef.current.style.height = window.innerHeight + 'px';
  }, [])

  return (
    <div ref={appRef} className="app f fc">
      {/* <UpperNav/>
      <BottomNav/> */}
      <UpperNotification/>
    </div>
  );
}

export default App;
