export const dynamic = "force-dynamic";

import AppointmentsSection from "@/components/bubbles-appointments-section";
import InquiriesSection from "@/components/bubbles-inquiries-section";
import { title } from "@/components/primitives";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Suspense } from "react";

export default function DashboardPage() {
    return (
        <div className="w-full space-y-10 px-4 py-6 sm:px-6 lg:px-8">
            {/* Dashboard Header */}
            <div className="flex flex-col items-center justify-center gap-6 text-center py-4">
                <div className="space-y-3 max-w-3xl">
                    <h1
                        className={`${title()} !text-3xl sm:!text-4xl lg:!text-5xl leading-tight`}
                    >
                        Barking Bubbles Dashboard
                    </h1>

                    
                </div>

                <Button
                    radius="full"
                    color="secondary"
                    size="lg"
                    as={Link}
                    href="/bubbles/availability"
                >
                    Set Availability
                </Button>
            </div>

            {/* Sections */}
            <div className="space-y-8">
                <Suspense>
                    <AppointmentsSection />
                </Suspense>

                <Suspense>
                    <InquiriesSection />
                </Suspense>
            </div>
        </div>
    );
}