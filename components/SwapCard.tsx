"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TokenSelector from "@/components/TokenSelector";
import { useWalletConnection } from "@/hooks/useWalletConnection";

const defaultToken = { symbol: "ETH", name: "Ethereum" };

export default function SwapCard() {
  const { account } = useWalletConnection();

  const [fromToken, setFromToken] = useState(defaultToken);
  const [toToken, setToToken] = useState({ symbol: "USDC", name: "USD Coin" });
  const [amount, setAmount] = useState("");

  const handleSwap = () => {
    console.log("Swapping:");
    console.log("From Token:", fromToken);
    console.log("To Token:", toToken);
    console.log("Amount:", amount);
  };

  const isSwapDisabled =
    !account || !amount.trim() || fromToken.name === toToken.name;

  return (
    <Card className="w-full max-w-lg bg-[#1f1f1f] text-white rounded-2xl shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Swap</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From */}
        <div>
          <label className="text-sm text-muted-foreground px-2">
            Amount in {fromToken.symbol}
          </label>
          <div className="bg-[#2a2a2a] rounded-xl p-3 mt-2 flex items-center justify-between">
            <Input
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent border-none text-2xl font-semibold text-white w-full focus-visible:ring-0"
            />
            <TokenSelector
              selectedToken={fromToken}
              setSelectedToken={setFromToken}
            />
          </div>
        </div>

        {/* To */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground px-2">
            Amount in {toToken.symbol}
          </label>
          <div className="rounded-xl p-3 mt-2 flex items-center justify-between">
            <Input
              placeholder={amount ? amount : "0.0"}
              className="bg-transparent border-none text-2xl font-semibold text-white w-full focus-visible:ring-0"
              disabled
            />
            <TokenSelector
              selectedToken={toToken}
              setSelectedToken={setToToken}
            />
          </div>
        </div>

        <Button
          onClick={handleSwap}
          disabled={isSwapDisabled}
          className="w-full text-black font-semibold rounded-xl"
        >
          Swap
        </Button>
      </CardContent>
    </Card>
  );
}
