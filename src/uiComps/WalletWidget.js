import Wallet from '../assets/icons/wallet.svg'
import BouncyComp from './BouncyComp';

import useUserData from '../hooks/useUserData';
import { nFormatter } from '../util';
import useBetterNavigation from '../hooks/useBetterNavigation';

export default function WalletWidget(){
const upruns = useUserData().userData.upruns;
const navigate = useBetterNavigation();

    return <BouncyComp
    onClick={()=>navigate('/main/wallet')}
    customChild={<div className="f ac walletWidget">
    <img
    style={{height: '1em'}}
    src={Wallet}
    />
    {nFormatter(upruns)}
</div>}
    />
}