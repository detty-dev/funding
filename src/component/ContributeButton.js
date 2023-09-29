import React, { Fragment, useState } from 'react'

import { Dialog, Transition } from "@headlessui/react";
import { useConnection } from '../context/connection';
import { supportedChains } from '../constants';
import useContributeCampaign from '../hooks/useContribute';
import { parseEther } from 'ethers';
import useBalance from '../hooks/useBalance';

const ContributeButton = ({ campaignId }) => {
  let [isOpen, setIsOpen] = useState(false);
  const [contribution, setContribution] = useState(0.5);
  const [errorMessage, setErrorMessage] = useState("");
  // const [campaignId, setCampaignId] = useState(null)
  const [sendingTx, setSendingTx] = useState(false);
  const { connect, isActive, account, switchToChain } = useConnection();
  const balance = useBalance(account)
  const contributeCampaign = useContributeCampaign()
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleContributeCampaign = async () => {
    if (!contribution) {
      setErrorMessage("Please enter a contribution amount")
      return;
    }
    if (!isActive) return alert("please, connect");
    try {
      setSendingTx(true);
      const tx = await contributeCampaign(
        parseEther(String(contribution)),
        campaignId
      );
      const receipt = await tx.wait();
      if (receipt.status === 0) return alert("tx failed");
      // closeModal();
      alert("contribution to campaign successful!!");
    } catch (error) {
      console.log("error: ", error);
      if (error.info.error.code === 4001) {
        return alert("You rejected the request");
      }
      alert("something went wrong");
    } finally {
      setSendingTx(false);
    }
  }

  return (
    <Fragment>
      <button
        onClick={openModal}
        className="w-full block rounded-md mx-auto bg-blue-400 px-4 py-3 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Contribute
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Contribute ETH
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Lorem ipsum dolor sit amet
                      consectetur adipisicing elit.
                      Consequuntur, numquam.
                    </p>
                  </div>
                  <form className="mt-4 space-y-4">
                    <div className="flex flex-col">
                      <label className="font-bold">
                        Contribution (ETH Amount)
                      </label>
                      <input
                        value={contribution}
                        onChange={(e) =>
                          setContribution(
                            Number(e.target.value)
                          )
                        }
                        type="number"
                        className="outline-0 py-2 px-1 rounded-lg mt-2 border border-blue-400"
                      />
                      <p className="italic py-1 text-x">{errorMessage}</p>
                    </div>

                    {isActive ? (
                      <div
                        onClick={handleContributeCampaign}
                        className={`cursor-pointer w-full rounded-md bg-blue-400 p-3 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-center disabled:cursor-disabled`}
                      >
                        {sendingTx
                          ? "Contributing..."
                          : "Contribute Campaign"}
                      </div>
                    ) : account ? (
                      <div
                        onClick={() =>
                          switchToChain(
                            supportedChains[0]
                          )
                        }
                        className="cursor-pointer w-full rounded-md bg-blue-400 p-3 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-center"
                      >
                        Switch to Sepolia
                      </div>
                    ) : (
                      <div
                        onClick={connect}
                        disabled={sendingTx}
                        className="cursor-pointer w-full rounded-md bg-blue-400 p-3 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-center"
                      >
                        Connect
                      </div>
                    )}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  )
}

export default ContributeButton