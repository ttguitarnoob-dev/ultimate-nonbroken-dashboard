"use client";

import { useMemo, useState } from "react";
import { title } from "@/components/primitives";

// import { Button, DatePicker, TimeInput } from "@heroui/react";
import { Time } from "@internationalized/date";

export default function AvailabilityPage() {
  const [date, setDate] = useState<any>(null);
  const [time, setTime] = useState<Time | null>(new Time(9, 0));

  const startsAt = useMemo(() => {
    if (!date || !time) return null;

    // Convert HeroUI date + time into a native JS Date
    return new Date(
      date.year,
      date.month - 1,
      date.day,
      time.hour,
      time.minute,
      0,
      0
    );
  }, [date, time]);

  async function handleSubmit() {
    if (!startsAt) return;

    // This matches your Prisma model:
    // {
    //   startsAt: Date
    // }

    const payload = {
      startsAt,
    };

    console.log(payload);

    // later:
    // await CreateAvailabilitySlot(payload)
  }

  return (
    <div className="space-y-6">
      <h1 className={title()}>Availability</h1>

      {/* <div className="flex max-w-md flex-col gap-4 rounded-2xl border p-6 shadow-sm">
        <DatePicker
          label="Date"
          value={date}
          onChange={setDate}
        />

        <TimeInput
          label="Time"
          value={time}
          onChange={setTime}
        />

        <Button color="primary" onPress={handleSubmit}>
          Create Availability Slot
        </Button>

        {startsAt && (
          <div className="rounded-xl bg-default-100 p-3 text-sm">
            <p className="font-medium">Generated DateTime</p>

            <p>{startsAt.toString()}</p>

            <p className="mt-2 text-default-500">
              ISO: {startsAt.toISOString()}
            </p>
          </div>
        )}
      </div> */}
    </div>
  );
}