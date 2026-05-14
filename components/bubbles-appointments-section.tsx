import { GetBubblesAppointments } from "@/app/lib/server-actions";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";

const formatCentralTime = (date: string | Date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Chicago",
  }).format(new Date(date));

export default async function AppointmentsSection() {
  const appointments = await GetBubblesAppointments();

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2 mb-4 mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          Upcoming Appointments
        </h2>
  
        <p className="text-sm text-default-500">
          Scheduled grooming visits and customer details.
        </p>
      </div>
  
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
        {appointments.map((item) => (
          <Card
            key={item.id}
            className="shadow-md backdrop-blur-lg bg-secondary/20 dark:bg-white/10"
          >
            <CardHeader className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">
                  {item.ownerName}
                </h2>
  
                <p className="text-small text-default-500">
                  {item.email}
                </p>
  
                {item.phoneNumber && (
                  <p className="text-small text-default-500">
                    {item.phoneNumber}
                  </p>
                )}
              </div>
  
              <div className="text-right">
                <p className="text-small font-medium">
                  {formatCentralTime(item.slot.startsAt)}
                </p>
  
                <p className="text-tiny text-default-400">
                  booked{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardHeader>
  
            <Divider />
  
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-default-100 p-3">
                  <p className="text-tiny uppercase text-default-400">
                    Dog
                  </p>
  
                  <p className="font-medium">
                    {item.dogName}
                  </p>
                </div>
  
                <div className="rounded-xl bg-default-100 p-3">
                  <p className="text-tiny uppercase text-default-400">
                    Size / Fur
                  </p>
  
                  <p className="font-medium">
                    {item.dogSize} • {item.furLength}
                  </p>
                </div>
              </div>
  
              <div className="rounded-xl bg-default-100 p-3">
                <p className="text-tiny uppercase text-default-400">
                  Service Location
                </p>
  
                <p className="font-medium">
                  {item.location}
                </p>
              </div>
  
              {item.allergy ? (
                <div className="rounded-xl border border-warning bg-warning-50 p-3">
                  <p className="text-tiny uppercase text-warning">
                    Allergy Notes
                  </p>
  
                  <p className="text-sm">
                    {item.allergyDescription ||
                      "Customer indicated allergies."}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-success-50 p-3">
                  <p className="text-sm text-success">
                    No allergies reported
                  </p>
                </div>
              )}
  
              {item.additionalDetails && (
                <div className="rounded-xl bg-default-100 p-3">
                  <p className="text-tiny uppercase text-default-400">
                    Additional Details
                  </p>
  
                  <p className="text-sm whitespace-pre-wrap">
                    {item.additionalDetails}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}