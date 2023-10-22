import { hexToString, getAddress } from "viem";
import { Error_out, Log, Notice, Output, Report } from "./outputs";
import { Wallet } from "./wallet";
import { Auctioneer } from "./auction";

class DefaultRoute {
  public execute = (request: any): Output | Set<Output> => {
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
  public execute = (request: any): Output | Set<Output> => {
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

class DepositEther extends WalletRoute {
  public execute = (request: any) => {
    return this.wallet.ether_deposit_process(request);
  };
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
    return new Report(
      JSON.stringify(accbalance, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    );
  };
}

class WithdrawEther extends WalletRoute {
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

  public execute = (request: any): Output => {
    this.parse_request(request);
    if (!this.rollup_address) {
      return new Error_out("DApp address is needed to withdraw the assett");
    }
    return this.wallet.ether_withdraw(
      getAddress(this.rollup_address),
      getAddress(this.msg_sender),
      this.request_args.get("amount")
    );
  };
}

class TransferEther extends WalletRoute {
  public execute = (request: any) => {
    this.parse_request(request);
    return this.wallet.ether_transfer(
      getAddress(this.msg_sender),
      this.request_args.get("to").toLowerCase(),
      this.request_args.get("amount")
    );
  };
}

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
      getAddress(this.rollup_address),
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

class AuctioneerRoute extends AdvanceRoute {
  auctioneer: Auctioneer;
  constructor(auctioneer: Auctioneer) {
    super();
    this.auctioneer = auctioneer;
  }
}
class CreateAuctionRoute extends AuctioneerRoute {
  _parse_request(request: any) {
    this.parse_request(request);
    this.request_args["erc20"] = this.request_args["erc20"].toLowerCase();
    const erc721 = this.request_args["item"]["erc721"].toLowerCase();
    this.request_args["start_date"] = new Date(this.request_args["start_date"]);
    this.request_args["end_date"] = new Date(this.request_args["end_date"]);
  }
  public execute = (request: any) => {
    this._parse_request(request);
    return this.auctioneer.auction_create(
      this.msg_sender,
      this.request_args.get("item"),
      this.request_args.get("erc20"),
      this.request_args.get("title"),
      this.request_args.get("description"),
      this.request_args.get("min_bid_amount"),
      this.request_args.get("start_date"),
      this.request_args.get("end_date"),
      this.msg_timestamp
    );
  };
}

class EndAuctionRoute extends AuctioneerRoute {
  rollup_address: string;
  constructor(auctioneer: Auctioneer) {
    super(auctioneer);
    this.rollup_address = null;
  }
  getRollup_address() {
    this.rollup_address;
  }
  setRollup_address(value: string) {
    this.rollup_address = value;
  }
  public execute = (request: any) => {
    this.parse_request(request);
    if (this.rollup_address === null) {
      return new Error_out(
        "DApp address is needed to end an Auction Check Dapp documentation on how to proper set the Dapp address"
      );
    }
    return this.auctioneer.auction_end(
      this.request_args.get("auction_id"),
      this.rollup_address,
      this.msg_timestamp,
      this.msg_sender,
      this.request_args.get("withdraw", false)
    );
  };
}

class PlaceBidRoute extends AuctioneerRoute {
  public execute = (request: any) => {
    this.parse_request(request);
    return this.auctioneer.auction_bid(
      this.msg_sender,
      this.request_args.get("auction_id"),
      this.request_args.get("amount"),
      this.msg_timestamp
    );
  };
}

class InspectRoute extends DefaultRoute {
  auctioneer: Auctioneer;
  constructor(auctioneer: Auctioneer) {
    super();
    this.auctioneer = auctioneer;
  }
}

class QueryAuctionRoute extends InspectRoute {
  public execute = (request: any) => {
    const req = String(request).split("/");
    return this.auctioneer.auction_get(parseInt(req[1]));
  };
}

class ListAuctionsRoute extends InspectRoute {
  public execute = (request: any) => {
    return new Notice(JSON.stringify(this.auctioneer.auctions));
  };
}

class ListBidsRoute extends InspectRoute {
  public execute = (request: any) => {
    const url = String(request).split("/");
    return this.auctioneer.auction_list_bids(parseInt(url[1]));
  };
}
class Router {
  controllers: Map<string, DefaultRoute>;
  constructor(auctioneer: Auctioneer, wallet: Wallet) {
    this.controllers = new Map();
    this.controllers.set("ether_deposit", new DepositEther(wallet));
    this.controllers.set("erc20_deposit", new DepositERC20Route(wallet));
    this.controllers.set("erc721_deposit", new DepositERC721Route(wallet));
    this.controllers.set("balance", new BalanceRoute(wallet));
    this.controllers.set("ether_withdraw", new WithdrawEther(wallet));
    this.controllers.set("ether_transfer", new TransferEther(wallet));
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
