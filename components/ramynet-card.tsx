"use client"

import { Button, Card } from "@heroui/react";
import { TrashIcon } from "./icons";
import { DeleteRamyNetLocation } from "@/app/lib/server-actions";

export default function RamyNetCard(location: any) {

    function handleDelete(locationID: number) {
        console.log("DELTIN", locationID)
        DeleteRamyNetLocation(locationID)
    }


    return (
        <>
            <Card.Root
                key={location.id}
                className="backdrop-blur-lg bg-black/20 dark:bg-white/10 transition-shadow"
            >
                <Card.Header className="grid grid-cols-[40px_1fr_40px] items-center px-4 py-2 border-b border-gray-100">
                    <div />

                    <h3 className="text-xl font-bold text-center break-words">
                        {location.location.locationName}
                    </h3>

                    
                </Card.Header>

                <Card.Content className="px-4 py-3 space-y-1 text-gray-700">
                    <img
                        src={location.location.imageURL ?? ""}
                        alt={location.location.imageURL ?? ""}
                        className="h-auto w-full rounded object-cover"
                    />
                    <div>
                        <span className="font-semibold">IP Address:</span> {location.location.ipAddress}
                    </div>
                    <div>
                        <span className="font-semibold">Latitude:</span> {location.location.latitude}
                    </div>
                    <div>
                        <span className="font-semibold">Longitude:</span> {location.location.longitude}
                    </div>
                    <div>
                        <span className="font-semibold">Altitude:</span> {(Number(location.location.altitude) * 3.28084).toFixed(1)} ft
                    </div>
                    <div>
                        <span className="font-semibold">Date:</span>{" "}
                        {location.location.createdAt
                            ? new Intl.DateTimeFormat("en-US", {
                                timeZone: "America/Chicago",
                                timeStyle: "short",
                                dateStyle: "short",
                            }).format(new Date(location.location.createdAt))
                            : "N/A"}
                    </div>
                </Card.Content>
                <Card.Footer className="flex justify-center">
                    <Button
                        isIconOnly
                        aria-label="Delete location"
                        variant="danger"
                        onPress={() => handleDelete(location.location.id)}
                    >
                        <TrashIcon />
                    </Button>
                </Card.Footer>
            </Card.Root>
        </>
    )
}