import { getPurchaseRequests } from "@/app/lib/server-actions"
import PurchaseRequestsList from "@/components/hazel-points/purchase-requests-list"

export default async function RewardsRequestsPage() {
    const requests = await getPurchaseRequests()

    return (
        <PurchaseRequestsList
            initialRequests={requests.map(({ id, approved, item }) => ({
                id,
                approved,
                item: {
                    name: item.name,
                    image: item.image,
                    cost: item.cost,
                    link: item.link,
                },
            }))}
        />
    )
}