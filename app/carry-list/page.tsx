import CarryList from "@/components/carry-list";
import NewCarryItemForm from "@/components/new-carry-item-form";
import { title } from "@/components/primitives";
import { GetCarryItems } from "../lib/server-actions";

export default async function CarryListPage() {
  type Item = {
    id: string | number;
    name: string;
    item: string;
    imageURL?: string | null; // optional
    createdAt: string;
  };

  // ✅ Await the promise
  const rawItems = await GetCarryItems();

  // ✅ Narrow down to Item[]
  const items: Item[] = rawItems.map((i) => ({
    id: i.id,
    name: i.name,
    item: i.item,
    imageURL: i.imageURL,
    createdAt: new Date(i.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className={title()}>Carry List</h1>
      <p>
        Add a reference to all the ridiculous things you carried back and
        forth and then laugh at it later
      </p>
      <NewCarryItemForm />
      <CarryList items={items} />
    </div>
  );
}