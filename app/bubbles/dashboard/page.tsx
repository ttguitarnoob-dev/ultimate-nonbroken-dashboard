import { GetBubblesInquiries } from "@/app/lib/server-actions";
import { title } from "@/components/primitives";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";

export default async function DashboardPage() {

    const results = await GetBubblesInquiries()
    

    return (
        <div className="space-y-6">
    <h1 className={title()}>Barking Bubbles Dashboard</h1>


<section>
    <h2>Inquiries</h2>
    {results ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((item) => (
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
        <p className="text-default-500">Loading inquiries...</p>
    )}
    </section>
</div>
    );
}
