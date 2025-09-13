"use client"

import { useState } from "react";
import { createCarryItem } from "@/app/lib/server-actions";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

export default function NewCarryItemForm() {
  const [name, setName] = useState("");
  const [item, setItem] = useState("");

  async function handleSubmit() {
    try {
      await createCarryItem({ name, item });
      
      // Optionally reset form or show success message here
    } catch (error) {
      console.error("Submission failed:", error);
    }
  }

  return (
    <section className="flex flex-col gap-4 max-w-sm">
      <Input
        label="Your Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        label="Item Carried"
        type="text"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <Button onPress={handleSubmit} disabled={name == "" || item == ""}>Submit</Button>
    </section>
  );
}