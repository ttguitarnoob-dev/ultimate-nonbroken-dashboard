"use client"

import { Image } from "@heroui/image";
import { Link } from "@heroui/link";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";

type Item = {
  id: string | number;
  name: string;
  item: string;
  imageURL?: string | null; // optional now
  createdAt: string | Date;
};

const columns = [
  { uid: "name", name: "Carrier" },
  { uid: "item", name: "Item" },
  { uid: "imageURL", name: "Proof" },
  { uid: "createdAt", name: "Date" },
];

export default function CarryList({ items }: { items: Item[] }) {
  return (
    <Table isStriped aria-label="Items table">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={items}>
        {(row) => (
          <TableRow key={row.id}>
            {(columnKey) => {
              // Special handling for the image column
              if (columnKey === "imageURL") {
                return (
                  <TableCell>
                    {row.imageURL ? (
                      <Link href={`/carry-list/${row.id}`} >
                        <Image
                          src={row.imageURL}
                          alt={row.item}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </Link>

                    ) : (
                      "—"
                    )}
                  </TableCell>
                );
              }

              const value = row[columnKey as keyof Item];
              return <TableCell>{String(value)}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}