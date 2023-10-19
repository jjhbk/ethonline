const { hexToString } = require("viem");
const { Error } = require("./outputs");
const { Wallet } = require("./wallet");
const {
  Key,
  match,
  MatchResult,
  MatchFunction,
  Path,
} = require("path-to-regexp");
class DefaultRoute {
  execute(match_result, request) {
    return Error(e);
  }
}

class AdvanceRoute extends DefaultRoute {
  _parse_request(request) {
    this._msg_sender = request["metadata"]["msg_sender"];
    this._msg_timestamp = new Date.toString(request["metadata"]["timestamp"]);
    let request_payload = JSON.parse(hexToString(request["payload"]));
    this._request_args = request_payload["args"];
  }
  execute(match_result, request) {
    if (request) {
      this._parse_request;
    }
  }
}

class WalletRoute extends AdvanceRoute {
  constructor(wallet) {
    this._wallet = wallet;
  }
}

class DepositERC20Route extends WalletRoute {
  execute(match_result, request) {
    return this._wallet.erc20_deposit_process;
  }
}
class Router {
  constructor(methods) {
    this.methods = methods;
  }
  Process = (route) => {
    let routelc = String(route).toLocaleLowerCase();
    const routearr = routelc.split("/");
    if (this.methods.get(routearr[0])) {
      switch (routearr[0]) {
        case "":
        default:
          return Error("methods donot match any handler");
      }
    } else {
      return Error("methods donot match any handler");
    }
  };
}
