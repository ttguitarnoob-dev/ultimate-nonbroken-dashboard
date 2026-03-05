
import RamyNetMap from "@/components/ramynet-map";
import { GetRamyNetLocations } from "../lib/server-actions";

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
            <h2>RamyNet Locations</h2> 
            <div className="locations-list">
    {results && results.length > 0 ? (
      results.map((location) => (
        <div key={location.id} className="location-card">
          <h3>{location.locationName}</h3>

          <div>
            <strong>IP Address:</strong> {location.ipAddress}
          </div>

          <div>
            <strong>Latitude:</strong> {location.latitude}
          </div>

          <div>
            <strong>Longitude:</strong> {location.longitude}
          </div>

          <div>
            <strong>Altitude:</strong> {location.altitude}
          </div>

          <div>
  <strong>Created:</strong>{" "}
  {new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    timeStyle: "short",
    dateStyle: "short",
  }).format(new Date(location.createdAt))}
</div>
        </div>
      ))
    ) : (
      <p>No locations found.</p>
    )}
  </div>     
        </>
        {/* <RamyNetMap locations={results} /> */}
      </div>
    </div>
  );
}