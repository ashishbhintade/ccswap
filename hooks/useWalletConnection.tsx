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
          await switchToSepolia(ethereum); // Ensure Sepolia is selected/added
          const saved = accounts[0] as Address;
          setAccount(saved);
          setClient(
            createWalletClient({ chain: sepolia, transport: custom(ethereum) })
          );
          setPublicClient(
            createPublicClient({ chain: sepolia, transport: http() })
          );
          localStorage.setItem("walletAccount", saved);
        } else {
          disconnectWallet();
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err);
      }
    };

    checkConnection();

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        await switchToSepolia(ethereum);
        const account = accounts[0] as Address;
        setAccount(account);
        setClient(
          createWalletClient({ chain: sepolia, transport: custom(ethereum) })
        );
        setPublicClient(
          createPublicClient({ chain: sepolia, transport: http() })
        );
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

      // ✅ Switch to Sepolia only after connection
      await switchToSepolia(ethereum);

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
    } catch (err: any) {
      if (err.code === -32002) {
        alert(
          "MetaMask request is already pending. Please open MetaMask and finish it."
        );
      } else {
        console.error("Wallet connection failed:", err);
      }
      disconnectWallet();
    }
  };

  const disconnectWallet = () => {
    setAccount(undefined);
    setClient(undefined);
    setPublicClient(undefined);
    localStorage.removeItem("walletAccount");
  };

  // Add or switch to Sepolia chain in MetaMask
  const switchToSepolia = async (ethereum: any) => {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID in hex
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia",
                nativeCurrency: {
                  name: "Sepolia ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Sepolia network:", addError);
        }
      } else {
        console.error("Failed to switch to Sepolia network:", switchError);
      }
    }
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
