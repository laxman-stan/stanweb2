
import './App.css';
import { useEffect, useRef, createContext, useState } from 'react'
import UpperNotification from './uiComps/UpperNotification';
import MainScreen from './screens/MainScreen';
import RankScreen from './screens/RankScreen';
import WalletScreen from './screens/WalletScreen';
import { PlayScreen } from './screens/MainScreen';
import TradeScreen from './screens/TradeScreen';
import { BottomSheet } from './uiComps';
import { HistoryScreen, Wallet, CreateTeam, AppGuide, OtpScreen, PhoneNoScreen, HelpScreen, GetUserName, NoMatch } from './screens';
import {
  // BrowserRouter as Router,
  Routes,
  Route,
  // Link
} from "react-router-dom";


import LoginScreen from './screens/LoginScreen';
import { QueryClient, QueryClientProvider} from 'react-query'
 
const queryClient = new QueryClient()

export const NotificationContext = createContext();
export const BottomSheetContext = createContext();
export const UserDataContext = createContext();

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

const [userData, setUserData] = useState({
  allPlayers: null,
  myPlayers: null,
  upruns: null,
  teamCreated: false,
  userFromLogin : null,
  name: null,
  gain: null,
  todaysMatch: [],
  teams: [],
})
const userDataContext={
  userData,
  setData: val=>setUserData(val)
}

const setHeight=()=>{
  if(appRef.current){
  if(window.innerHeight > appRef.current.offsetHeight)
  appRef.current.style.height = window.innerHeight + 'px';
}}
  
  useEffect(() => {
      appRef.current.style.height = window.innerHeight + 'px';
      setTimeout(() => {
        setHeight();
      }, 1000);
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <UserDataContext.Provider value={userDataContext}>
  <NotificationContext.Provider value={showNotification}>
    <BottomSheetContext.Provider value={showBottomSheet}>
    <div className='supercont f jc'>
    <div ref={appRef} style={{height: '100dvh'}} className="app f fc">
      <BottomSheet ref={bottomSheetRef}/>
      <UpperNotification ref={notificationRef} />
      <Routes>
        <Route path="*" element={<NoMatch/>}/>
        <Route path="/" element={<LoginScreen/>}/>
        <Route path="/auth" element={<LoginScreen/>}/>
        <Route path="/phone-no" element={<PhoneNoScreen/>}/>
        <Route path="/OTP" element={<OtpScreen/>}/>
        <Route path="/user-info" element={<GetUserName/>}/>
        <Route path="/app-guide" element={<AppGuide/>}/>
        <Route path="/main" element={<MainScreen setHeight={setHeight}/>}>

          <Route path="/main" element={<PlayScreen/>} />
          <Route path="/main/create-team" element={<CreateTeam/>} />
          <Route path="/main/rank" element={<RankScreen/>}/>
          <Route path="/main/help" element={<HelpScreen/>}/>
          <Route path="/main/wallet" element={<WalletScreen/>}>
            <Route path="/main/wallet" element={<Wallet/>}/>
            <Route path="/main/wallet/history" element={<HistoryScreen/>}/>
          </Route>
          <Route path="/main/trade" element={<TradeScreen/>}/>
          

        </Route>

      </Routes>
    </div>
    </div>
   
    </BottomSheetContext.Provider>
  </NotificationContext.Provider>
  </UserDataContext.Provider>
  </QueryClientProvider>
  );
}

export default App;
