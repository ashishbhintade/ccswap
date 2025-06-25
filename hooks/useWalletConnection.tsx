import { useState, useEffect } from "react";
import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  type WalletClient,
  type PublicClient,
  type Address,
} from "viem";
import { sepolia } from "viem/chains";

export function useWalletConnection() {
  const [account, setAccount] = useState<Address | undefined>();
  const [client, setClient] = useState<WalletClient | undefined>();
  const [publicClient, setPublicClient] = useState<PublicClient | undefined>();

  const isConnected = Boolean(account && client);

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    const checkConnection = async () => {
      try {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          const saved = accounts[0];
          if (saved.startsWith("0x") && saved.length === 42) {
            setAccount(saved as Address);
            const walletClient = createWalletClient({
              chain: sepolia,
              transport: custom(ethereum),
            });
            setClient(walletClient);

            const publicClient = createPublicClient({
              chain: sepolia,
              transport: http(), // public RPC
            });
            setPublicClient(publicClient);

            localStorage.setItem("walletAccount", saved);
          }
        } else {
          disconnectWallet();
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err);
      }
    };

    checkConnection();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        const account = accounts[0] as Address;
        setAccount(account);

        const walletClient = createWalletClient({
          chain: sepolia,
          transport: custom(ethereum),
        });
        setClient(walletClient);

        const publicClient = createPublicClient({
          chain: sepolia,
          transport: http(),
        });
        setPublicClient(publicClient);

        localStorage.setItem("walletAccount", account);
      }
    };

    ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const connectWallet = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const connectedAccount = accounts[0] as Address;

      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(ethereum),
      });
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
      });

      setAccount(connectedAccount);
      setClient(walletClient);
      setPublicClient(publicClient);

      localStorage.setItem("walletAccount", connectedAccount);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      disconnectWallet();
    }
  };

  const disconnectWallet = () => {
    setAccount(undefined);
    setClient(undefined);
    setPublicClient(undefined);
    localStorage.removeItem("walletAccount");
  };

  return {
    account,
    client,
    publicClient,
    isConnected,
    connectWallet,
    disconnectWallet,
  };
}
