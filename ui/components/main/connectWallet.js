import { useEffect, useState } from 'react';
import UserContext from '../../lib/web3/userContext';

function ConnectWallet({bal, addr}) {
    const [balance, setBalance] = useState(bal);
    const [address, setAddress] = useState(addr);

    const connect = async () => {
        await UserContext.user.signin();
        setAddress(UserContext.user.address);
        setBalance(UserContext.user.balance);
        UserContext.setUser(UserContext.user);
    }
    
    useEffect(e=>{
        setBalance(bal);
        setAddress(addr);
    }, [bal, addr])

    return (
        <div>
            {!address && <button onClick={connect}>
                <a className="btn btn-info btn-sm rounded-btn">
                    Connect
                </a>
            </button>}

            {address && <div className="text-xs font-thin"><b>Wallet</b> - {address} <br/>
            <b>Balance</b>- {balance}
            </div>}
        </div>
    )
}

export default ConnectWallet;

