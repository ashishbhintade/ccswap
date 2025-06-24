"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectWallet from "./ConnectWallet";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export default function Header() {
  const pathname = usePathname();
  const { account } = useWalletConnection();

  return (
    <div className="mx-auto top-0 z-50 h-16 flex items-center justify-between">
      {/* Left: Logo */}
      <Link href="/" className="text-xl font-bold text-white">
        CCSwap
      </Link>

      {/* Right: Connect Wallet */}
      <div>
        <ConnectWallet />
      </div>
    </div>
  );
}
