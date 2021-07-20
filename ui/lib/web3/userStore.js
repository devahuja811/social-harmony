import hmy from './hmy';
import {
    hexToNumber,
    fromWei,
    Units
  } from '@harmony-js/utils';
class userStore {

    constructor() {
        this.isOneWallet = window?.onewallet && window.onewallet.isOneWallet;
        this.onewallet = window?.onewallet;
    }

    async signin() {
        const getAccount = await this.onewallet.getAccount();
        console.log(getAccount)

        this.address = getAccount.address;
        this.isAuthorized = true;

        const response = await hmy.blockchain
            .getBalance({ address: this.address })

        this.balance = Math.round(100 * fromWei(hexToNumber(response.result), Units.one))/100;
        console.log(this.balance, this.address);
    }

}

export default userStore