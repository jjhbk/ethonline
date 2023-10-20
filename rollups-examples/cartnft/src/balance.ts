import { Address } from "viem";
class Balance {
  private account: string;
  private ether: bigint;
  private _erc20: Map<Address, bigint>;
  private _erc721: Map<Address, Set<bigint>>;
  constructor(
    account: string,
    ether: bigint,
    erc20: Map<Address, bigint>,
    erc721: Map<Address, Set<bigint>>
  ) {
    (this.account = account), (this._erc20 = erc20), (this._erc721 = erc721);
    this.ether = ether;
  }
  ether_get(add: Address): bigint {
    return this.ether;
  }
  erc20_get(erc20: Address): bigint {
    return this._erc20.get(erc20);
  }
  erc721_get(erc721: Address): Set<bigint> {
    return this._erc721.get(erc721);
  }
  ether_increase(amount: bigint): void {
    if (amount < 0) {
      console.error(`failed to increase balance of ether for ${this.account}`);
      return;
    }
    this.ether = this.ether + amount;
  }
  ether_decrease(amount: bigint): void {
    if (amount < 0) {
      console.error(`failed to decrease balance of ether for ${this.account}`);
      return;
    }
    if (this.ether < amount) {
      console.error(`failed to decrease balancefor ${this.account}`);
      return;
    }
    this.ether = this.ether - amount;
  }
  erc20_increase(erc20: Address, amount: bigint): void {
    if (amount < 0) {
      console.error(
        `failed to increase balance of ${erc20} for ${this.account}`
      );
      return;
    }
    this._erc20.set(erc20, this._erc20.get(erc20) + amount);
  }
  erc20_decrease(erc20: Address, amount: bigint): void {
    if (amount < 0) {
      console.error(
        `failed to decrease balance of ${erc20} for ${this.account}`
      );
      return;
    }
    let erc20_balance = <bigint>this._erc20.get(erc20);
    if (erc20_balance < amount) {
      console.error(
        `failed to decrease balance of ${erc20} for ${this.account}`
      );
      return;
    }
    this._erc20.set(erc20, this._erc20.get(erc20) - amount);
  }
  erc721_add(erc721: Address, token_id: bigint) {
    let tokens = this._erc721.get(erc721);
    if (tokens) {
      tokens.add(token_id);
    } else {
      this._erc721.get(erc721).add(token_id);
    }
  }
  erc721_remove(erc721: Address, token_id: bigint) {
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

export { Balance };