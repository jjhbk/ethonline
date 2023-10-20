const { hexToString, getAddress } = require("viem");
import { Error_out, Log, Output, Report } from "./outputs";
import { Wallet } from "./wallet";

class DefaultRoute {
  public execute = (request: any): Output => {
    return new Error_out("Operation not implemented");
  };
}

class AdvanceRoute extends DefaultRoute {
  msg_sender: string;
  msg_timestamp: Date;
  request_args: any;
  public parse_request = (request: any) => {
    this.msg_sender = request["metadata"]["msg_sender"];
    this.msg_timestamp = new Date(request["metadata"]["timestamp"]);
    const request_payload = JSON.parse(hexToString(request["payload"]));
    this.request_args = request_payload["args"];
  };
  public execute = (request: any): Output => {
    if (request) {
      this.parse_request(request);
    }
    return new Log("parsing advance state request");
  };
}

class WalletRoute extends AdvanceRoute {
  wallet: Wallet;
  constructor(wallet: Wallet) {
    super();
    this.wallet = wallet;
  }
}

class DepositERC20Route extends WalletRoute {
  execute = (request: any) => {
    return this.wallet.erc20_deposit_process(request);
  };
}

class DepositERC721Route extends WalletRoute {
  execute = (request: any) => {
    return this.wallet.erc721_deposit_process(request);
  };
}

class BalanceRoute extends WalletRoute {
  public execute = (request: any) => {
    console.log("request is ", request);
    const accbalance = this.wallet.balance_get(getAddress(request));
    return new Report(JSON.stringify(accbalance));
  };
}
/* JSON.stringify(accbalance, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )*/

class WithdrawERC20Route extends WalletRoute {
  public execute = (request: any): Output => {
    this.parse_request(request);
    return this.wallet.erc20_withdraw(
      getAddress(this.msg_sender),
      this.request_args.get("erc20").toLowerCase(),
      this.request_args.get("amount")
    );
  };
}

class TransferERC20Route extends WalletRoute {
  public execute = (request: any): Output => {
    this.parse_request(request);
    return this.wallet.erc20_transfer(
      getAddress(this.msg_sender),
      this.request_args.get("to").toLowerCase(),
      this.request_args.get("erc20").toLowerCase(),
      this.request_args.get("amount")
    );
  };
}

class WithdrawERC721Route extends WalletRoute {
  rollup_address: any;
  constructor(wallet: Wallet) {
    super(wallet);
    this.rollup_address = null;
  }
  public get_rollup_address = () => {
    return this.rollup_address;
  };
  public set_rollup_address = (value: string) => {
    this.rollup_address = value;
  };
  public execute = (request: any) => {
    this.parse_request(request);
    if (!this.rollup_address) {
      return new Error_out("DApp address is needed to withdraw the assett");
    }
    return this.wallet.erc721_withdraw(
      this.rollup_address,
      getAddress(this.msg_sender),
      this.request_args.get("erc721").toLowerCase(),
      this.request_args.get("token_id")
    );
  };
}

class TransferERC721Route extends WalletRoute {
  public execute = (request: any) => {
    this.parse_request(request);
    return this.wallet.erc721_transfer(
      getAddress(this.msg_sender),
      this.request_args.get("to").toLowerCase(),
      this.request_args.get("erc721").toLowerCase(),
      this.request_args.get("token_id")
    );
  };
}

class Router {
  controllers: Map<string, DefaultRoute>;
  constructor(wallet: Wallet) {
    this.controllers = new Map();
    this.controllers.set("erc20_deposit", new DepositERC20Route(wallet));
    this.controllers.set("erc721_deposit", new DepositERC721Route(wallet));
    this.controllers.set("balance", new BalanceRoute(wallet));
    this.controllers.set("erc20_withdraw", new WithdrawERC20Route(wallet));
    this.controllers.set("erc20_transfer", new TransferERC20Route(wallet));
    this.controllers.set("erc721_withdraw", new WithdrawERC721Route(wallet));
    this.controllers.set("erc721_transfer", new TransferERC721Route(wallet));
  }
  set_rollup_address(rollup_address: string) {
    const controller = <WithdrawERC721Route>(
      this.controllers.get("erc721_withdraw")
    );
    controller.set_rollup_address(rollup_address);
  }
  process(route: string, request: any) {
    route = route.toLowerCase();
    const controller = this.controllers.get(route);
    if (!controller) {
      return new Error_out(`operation ${route} is not supported`);
    }
    console.info(`executing operation ${route}`);
    return controller.execute(request);
  }
}
export { Router };
