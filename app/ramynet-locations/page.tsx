export const dynamic = "force-dynamic";

import { Button } from "@heroui/button";
// import RamyNetMap from "@/components/ramynet-map";
import { GetRamyNetLocations } from "../lib/server-actions";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { TrashIcon } from "@/components/icons";
import RamyNetCard from "@/components/ramynet-card";

export default async function RamyNetLocationsPage() {
  const results = await GetRamyNetLocations();
  console.log(results)

  

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="px-6 py-4 border-b">
        <h2 className="text-2xl font-semibold">RamyNet Locations</h2>
      </div>

      <div className="flex-1">
        <>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {results && results.length > 0 ? (
              results.map((location) => (
                <RamyNetCard location={location} key={location.id}/>
              ))
            ) : (
              <p className="text-gray-500">No locations found for some reason.</p>
            )}
          </div>
        </>
        {/* <RamyNetMap locations={results} /> */}
      </div>
    </div>
  );
}