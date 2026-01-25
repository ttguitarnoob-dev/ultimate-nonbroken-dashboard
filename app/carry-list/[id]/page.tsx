import { GetCarryItem } from "@/app/lib/server-actions"
import { Button } from "@heroui/button"
import { Image } from "@heroui/image"
import { Link } from "@heroui/link"



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
      {item.imageURL && (
        <Image
          src={item.imageURL}
          alt={item.item}
        />
      )}
      {/* Add any other fields you have */}
      <Button as={Link} href="/carry-list">Done</Button>
    </section>
  )
}