"use client"

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
    createdAt: string | Date;
  };

const columns = [
  { uid: "name", name: "Carrier" },
  { uid: "item", name: "Item" },
  { uid: "createdAt", name: "Date" },
];

export default function CarryList({ items }: { items: Iterable<Item> }) {
  

  return (
    
    <Table isStriped aria-label="Items table">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>
      <TableBody items={items}>
        {(row) => (
          <TableRow key={row.id}>
            {(columnKey) => {
              const value = row[columnKey as keyof Item];
              return <TableCell>{String(value)}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}