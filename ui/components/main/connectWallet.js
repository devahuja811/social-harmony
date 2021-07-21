import { useEffect, useState } from 'react';
import useStickyState from '../../lib/useStickyState';
import UserContext from '../../lib/web3/userContext';

function ConnectWallet({ bal, addr }) {
    const [balance, setBalance] = useState(bal);
    const [address, setAddress] = useState(addr);

    const [user, setUser] = useStickyState({}, "user");

    const connect = async () => {
        await UserContext.user.signin();
        setAddress(UserContext.user.address);
        setBalance(UserContext.user.balance);
        setUser(UserContext.user.account);
        UserContext.setUser(UserContext.user);
    }

    const clear = async () => {
        await UserContext.user.signout();
        setUser({});
        setAddress(null);
        setBalance(0);
        UserContext.setUser({});
    }

    useEffect(e => {
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

            {address && <div className="text-xs font-thin">
                <b>Wallet</b>: {address} <br />
                <b>Balance</b>: {balance} <br/>
                <button onClick={async e => clear()}>
                    Logout
                </button>
                
            </div>}
        </div>
    )
}

export default ConnectWallet;

