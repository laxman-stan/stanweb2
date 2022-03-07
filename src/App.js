
import './App.css';
import { useEffect, useRef, createContext } from 'react'
import UpperNotification from './uiComps/UpperNotification';
import MainScreen from './screens/MainScreen';
import {
  // BrowserRouter as Router,
  Routes,
  Route,
  // Link
} from "react-router-dom";

import LoginScreen from './screens/LoginScreen';


export const NotificationContext = createContext();

function App() {


  const appRef = useRef();
  const notificationRef = useRef();
  const showNotification = (message = 'nothing') => {
    notificationRef.current.showNotification(message);

  }

  useEffect(() => {
    appRef.current.style.height = window.innerHeight + 'px';
  }, [])

  return (<NotificationContext.Provider value={showNotification}>
    <div ref={appRef} className="app f fc">
      <UpperNotification ref={notificationRef} />
      <Routes>

        <Route path="/" element={<LoginScreen/>}/>
        <Route path="/main" element={<MainScreen/>}/>

          {/* <Route path="/main">
          <MainScreen/>
          </Route> */}

      </Routes>
    </div>
  </NotificationContext.Provider>
  );
}

export default App;
