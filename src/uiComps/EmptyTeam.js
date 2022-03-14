
import { Player } from "../assets"
import BouncyComp from "./BouncyComp"
import { useNavigate } from "react-router-dom";

export default function({len, createTeam}){
    console.log('fo', len, createTeam)
    const navigate = useNavigate();
    return <div style={{
        alignSelf: 'center', bottom: 0,
        background: 'var(--mainBg)',
        marginTop: len? 'auto' : 0
        }} className={`f ac sb fc ${len? 'null' : 'fh'}`}>

{/* <div
    style={{
        backgroundColor: 'black', height: '8em', bottom: '-24px'
    }}
    className="ap fw"
    /> */}
    {
        len? 
        <p style={{color: 'var(--mainHighlight50)', marginTop: 'auto', marginBottom: 'var(--baseVal3)'}}>{len>4 && createTeam ? "You havent' created your team for todaty." : "You need 5 player to create a team."}</p>
        : <>
        <img
        style={{
            width: '30%',
            marginBottom: '.5em',
            marginTop: 'auto'
        }}
     src={Player}/>
    <p style={{color: 'var(--mainHighlight50)'}}>You haven't bought and player yet.</p></>
    }
    
    <BouncyComp
    onClick={()=>navigate(len>4 && createTeam ? '/main/create-team' : '/main/trade')}
    bounceLevel={.9}
    styles={{ marginBottom: '.5em', marginTop: 'auto', marginLeft: 0, marginRight: 0, width: 'calc(100vw - var(--baseVal6))', flex: 'none' }}
    customClasses='cta'
    text={len>4 && createTeam? 'Create Team' : 'Buy Player'}
    />

    </div>
}

