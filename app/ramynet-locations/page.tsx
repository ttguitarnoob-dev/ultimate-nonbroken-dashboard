
import RamyNetMap from "@/components/ramynet-map";
import { GetRamyNetLocations } from "../lib/server-actions";
import { Card, CardHeader, CardBody } from "@heroui/card";

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
        <Card
          key={location.id}
          className="backdrop-blur-lg bg-black/20 dark:bg-white/10 transition-shadow"
        >
          <CardHeader className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-xl font-bold">{location.locationName}</h3>
          </CardHeader>

          <CardBody className="px-4 py-3 space-y-1 text-gray-700">
            <div>
              <span className="font-semibold">IP Address:</span> {location.ipAddress}
            </div>
            <div>
              <span className="font-semibold">Latitude:</span> {location.latitude}
            </div>
            <div>
              <span className="font-semibold">Longitude:</span> {location.longitude}
            </div>
            <div>
              <span className="font-semibold">Altitude:</span> {location.altitude}
            </div>
            <div>
              <span className="font-semibold">Created:</span>{" "}
              {new Intl.DateTimeFormat("en-US", {
                timeZone: "America/Chicago",
                timeStyle: "short",
                dateStyle: "short",
              }).format(new Date(location.createdAt))}
            </div>
          </CardBody>
        </Card>
      ))
    ) : (
      <p className="text-gray-500">No locations found.</p>
    )}
  </div>
</>
        {/* <RamyNetMap locations={results} /> */}
      </div>
    </div>
  );
}