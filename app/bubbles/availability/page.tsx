"use client";

import { SetAvailabilitySlot } from "@/app/lib/server-actions";
import { Button } from "@heroui/button";
import { useState } from "react";


type AvailabilitySlot = {

  id: string;

  startsAt: Date;

  createdAt: Date;

};

export default function AvailabilityPage() {

  const [date, setDate] = useState("");

  const [time, setTime] = useState("");

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    if (!date || !time) {

      console.log("Missing date or time");

      return;

    }

    const startsAt = new Date(`${date}T${time}`);

    const newItem = await SetAvailabilitySlot(

      startsAt,

    );

    // Add newest slot to state

    setSlots((prev) => [newItem, ...prev]);

    console.log(newItem);

    // optional reset

    setDate("");

    setTime("");

  }

  return (

    <div className="min-h-screen p-6 space-y-8">

      <form

        onSubmit={handleSubmit}

        className="max-w-md space-y-4 rounded-2xl border p-6 shadow-sm"

      >

        <h1 className="text-2xl font-bold">

          Create Availability Slot

        </h1>

        <div className="space-y-2">

          <label className="block text-sm font-medium">

            Date

          </label>

          <input

            type="date"

            value={date}

            onChange={(e) => setDate(e.target.value)}

            className="w-full rounded-lg border p-3"

          />

        </div>

        <div className="space-y-2">

          <label className="block text-sm font-medium">

            Time

          </label>

          <input

            type="time"

            value={time}

            onChange={(e) => setTime(e.target.value)}

            className="w-full rounded-lg border p-3"

          />

        </div>

        <Button type="submit" color="primary" radius="full">
          Submit
        </Button>

      </form>

      <div className="max-w-md space-y-3">

        <h2 className="text-xl font-semibold">

          Added Slots

        </h2>

        {slots.length === 0 ? (

          <p className="text-sm text-gray-500">

            No slots added yet

          </p>

        ) : (

          slots.map((slot) => (

            <div

              key={slot.id}

              className="rounded-xl border p-4"

            >

              <p>

                {new Date(slot.startsAt).toLocaleString()}

              </p>

            </div>

          ))

        )}

      </div>

    </div>

  );

}