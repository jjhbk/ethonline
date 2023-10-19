import { createApp } from "@deroll/app";
import { createRouter } from "@deroll/router";
import { createWallet } from "@deroll/wallet";
import { parseAbi, decodeFunctionData } from "viem";
// create application
const app = createApp({ url: "http://127.0.0.1:5004" });

// define application ABI
const abi = parseAbi([
  "function attackDragon(uint256 dragonId, string weapon)",
  "function drinkPotion()",
]);

// handle input encoded as ABI function call
app.addAdvanceHandler(async ({ data }: any) => {
  console.log("Received advance request data " + data);
  const payload = data["payload"];
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

app.addAdvanceHandler(wallet.handler);
app.addInspectHandler(router.handler);

// start app
app.start().catch((e: any) => {
  console.error(e);
  process.exit(1);
});
