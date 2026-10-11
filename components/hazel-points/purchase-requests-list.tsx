"use client"

import { Button, Card, Link } from "@heroui/react"
import { useState } from "react"
import ApproveRequestButton from "@/components/hazel-points/approve-request-button"

type PurchaseRequest = {
    id: number
    approved: boolean
    item: {
        name: string
        image: string
        cost: number
        link: string | null
    }
}

type PurchaseRequestsListProps = {
    initialRequests: PurchaseRequest[]
}

export default function PurchaseRequestsList({
    initialRequests,
}: PurchaseRequestsListProps) {
    const [requests, setRequests] = useState(initialRequests)
    const [showApproved, setShowApproved] = useState(false)
    const [feedback, setFeedback] = useState<{
        type: "success" | "error"
        message: string
    } | null>(null)
    const approvedCount = requests.filter((request) => request.approved).length
    const visibleRequests = requests.filter(
        (request) => request.approved === showApproved,
    )

    const markApproved = (requestId: number) => {
        setRequests((currentRequests) =>
            currentRequests.map((request) =>
                request.id === requestId ? { ...request, approved: true } : request,
            ),
        )
        setFeedback({ type: "success", message: "Request approved." })
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 px-4 text-left">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold">
                    {showApproved ? "Approved Requests" : "Purchase Requests"} (
                    {visibleRequests.length})
                </h1>
                <Button
                    variant="secondary"
                    onPress={() => {
                        setShowApproved((current) => !current)
                        setFeedback(null)
                    }}
                >
                    {showApproved
                        ? "Show pending requests"
                        : `Show approved requests (${approvedCount})`}
                </Button>
            </div>

            {feedback && (
                <p
                    role="status"
                    aria-live="polite"
                    className={`text-sm ${feedback.type === "success" ? "text-success" : "text-danger"}`}
                >
                    {feedback.message}
                </p>
            )}

            {visibleRequests.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleRequests.map((request) => (
                        <Card key={request.id} className="overflow-hidden">
                            <img
                                src={request.item.image}
                                alt={request.item.name}
                                className="aspect-[4/3] w-full object-cover"
                            />
                            <Card.Header>
                                <Card.Title>{request.item.name}</Card.Title>
                                <Card.Description>{request.item.cost} points</Card.Description>
                            </Card.Header>
                            {request.item.link && (
                                <Card.Content>
                                    <Link
                                        href={request.item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View item
                                    </Link>
                                </Card.Content>
                            )}
                            <Card.Footer>
                                <ApproveRequestButton
                                    requestId={request.id}
                                    approved={request.approved}
                                    onApproved={() => markApproved(request.id)}
                                    onError={(message) =>
                                        setFeedback(
                                            message ? { type: "error", message } : null,
                                        )
                                    }
                                />
                            </Card.Footer>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted">
                    {showApproved ? "No approved requests yet." : "No pending requests."}
                </p>
            )}
        </div>
    )
}