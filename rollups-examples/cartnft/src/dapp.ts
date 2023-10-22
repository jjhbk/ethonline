import * as fs from "fs";
import { hexToString, stringToHex } from "viem";
import { Notice, Output, Voucher, Report, Error_out, Log } from "./outputs";
import { Router } from "./router";
import { Wallet } from "./wallet";
import { Auctioneer } from "./auction";
import { request } from "http";
console.info("MarketPlace App Started");
let rollup_address = "";
const rollup_server: string = process.env.ROLLUP_HTTP_SERVER_URL;
let Network: string = "localhost";
Network = process.env.Network;
const wallet = new Wallet(new Map());
const auctioneer = new Auctioneer(wallet);

console.info("rollup server url is ", rollup_server, Network);
if (Network === undefined) {
  Network = "localhost";
}

console.info("Network is ", Network);
const erc_20_portal_file = fs.readFileSync(
  `./deployments/localhost/ERC20Portal.json`
);
const erc20_portal: any = JSON.parse(erc_20_portal_file.toString());

const erc_721_portal_file = fs.readFileSync(
  `./deployments/localhost/ERC721Portal.json`
);
const erc_721_portal: any = JSON.parse(erc_721_portal_file.toString());

const dapp_address_relay_file = fs.readFileSync(
  `./deployments/localhost/DAppAddressRelay.json`
);

const dapp_address_relay: any = JSON.parse(dapp_address_relay_file.toString());

const ether_portal_file = fs.readFileSync(
  "./deployments/localhost/EtherPortal.json"
);
const ether_portal: any = JSON.parse(ether_portal_file.toString());
const router = new Router(auctioneer, wallet);
const send_request = async (output: Output | Set<Output>) => {
  if (output instanceof Output) {
    let endpoint = "/report";
    switch (typeof output) {
      case typeof Notice:
        endpoint = "/notice";
      case typeof Report:
        endpoint = "/report";
      case typeof Voucher:
        endpoint = "/voucher";

      default:
        endpoint = "/report";
    }
    console.log(`sending request ${typeof output}`);
    const response = await fetch(rollup_server + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(output),
    });
    console.debug(
      `received ${output.payload} status ${response.status} body ${response.body}`
    );
  } else {
    output.forEach((value: Output) => {
      send_request(value);
    });
  }
};

async function handle_advance(data: any) {
  console.log("Received advance request data " + JSON.stringify(data));
  try {
    const payload = data.payload;
    const msg_sender: string = data.metadata.msg_sender;
    console.log("msg sender is", msg_sender.toLowerCase());
    const payloadStr = hexToString(payload);

    if (msg_sender.toLowerCase() === ether_portal.address.toLowerCase()) {
      try {
        return router.process("ether_deposit", payload);
      } catch (e) {
        return new Error_out(`failed to process ether deposti ${payload} ${e}`);
      }
    }
    if (msg_sender.toLowerCase() === dapp_address_relay.address.toLowerCase()) {
      rollup_address = payload;
      console.log("Setting DApp address");
      return new Log(`DApp address set up successfully to ${rollup_address}`);
    }

    if (msg_sender.toLowerCase() === erc20_portal.address.toLowerCase()) {
      try {
        return router.process("erc20_deposit", payload);
      } catch (e) {
        return new Error_out(`failed ot process ERC20Deposit ${payload} ${e}`);
      }
    }

    if (msg_sender.toLowerCase() === erc_721_portal.address.toLowerCase()) {
      try {
        return router.process("erc721_deposit", payload);
      } catch (e) {
        return new Error_out(`failed ot process ERC20Deposit ${payload} ${e}`);
      }
    }
    try {
      const jsonpayload = JSON.parse(payloadStr);
      console.log("payload is");
      return router.process(jsonpayload.method, data);
    } catch (e) {
      return new Error_out(`failed to process command ${payloadStr} ${e}`);
    }
  } catch (e) {
    console.error(e);
    return new Error_out(`failed to process advance_request ${e}`);
  }
}

async function handle_inspect(data: any) {
  console.debug(`received inspect request data${data}`);
  try {
    const url = hexToString(data.payload).split("/");
    console.log("url is ", url);
    return router.process(url[0], url[1]);
  } catch (e) {
    const error_msg = `failed to process inspect request ${e}`;
    console.debug(error_msg);
    return new Error_out(error_msg);
  }
}

var handlers: any = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();

      var typeq = rollup_req.request_type;
      var handler: any;
      if (typeq === "inspect_state") {
        handler = handlers.inspect_state;
      } else {
        handler = handlers.advance_state;
      }
      var output = await handler(rollup_req.data);
      finish.status = "accept";
      if (output instanceof Error_out) {
        finish.status = "reject";
      }
      await send_request(output);
    }
  }
})();
