import Wallet from '../assets/icons/wallet.svg'
import BouncyComp from './BouncyComp';
import { useNavigate } from 'react-router-dom';

export default function WalletWidget(){
const upruns = 500;
const navigate = useNavigate();

    return <BouncyComp
    onClick={()=>navigate('/main/wallet')}
    customChild={<div className="f ac walletWidget">
    <img
    style={{height: '1em'}}
    src={Wallet}
    />
    {upruns}
</div>}
    />
}