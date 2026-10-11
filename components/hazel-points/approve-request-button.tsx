"use client"

import { approvePurchaseRequest } from "@/app/lib/server-actions"
import { Button, Spinner } from "@heroui/react"
import { useState } from "react"

type ApproveRequestButtonProps = {
    requestId: number
    approved: boolean
    onApproved: () => void
    onError: (message: string) => void
}

export default function ApproveRequestButton({
    requestId,
    approved,
    onApproved,
    onError,
}: ApproveRequestButtonProps) {
    const [isPending, setIsPending] = useState(false)

    const handleApprove = async () => {
        setIsPending(true)
        onError("")
        try {
            await approvePurchaseRequest(requestId)
            onApproved()
        } catch {
            onError("Could not approve this request. Please try again.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Button className="w-full" isDisabled={approved || isPending} onPress={handleApprove}>
            {isPending && <Spinner size="sm" />}
            {isPending ? "Approving..." : approved ? "Approved" : "Approve"}
        </Button>
    )
}