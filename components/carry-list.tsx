"use client"

import { Link, Table } from "@heroui/react";

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
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Items table" className="min-w-[640px]">
          <Table.Header>
            {columns.map((column) => (
              <Table.Column key={column.uid} isRowHeader={column.uid === "name"}>
                {column.name}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            {items.map((row) => (
              <Table.Row key={row.id} id={String(row.id)}>
                <Table.Cell>{row.name}</Table.Cell>
                <Table.Cell>{row.item}</Table.Cell>
                <Table.Cell>
                  {row.imageURL ? (
                    <Link href={`/carry-list/${row.id}`} aria-label={`View ${row.item}`}>
                      <img
                        src={row.imageURL}
                        alt={row.item}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </Link>
                  ) : (
                    "-"
                  )}
                </Table.Cell>
                <Table.Cell>{new Date(row.createdAt).toLocaleDateString()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}