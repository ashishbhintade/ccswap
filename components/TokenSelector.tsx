"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

const tokens = [
  //Ethereum
  {
    chain: "ETH",
    token: "Hedera",
    tokenAddress: "0xc5aaba5a2bf9bafe78402728da518b8b629f3808",
    selector: "0x530b9AeBF59481e459Cf6a0c7269042843a6FCb2",
    chainSelector: "16015286601757825753",
  },
  {
    chain: "ETH",
    token: "Aptos",
    tokenAddress: "0xf8ba235ae8cb078200b5525786f91c9b6043cfa6",
    selector: "0x530b9AeBF59481e459Cf6a0c7269042843a6FCb2",
    chainSelector: "16015286601757825753",
  },
  {
    chain: "ETH",
    token: "Uniswap",
    tokenAddress: "0xaea090e3facab1b441a1e8bb046f1760b5f1ed12",
    selector: "0x530b9AeBF59481e459Cf6a0c7269042843a6FCb2",
    chainSelector: "16015286601757825753",
  },
  {
    chain: "ETH",
    token: "USDC",
    tokenAddress: "0x93f305fabe1ae9f62da2be248554e18519d035fb",
    selector: "0x530b9AeBF59481e459Cf6a0c7269042843a6FCb2",
    chainSelector: "16015286601757825753",
  },
  {
    chain: "ETH",
    token: "Near",
    tokenAddress: "0x398bf9558a02c927865bd6b51999a47a0e76de67",
    selector: "0x530b9AeBF59481e459Cf6a0c7269042843a6FCb2",
    chainSelector: "16015286601757825753",
  },
  //Arbitrum
  {
    chain: "ARB",
    token: "Hedera",
    tokenAddress: "0x71893b2ece4826fe54cab810d78c9f501d60e149",
    selector: "0xa67D4C6E8ffF498a57F400A95701ED7Ee0c161A9",
    chainSelector: "3478487238524512106",
  },
  {
    chain: "ARB",
    token: "Aptos",
    tokenAddress: "0x6110497bb349f84452b92e012b4d6394b5a41ac0",
    selector: "0xa67D4C6E8ffF498a57F400A95701ED7Ee0c161A9",
    chainSelector: "3478487238524512106",
  },
  {
    chain: "ARB",
    token: "Aave",
    tokenAddress: "0x85Dd42Ea8276AA21544f3f634ef84CcF5161fFCe",
    selector: "0xa67D4C6E8ffF498a57F400A95701ED7Ee0c161A9",
    chainSelector: "3478487238524512106",
  },
  {
    chain: "ARB",
    token: "Near",
    tokenAddress: "0x8325708abd29a98da3988b43737ea7e82f7395b9",
    selector: "0xa67D4C6E8ffF498a57F400A95701ED7Ee0c161A9",
    chainSelector: "3478487238524512106",
  },
  //Base
  {
    chain: "Base",
    token: "Hedera",
    tokenAddress: "0x777b48ef08a87933e0d0f10881aea1f653a2d497",
    selector: "0x1Ef00bE0a03f862f980Ac8789A37031c69fB2417",
    chainSelector: "10344971235874465080",
  },
  {
    chain: "Base",
    token: "Aptos",
    tokenAddress: "0x482d44f610200bd112e43642f365d67ab0e23450",
    selector: "0x1Ef00bE0a03f862f980Ac8789A37031c69fB2417",
    chainSelector: "10344971235874465080",
  },
  {
    chain: "Base",
    token: "Aave",
    tokenAddress: "0x3B9E8Aa5F6cF87038a098071b16645385FBDE21D",
    selector: "0x1Ef00bE0a03f862f980Ac8789A37031c69fB2417",
    chainSelector: "10344971235874465080",
  },
  //Optimism
  {
    chain: "Optimism",
    token: "Aptos",
    tokenAddress: "0x369841a81df5174891e7c3663e6d228d65b4fea6",
    selector: "0xfeCaAc337c404D39944C64B6A174bDadD1269F63",
    chainSelector: "5224473277236331295",
  },
  {
    chain: "Optimism",
    token: "USDC",
    tokenAddress: "0x2a7ee9cfb04343157da9c84d011036f037696ea0",
    selector: "0xfeCaAc337c404D39944C64B6A174bDadD1269F63",
    chainSelector: "5224473277236331295",
  },
  {
    chain: "Optimism",
    token: "Aave",
    tokenAddress: "0x8ad0D9ff78C7aA5458AE539f5428aD6C23fC2bC0",
    selector: "0xfeCaAc337c404D39944C64B6A174bDadD1269F63",
    chainSelector: "5224473277236331295",
  },
];

export default function TokenSelector({
  selectedToken,
  setSelectedToken,
}: {
  selectedToken: any;
  setSelectedToken: (token: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        onClick={openModal}
        className="text-sm text-white bg-transparent font-semibold px-4 py-2 cursor-pointer border rounded-2xl flex items-center"
      >
        {selectedToken.chain} - {selectedToken.token}
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-[#bf90fe] p-6 text-white shadow-xl transition-all max-h-2/3 overflow-y-auto">
                <Dialog.Title className="text-lg font-medium mb-4">
                  Select a token
                </Dialog.Title>

                <div className="space-y-2">
                  {tokens.map((token) => (
                    <button
                      key={token.tokenAddress}
                      onClick={() => {
                        setSelectedToken(token);
                        closeModal();
                      }}
                      className="w-full text-left text-white px-4 py-2 rounded hover:bg-[#4c3965] cursor-pointer rounded-lg"
                    >
                      {token.chain} — {token.token}
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
