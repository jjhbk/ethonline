class Balance {
  constructor(account, erc20, erc721) {
    (this.account = account), (this._erc20 = erc20), (this._erc721 = erc721);
  }
  erc20_get(erc20) {
    return this._erc20.get(erc20);
  }
  erc721_get(erc721) {
    return this._erc721.get(erc721);
  }
  erc20_increase(erc20, amount) {
    if (amount < 0) {
      console.error(
        `failed to increase balance of ${erc20} for ${this.account}`
      );
      return;
    }
    this._erc20[erc20] = this._erc20.get(erc20) + amount;
  }
  erc20_decrease(erc20, amount) {
    if (amount < 0) {
      console.error(
        `failed to decrease balance of ${erc20} for ${this.account}`
      );
      return;
    }
    let erc20_balance = this._erc20.get(erc20);
    if (erc20_balance < amount) {
      console.error(
        `failed to decrease balance of ${erc20} for ${this.account}`
      );
      return;
    }
    this._erc20[erc20] = this._erc20.get(erc20) + amount;
  }
  erc721_add(erc721, token_id) {
    let tokens = this._erc721.get(erc721);
    if (tokens) {
      tokens.add(token_id);
    } else {
      this._erc721[erc721] = { token_id };
    }
  }
  erc721_remove(erc721, token_id) {
    let tokens = this._erc721.get(erc721);
    try {
      tokens?.delete(token_id);
    } catch (e) {
      console.error(
        `failsed to remove token ${erc721}, id:${token_id} from ${this.account}`
      );
    }
  }
}

module.exports = { Balance };
