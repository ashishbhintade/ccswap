"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TokenSelector from "@/components/TokenSelector";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import {
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia,
} from "viem/chains";
import type { Address, Chain } from "viem";
import CCSwapJson from "@/abis/CCSwap.json";
import { parseEther } from "viem";

const defaultFromToken = {
  chain: "ETH",
  token: "Hedera",
  tokenAddress: "0xc5aaba5a2bf9bafe78402728da518b8b629f3808",
  selector: "0x530b9AeBF59481e459Cf6a0c7269042843a6FCb2",
  chainSelector: "16015286601757825753",
};
const defaultToToken = {
  chain: "ARB",
  token: "Hedera",
  tokenAddress: "0x71893b2ece4826fe54cab810d78c9f501d60e149",
  selector: "0xa67D4C6E8ffF498a57F400A95701ED7Ee0c161A9",
  chainSelector: "3478487238524512106",
};

const chainMap = {
  ETH: sepolia,
  Base: baseSepolia,
  ARB: arbitrumSepolia,
  Optimism: optimismSepolia,
} as const;

export default function SwapCard() {
  const { account, client } = useWalletConnection();

  const [fromToken, setFromToken] = useState(defaultFromToken);
  const [toToken, setToToken] = useState(defaultToToken);
  const [amount, setAmount] = useState("");

  const [simulationResult, setSimulationResult] = useState<any>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const selectedSourceNetwork = fromToken.chain as keyof typeof chainMap;
  const selectedSourceChain: Chain = chainMap[selectedSourceNetwork];

  const contractAbi = CCSwapJson.abi;

  const handleSwap = async () => {
    try {
      if (!client) {
        throw new Error("Wallet client could not be created");
      }
      if (!account) {
        throw new Error("Wallet client could not be created");
      }
      await client.writeContract({
        account: account,
        address: fromToken.selector as Address,
        abi: contractAbi,
        functionName: "swap",
        chain: selectedSourceChain,
        args: [
          BigInt(toToken.chainSelector),
          parseEther(amount),
          fromToken.tokenAddress,
          toToken.tokenAddress,
          BigInt(300000),
        ],
      });
      //   console.log("Policy expired successfully.");
    } catch (err) {
      console.error("Error occured during swaping tokens:", err);
    }
  };

  useEffect(() => {
    if (!amount || isNaN(Number(amount))) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const query = new URLSearchParams({
          originChainSelector: fromToken.chainSelector,
          destinationChainSelector: toToken.chainSelector,
          amount,
          token0: fromToken.tokenAddress,
          token1: toToken.tokenAddress,
        }).toString();

        const res = await fetch(`/api/simulate?${query}`);
        if (!res.ok) throw new Error("Simulation fetch failed");

        const data = await res.json();
        console.log(data);
        setSimulationResult(data);
      } catch (err) {
        console.error("Simulation API error:", err);
        setSimulationResult(null);
      }
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [fromToken.tokenAddress, toToken.tokenAddress, amount]);

  const isSwapDisabled =
    !account || !amount.trim() || fromToken.selector === toToken.selector;

  return (
    <Card className="w-full max-w-lg bg-[#4c1498] text-white rounded-2xl shadow-xl border-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Swap</CardTitle>
        </div>
        <hr />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From */}
        <div>
          <label className="text-sm text-white px-2">
            Tranfer from {fromToken.chain} - {fromToken.token}
          </label>
          <div className="bg-[#6f42ac] rounded-xl p-3 mt-2 grid grid-cols-2">
            <Input
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent border-none text-2xl font-semibold text-white w-full focus-visible:ring-0"
            />
            <div className="flex justify-end">
              <TokenSelector
                selectedToken={fromToken}
                setSelectedToken={setFromToken}
              />
            </div>
          </div>
        </div>

        {/* To */}
        <div className="space-y-1">
          <label className="text-sm text-[#fdfcfe] px-2">
            Tranfer to {toToken.chain} - {toToken.token}
          </label>
          <div className="rounded-xl mt-2 grid grid-cols-2 py-3">
            <Input
              placeholder={
                !simulationResult ||
                !amount ||
                amount === "0." ||
                amount === "0"
                  ? "0"
                  : simulationResult
              }
              className="bg-transparent border-none text-2xl font-semibold text-white w-full focus-visible:ring-0"
              disabled
            />
            <div className="flex justify-end px-3">
              <TokenSelector
                selectedToken={toToken}
                setSelectedToken={setToToken}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSwap}
          disabled={isSwapDisabled}
          className="w-full text-white font-semibold rounded-xl cursor-pointer"
        >
          Swap
        </Button>
      </CardContent>
    </Card>
  );
}
