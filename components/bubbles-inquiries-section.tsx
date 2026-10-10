import { GetBubblesInquiries } from "@/app/lib/server-actions";

import { Card, Separator } from "@heroui/react";

export default async function InquiriesSection() {
  const inquiries = await GetBubblesInquiries();

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2 mt-10 mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Inquiries
        </h2>
  
        <p className="text-sm text-muted">
          Customer questions, requests, and incoming messages.
        </p>
      </div>
  
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {inquiries.map((item) => (
          <Card.Root
            key={item.id}
            className="shadow-md backdrop-blur-lg bg-accent/20 dark:bg-white/10"
          >
            <Card.Header className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <p className="text-lg font-semibold">
                  Human: {item.ownerName}
                </p>
  
                <p className="text-sm text-muted">
                  {item.email}
                </p>
              </div>
  
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">
                  Dog: {item.dogName}
                </p>
  
                <p className="text-xs text-muted">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Card.Header>
  
            <Separator />
  
            <Card.Content className="pt-4">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {item.inquiry}
              </p>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </section>
  );
}