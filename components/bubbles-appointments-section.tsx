import { GetBubblesAppointments } from "@/app/lib/server-actions";

import { Card, Separator } from "@heroui/react";

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
  
        <p className="text-sm text-muted">
          Scheduled grooming visits and customer details.
        </p>
      </div>
  
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
        {appointments.map((item) => (
          <Card.Root
            key={item.id}
            className="shadow-md backdrop-blur-lg bg-default/20 dark:bg-white/10"
          >
            <Card.Header className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">
                  {item.ownerName}
                </h2>
  
                <p className="text-sm text-muted">
                  {item.email}
                </p>
  
                {item.phoneNumber && (
                  <p className="text-sm text-muted">
                    {item.phoneNumber}
                  </p>
                )}
              </div>
  
              <div className="text-right">
                <p className="text-sm font-medium">
                  {formatCentralTime(item.slot.startsAt)}
                </p>
  
                <p className="text-xs text-muted">
                  booked{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Card.Header>
  
            <Separator />
  
            <Card.Content className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-default/50 p-3">
                  <p className="text-xs uppercase text-muted">
                    Dog
                  </p>
  
                  <p className="font-medium">
                    {item.dogName}
                  </p>
                </div>
  
                <div className="rounded-xl bg-default/50 p-3">
                  <p className="text-xs uppercase text-muted">
                    Size / Fur
                  </p>
  
                  <p className="font-medium">
                    {item.dogSize} • {item.furLength}
                  </p>
                </div>
              </div>
  
              <div className="rounded-xl bg-default/50 p-3">
                <p className="text-xs uppercase text-muted">
                  Service Location
                </p>
  
                <p className="font-medium">
                  {item.location}
                </p>
              </div>
  
              {item.allergy ? (
                <div className="rounded-xl border border-warning bg-warning-soft p-3">
                  <p className="text-xs uppercase text-warning">
                    Allergy Notes
                  </p>
  
                  <p className="text-sm">
                    {item.allergyDescription ||
                      "Customer indicated allergies."}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-success-soft p-3">
                  <p className="text-sm text-success">
                    No allergies reported
                  </p>
                </div>
              )}
  
              {item.additionalDetails && (
                <div className="rounded-xl bg-default/50 p-3">
                  <p className="text-xs uppercase text-muted">
                    Additional Details
                  </p>
  
                  <p className="text-sm whitespace-pre-wrap">
                    {item.additionalDetails}
                  </p>
                </div>
              )}
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </section>
  );
}