"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

const tokens = [
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "DAI", name: "Dai Stablecoin" },
  { symbol: "WBTC", name: "Wrapped BTC" },
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
        className="text-sm text-white bg-transparent font-semibold px-4 py-2 cursor-pointer border rounded-2xl"
      >
        {selectedToken.symbol}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-[#1a1a1a] p-6 text-white shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium mb-4">
                  Select a token
                </Dialog.Title>

                <div className="space-y-2">
                  {tokens.map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => {
                        setSelectedToken(token);
                        closeModal();
                      }}
                      className="w-full text-left text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer rounded-lg"
                    >
                      {token.symbol} — {token.name}
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
