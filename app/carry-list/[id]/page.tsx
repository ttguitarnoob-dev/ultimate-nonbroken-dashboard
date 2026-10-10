import { GetCarryItem } from "@/app/lib/server-actions"
import { Link } from "@heroui/react"



interface PageProps {
  params: {
    id: string
  }
}

// Server Component for dynamic route /carry/[id]
export default async function CarriedItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const item = await GetCarryItem(id)

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl">{item.item}</h2>
      <p>Carrier: {item.name}</p>
      {item.imageURL && ( //it's fine bro
        <img
          src={item.imageURL}
          alt={item.item}
          className="h-auto max-w-full"
        />
      )}
      {/* Add any other fields you have */}
      <Link className="button button--primary" href="/carry-list">Done</Link>
    </section>
  )
}