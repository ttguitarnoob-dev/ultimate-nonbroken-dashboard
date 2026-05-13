export const dynamic = "force-dynamic";

import { GetBubblesAppointments, GetBubblesInquiries } from "@/app/lib/server-actions";
import { title } from "@/components/primitives";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { Spinner } from "@heroui/spinner";

export default async function DashboardPage() {

    const inquiries = await GetBubblesInquiries()
    const appointments = await GetBubblesAppointments()
    const formatCentralTime = (date: string | Date) =>
        new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "America/Chicago",
        }).format(new Date(date));

    console.log("APT APT", appointments)

    return (
        <div className="space-y-6">
            <h1 className={title()}>Barking Bubbles Dashboard</h1>
            <Button radius="full" color="primary" as={Link} href="/bubbles/availability">
                Set Availability
            </Button>

            <section>
            <div className="space-y-6">
    <h1 className="text-2xl">Upcoming Appointments</h1>

    {appointments ? (
        <div className="grid gap-5 lg:grid-cols-2">
            {appointments.map((item) => (
                <Card key={item.id} className="shadow-md backdrop-blur-lg bg-black/20 dark:bg-white/10">
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
                                {formatCentralTime(new Date(item.slot.startsAt))}
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
    ) : (
        <p className="text-default-500">Loading appointments...</p>
    )}
</div>

            </section>
            <section>
                <h2>Inquiries</h2>
                {inquiries ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {inquiries.map((item) => (
                            <Card key={item.id} className="shadow-md backdrop-blur-lg bg-black/20 dark:bg-white/10">
                                <CardHeader className="flex items-start justify-between gap-4">
                                    <div className="flex flex-col">
                                        <p className="text-lg font-semibold">
                                            Human: {item.ownerName}
                                        </p>

                                        <p className="text-small text-default-500">
                                            {item.email}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-small font-medium">
                                            Dog: {item.dogName}
                                        </p>

                                        <p className="text-tiny text-default-400">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </CardHeader>

                                <Divider />

                                <CardBody>
                                    <p className="text-sm leading-relaxed text-default-700 whitespace-pre-wrap">
                                        {item.inquiry}
                                    </p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <>
                        <Spinner />
                        <p className="text-default-500">Loading inquiries...</p>
                    </>
                )}
            </section>
        </div>
    );
}
