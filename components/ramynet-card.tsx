"use client"

import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { TrashIcon } from "./icons";
import { Image } from "@heroui/image";
import { DeleteRamyNetLocation } from "@/app/lib/server-actions";

export default function RamyNetCard(location: any) {

    function handleDelete(locationID: number) {
        console.log("DELTIN", locationID)
        DeleteRamyNetLocation(locationID)
    }


    return (
        <>
            <Card
                key={location.id}
                className="backdrop-blur-lg bg-black/20 dark:bg-white/10 transition-shadow"
            >
                <CardHeader className="grid grid-cols-[40px_1fr_40px] items-center px-4 py-2 border-b border-gray-100">
                    <div />

                    <h3 className="text-xl font-bold text-center break-words">
                        {location.location.locationName}
                    </h3>

                    
                </CardHeader>

                <CardBody className="px-4 py-3 space-y-1 text-gray-700">
                    <Image
                        src={location.location.imageURL ?? ""}
                        alt={location.location.imageURL ?? ""}
                        className="w-full object-cover rounded"
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
                    <CardFooter className="flex justify-center">
                    <Button
                        isIconOnly
                        startContent={<TrashIcon />}
                        onPress={() => handleDelete(location.location.id)}
                    />
                    </CardFooter>
                </CardBody>
            </Card>
        </>
    )
}