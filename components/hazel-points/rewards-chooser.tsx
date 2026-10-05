"use client"

import { GetHazelRewards } from "@/app/lib/server-actions";
import { HazelReward } from "@/types";
import { Button } from "@heroui/button";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/modal";
import { useState, useEffect } from "react";

export default function HazelRewardsChooser() {

    const [rewards, setRewards] = useState<HazelReward[]>([]);

    useEffect(() => {
      async function fetchRewards() {
        const data = await GetHazelRewards();
        setRewards(data);
      }
      fetchRewards();
    }, []);
  
    const handlePurchase = (id: number) => {
      console.log('Selected ID:', id);
    };

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Button onPress={onOpen}>See Rewards!</Button>
            <Modal scrollBehavior="inside" size="5xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-4xl font-extrabold text-center text-green-600 mb-8 animate-bounce">Rewards!</ModalHeader>
                            <ModalBody>
                                <div className="min-h-screen bg-background p-8">
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {rewards.map((reward) => (
                                            <div
                                                key={reward.id}
                                                className="bg-background rounded-3xl shadow-lg p-4 border-4 border-purple-200 hover:border-purple-400 transition-all transform hover:-translate-y-2 flex flex-col items-center"
                                            >
                                                <img
                                                    src={reward.image}
                                                    alt={reward.name}
                                                    className="w-full h-48 object-cover rounded-2xl mb-4"
                                                />
                                                <h2 className="text-2xl font-bold text-pink-500 mb-2">{reward.name}</h2>
                                                <p className="text-lg font-semibold text-gray-700 mb-4">
                                                    🪙 {reward.cost} Points
                                                </p>
                                                <button
                                                    onClick={() => handlePurchase(reward.id)}
                                                    className="mt-auto bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:from-green-500 hover:to-blue-600 transition-colors text-lg"
                                                >
                                                    Buy Now!
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
