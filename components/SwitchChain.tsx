"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia,
  sepolia,
  type Chain,
} from "viem/chains";
import { useWalletConnection } from "@/hooks/useWalletConnection";

// All available Sepolia testnets
const chains: Record<string, Chain> = {
  ETH: sepolia,
  ARB: arbitrumSepolia,
  Base: baseSepolia,
  Optimism: optimismSepolia,
};

export default function ChainSwitcher() {
  const { client } = useWalletConnection();
  const [selectedChain, setSelectedChain] = useState("ETH");

  const switchOrAddNetwork = async (chainName: keyof typeof chains) => {
    const chain = chains[chainName];
    setSelectedChain(chainName);

    const ethereum = (window as any).ethereum;

    if (!client) {
      alert("Client is not available");
      return;
    }

    try {
      // Try switching the chain
      await client?.switchChain({ id: chain.id });
    } catch (error: any) {
      if (
        error.code === 4902 ||
        error.message.includes("Unrecognized chain ID")
      ) {
        // Try adding the network if not recognized
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chain.id.toString(16)}`,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: chain.rpcUrls.default.http,
                blockExplorerUrls: chain.blockExplorers
                  ? [chain.blockExplorers.default.url]
                  : [],
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding chain", addError);
        }
      } else {
        console.error("Switch chain error", error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-primary bg-transparent cursor-pointer"
        >
          {selectedChain} Sepolia
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#bf90fe] border-none">
        {Object.keys(chains).map((key) => (
          <DropdownMenuItem
            className="cursor-pointer hover:bg-[#4c3965]"
            key={key}
            onClick={() => switchOrAddNetwork(key as keyof typeof chains)}
          >
            {key} Sepolia
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
