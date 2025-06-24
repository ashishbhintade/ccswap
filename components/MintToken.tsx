"use client";

import { useState } from "react";
import type { Address, Chain } from "viem";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia,
} from "viem/chains";
import tokenJson from "@/abis/Token.json";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import TokenSelector from "@/components/TokenSelector";

const defaultToken = {
  chain: "ETH",
  token: "Hedera",
  tokenAddress: "0xc5aaba5a2bf9bafe78402728da518b8b629f3808",
  selector: "0x530b9AeBF59481e459Cf6a0c7269042843a6FCb2",
};

const chainMap = {
  ETH: sepolia,
  Base: baseSepolia,
  ARB: arbitrumSepolia,
  Optimism: optimismSepolia,
} as const;

export default function MintToken() {
  const [token, setToken] = useState(defaultToken);
  const { account, client } = useWalletConnection();

  const selectedNetwork = token.chain as keyof typeof chainMap;
  const selectedChain: Chain = chainMap[selectedNetwork];

  const contractAbi = tokenJson.abi;

  const handleSubmit = async () => {
    try {
      if (!client) {
        throw new Error("Wallet client could not be created");
      }
      if (!account) {
        throw new Error("Wallet client could not be created");
      }
      await client.writeContract({
        account: account,
        address: token.tokenAddress as Address,
        abi: contractAbi,
        functionName: "mint",
        chain: selectedChain,
        args: [account],
      });
      //   console.log("Policy expired successfully.");
    } catch (err) {
      console.error("Error occured during minting tokens:", err);
    }
  };

  // const handleSubmit = () => {
  //   console.log("Account : ", account);
  //   console.log("Token Address : ", token.tokenAddress);
  //   console.log("Selected Chain : ", selectedChain);
  //   console.log("To : ", account);
  // };

  return (
    <Card className="max-w-lg mx-auto mt-10 p-6 shadow-md">
      <CardContent>
        <h1 className="text-xl font-semibold mb-2">Mint Tokens</h1>
        <hr />

        <div className="flex flex-col items-center">
          <div className="flex justify-between w-2/3 mb-8 mt-10">
            <Label htmlFor="token" className="text-md">
              Select a Token
            </Label>
            <TokenSelector selectedToken={token} setSelectedToken={setToken} />
          </div>

          <Button onClick={handleSubmit} className="w-2/3 mt-4 cursor-pointer">
            Mint
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
