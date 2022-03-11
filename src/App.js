
import './App.css';
import { useEffect, useRef, createContext, useState } from 'react'
import UpperNotification from './uiComps/UpperNotification';
import MainScreen from './screens/MainScreen';
import RankScreen from './screens/RankScreen';
import WalletScreen from './screens/WalletScreen';
import { PlayScreen } from './screens/MainScreen';
import TradeScreen from './screens/TradeScreen';
import { BottomSheet } from './uiComps';
import {
  // BrowserRouter as Router,
  Routes,
  Route,
  // Link
} from "react-router-dom";

import LoginScreen from './screens/LoginScreen';


export const NotificationContext = createContext();
export const BottomSheetContext = createContext();

function App() {


  const appRef = useRef();
  const notificationRef = useRef();
  const bottomSheetRef = useRef();
  const showNotification = (message = 'nothing') => {
    notificationRef.current.showNotification(message);
  }
  const showBottomSheet=(show, message=null, values=null)=>{
    bottomSheetRef.current.showSheet(show, message, values)
  }


  
  useEffect(() => {
    appRef.current.style.height = window.innerHeight + 'px';

    // setTimeout(() => {
    //  bottomSheetRef.current.showSheet(true)
    // }, 3000);
  }, [])

  return (<NotificationContext.Provider value={showNotification}>
    <BottomSheetContext.Provider value={showBottomSheet}>
    <div ref={appRef} className="app f fc">

      <BottomSheet ref={bottomSheetRef}/>
      <UpperNotification ref={notificationRef} />
      <Routes>

        <Route path="/" element={<LoginScreen/>}/>
        <Route path="/main" element={<MainScreen/>}>
          <Route path="/main" element={<PlayScreen/>} />
          <Route path="/main/rank" element={<RankScreen/>}/>
          <Route path="/main/wallet" element={<WalletScreen/>}/>
          <Route path="/main/trade" element={<TradeScreen/>}/>

        </Route>


      </Routes>
    </div>
    </BottomSheetContext.Provider>
  </NotificationContext.Provider>
  );
}

export default App;
