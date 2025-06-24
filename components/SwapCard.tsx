"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TokenSelector from "@/components/TokenSelector";
import { useWalletConnection } from "@/hooks/useWalletConnection";

const defaultFromToken = {
  chain: "ETH",
  token: "Hedera",
  tokenAddress: "0xc5aaba5a2bf9bafe78402728da518b8b629f3808",
  selector: "0x530b9AeBF59481e459Cf6a0c7269042843a6FCb2",
};
const defaultToToken = {
  chain: "ARB",
  token: "Hedera",
  tokenAddress: "0x71893b2ece4826fe54cab810d78c9f501d60e149",
  selector: "0xa67D4C6E8ffF498a57F400A95701ED7Ee0c161A9",
};

export default function SwapCard() {
  const { account } = useWalletConnection();

  const [fromToken, setFromToken] = useState(defaultFromToken);
  const [toToken, setToToken] = useState(defaultToToken);
  const [amount, setAmount] = useState("");

  const handleSwap = () => {
    console.log("Swapping:");
    console.log("From Token:", fromToken);
    console.log("To Token:", toToken);
    console.log("Amount:", amount);
  };

  const isSwapDisabled =
    !account || !amount.trim() || fromToken.selector === toToken.selector;

  return (
    <Card className="w-full max-w-lg bg-[#1f1f1f] text-white rounded-2xl shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Swap</CardTitle>
        </div>
        <hr />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From */}
        <div>
          <label className="text-sm text-muted-foreground px-2">
            Tranfer from {fromToken.chain} / {fromToken.token}
          </label>
          <div className="bg-[#2a2a2a] rounded-xl p-3 mt-2 grid grid-cols-2">
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
          <label className="text-sm text-muted-foreground px-2">
            Tranfer to {toToken.chain} / {toToken.token}
          </label>
          <div className="rounded-xl mt-2 grid grid-cols-2 py-3">
            <Input
              placeholder="Select Destination Chain"
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
          className="w-full text-black font-semibold rounded-xl"
        >
          Swap
        </Button>
      </CardContent>
    </Card>
  );
}
