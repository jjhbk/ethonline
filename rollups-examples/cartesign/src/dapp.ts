import { createApp } from "@deroll/app";
import { createRouter } from "@deroll/router";
import { createWallet } from "@deroll/wallet";
import { parseAbi, decodeFunctionData, getAddress } from "viem";
// create application
const app = createApp({ url: "http://127.0.0.1:5004" });

// define application ABI
const abi = parseAbi([
  "function attackDragon(uint256 dragonId, string weapon)",
  "function drinkPotion()",
]);

// handle input encoded as ABI function call
app.addAdvanceHandler(async (data: any) => {
  const payload = data["payload"];
  console.log("Received advance request data " + data);

  const { functionName, args } = decodeFunctionData({ abi, data: payload });

  switch (functionName) {
    case "attackDragon":
      const [dragonId, weapon] = args;
      console.log(`attacking dragon ${dragonId} with ${weapon}...`);
      return "accept";

    case "drinkPotion":
      console.log(`drinking potion...`);
      return "accept";
  }
});
const wallet = createWallet();

const router = createRouter({ app });
router.add<{ address: string }>(
  "wallet/:address",
  ({ params: { address } }) => {
    return JSON.stringify({
      balance: wallet.balanceOf(address).toString(),
    });
  }
);
router.add<{ address: string; erc20: string }>(
  "wallet/erc20/:address/:erc20",
  ({ params: { address, erc20 } }) => {
    return JSON.stringify({
      balance: wallet.balanceOf(getAddress(erc20), address).toString(),
    });
  }
);
app.addAdvanceHandler(wallet.handler);
app.addInspectHandler(router.handler);

// start app
app.start().catch((e: any) => {
  console.error(e);
  process.exit(1);
});
