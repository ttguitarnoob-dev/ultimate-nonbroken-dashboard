"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";

type RamyNetLocation = {
  id: number;
  latitude: string;
  longitude: string;
  altitude: string;
  ipAddress: string;
  locationName: string;
  createdAt: Date;
};

declare global {
  interface Window {
    mapkit: any;
  }
}

export default function RamyNetMap({
  locations,
}: {
  locations: RamyNetLocation[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<RamyNetLocation | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js";
    script.async = true;

    script.onload = () => {
      window.mapkit.init({
        authorizationCallback: function (done: any) {
          fetch("/api/mapkit-token")
            .then((res) => res.text())
            .then((token) => done(token));
        },
      });

      const map = new window.mapkit.Map(mapRef.current, {
        center: new window.mapkit.Coordinate(39.5, -98.35),
        zoom: 4,
        showsCompass: window.mapkit.FeatureVisibility.Visible,
      });

      const annotations = locations.map((loc) => {
        const coord = new window.mapkit.Coordinate(
          Number(loc.latitude),
          Number(loc.longitude)
        );

        const annotation = new window.mapkit.MarkerAnnotation(coord, {
          title: loc.locationName,
          color: "#2563eb",
        });

        annotation.addEventListener("select", () => {
          setSelectedLocation(loc);
        });

        return annotation;
      });

      map.addAnnotations(annotations);
    };

    document.head.appendChild(script);
  }, [locations]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0" />

      {selectedLocation && (
        <div className="absolute bottom-6 left-6 w-[350px]">
          <Card className="shadow-xl">
            <CardHeader className="font-semibold text-lg">
              {selectedLocation.locationName}
            </CardHeader>

            <CardBody className="space-y-2 text-sm">
              <div>
                <strong>IP:</strong> {selectedLocation.ipAddress}
              </div>

              <div>
                <strong>Latitude:</strong> {selectedLocation.latitude}
              </div>

              <div>
                <strong>Longitude:</strong> {selectedLocation.longitude}
              </div>

              <div>
                <strong>Altitude:</strong> {selectedLocation.altitude}
              </div>

              <div>
                <strong>Created:</strong>{" "}
                {new Intl.DateTimeFormat("en-US", {
                  timeZone: "America/Chicago",
                  timeStyle: "short",
                  dateStyle: "short",
                }).format(new Date(selectedLocation.createdAt))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}