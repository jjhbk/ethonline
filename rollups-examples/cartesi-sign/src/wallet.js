const { Voucher, Notice, Error, Log } = require("./outputs");
const { hexToBytes } = require("./utils");
const { Balance } = require("./balance");
const { erc20ABI, erc721ABI, CartesiDappABI } = require("./rollups");
const ethers = require("ethers");
const { encodeFunctionData, getAddress } = require("viem");

class Wallet {
  constructor(accounts) {
    this.accounts = accounts;
  }
  _balance_get = (_account) => {
    let balance = accounts.get(_account);
    if (!balance) {
      accounts[_account] = new Balance(_account, new Map(), new Map());
      balance = accounts[_account];
    }
    return balance;
  };

  balance_get = (_account) => {
    //Retrieve balance of all ERC20 and ERC721 tokens for account
    console.info(`Balance for ${_account} retrieved`);
    return _balance_get(_account);
  };

  erc20_deposit_process = (_payload) => {
    //process the abi-encoded input data sent by the erc20 portal after and erc20 deposit
    try {
      let { account, erc20, amount } = _erc20_deposit_parse(_payload);
      console.info(`${amount} ${erc20} tokens deposited to account ${account}`);
      return _erc20_deposit(account, erc20, amount);
    } catch (e) {
      return Error(e);
    }
  };

  erc721_deposit_process = (_payload) => {
    try {
      let { account, erc721, token_id } = _erc721_deposit_parse(_payload);
      console.info(
        `Token ERC-721 ${erc721} id: ${token_id} deposited in ${account}`
      );
      return _erc721_deposit(account, erc721, token_id);
    } catch (e) {
      return Error(e);
    }
  };

  _erc20_deposit_parse = (_payload) => {
    try {
      let input_data = viem.decodeAbiParameters(
        ["bool", "address", "address", "uint256"],
        _payload
      );
      if (!input_data[0]) {
        return Error("invalid deposit with false success flag");
      }
      return {
        account: input_data[1],
        erc20: input_data[2],
        amount: input_data[3],
      };
    } catch (e) {
      return Error(e);
    }
  };

  _erc721_deposit_parse = (_payload) => {
    try {
      let input_data = viem.decodeAbiParameters(
        ["address", "address", "uint256"],
        _payload
      );
      return {
        account: input_data[0],
        erc721: input_data[1],
        token_id: input_data[2],
      };
    } catch (e) {
      return Error(e);
    }
  };

  _erc20_deposit = (account, erc20, amount) => {
    let balance = _balance_get(account);
    balance.erc20_increase(erc20, amount);
    let notice_payload = {
      type: "erc20deposit",
      content: {
        address: account,
        erc20: erc20,
        amount: amount,
      },
    };
    return Notice(JSON.stringify(notice_payload));
  };

  _erc721_deposit = (account, erc721, token_id) => {
    let balance = _balance_get(account);
    balance.erc721_add(erc721);
    let notice_payload = {
      type: "erc721deposit",
      content: {
        address: account,
        erc721: erc721,
        token_id: token_id,
      },
    };

    return Notice(JSON.stringify(notice_payload));
  };

  erc20_withdraw = (account, erc20, amount) => {
    let balance = _balance_get(account);
    balance._erc20_decrease(erc20, amount);
    const call = encodeFunctionData({
      abi: erc20ABI,
      functionName: "transfer",
      args: [getAddress(account), amount],
    });
    console.info(`${amount} ${erc20} tokens withdrawn form ${account}`);
    return Voucher(erc20, call);
  };

  erc20_transfer = (account, to, erc20, amount) => {
    try {
      let balance = _balance_get(account);
      let balance_to = balance_get(to);
      balance.erc20_decrease(erc20, amount);
      balance_to.erc20_increase(erc20, amount);
      let notice_payload = {
        type: "erc20transfer",
        content: {
          from: account,
          to: to,
          erc20: erc20,
          amount: amount,
        },
      };
      console.info(
        `${amount}${erc20} tokens transferred from ${account} to ${to}`
      );
      return Notice(JSON.stringify(notice_payload));
    } catch (e) {
      return Error(e);
    }
  };

  erc721_withdraw = (rollup_address, sender, erc721, token_id) => {
    try {
      let balance = _balance_get(sender);
      balance.erc721_remove(erc721, token_id);
    } catch (e) {
      return Error(e);
    }
    let payload = encodeFunctionData({
      abi: erc721ABI,
      functionName: "safeTransferFrom",
      args: [getAddress(rollup_address), sender, token_id],
    });
    console.info(
      `Token ERC-721:${erc721} ,id:${token_id} withdrawn from ${sender}`
    );
    return Voucher(erc721, payload);
  };

  erc721_transfer = (account, to, erc721, token_id) => {
    try {
      let balance = _balance_get(account);
      let balance_to = _balance_get(to);
      balance.erc721_remove(erc721, token_id);
      balance_to.erc721_add(erc721, token_id);
      let notice_payload = {
        type: "erc721transfer",
        content: {
          from: account,
          to: to,
          erc721: erc721,
          token_id: token_id,
        },
      };
      console.info(
        `Token ERC-721 ${erc721} id:${token_id} transferred from ${account} to ${to}`
      );
      return Notice(JSON.stringify(notice_payload));
    } catch (e) {
      return Error(e);
    }
  };
}

module.exports = {
  Wallet,
};
