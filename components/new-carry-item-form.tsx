"use client"

import { useState } from "react";
import { createCarryItem } from "@/app/lib/server-actions";
import { Button, Input, Label, TextField } from "@heroui/react";

export default function NewCarryItemForm() {
  const [name, setName] = useState("");
  const [item, setItem] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit() {
    setIsLoading(true)
    try {
      let imageURL = ""
      if (file) {
            console.log("GOTFILE")
            const formData = new FormData();
            formData.append("file", file);
      
      
            const uploadRes = await fetch("https://uploadyimage.kitty-cottage.com/upload", {
              method: "POST",
              body: formData,
            });
      
            console.log("RESPSON", uploadRes)
      
            if (!uploadRes.ok) {
              const errData = await uploadRes.json();
              throw new Error(errData.error || "File upload failed");
            }
      
            const data = await uploadRes.json();
            imageURL = data.url;
            
          }
      // You can send the file along with other data
      await createCarryItem({ name, item, imageURL });
      
      // Reset form or show success message
      setName("");
      setItem("");
      setFile(null);
    } catch (error) {
      console.error("Submission failed:", error);
    }
    setIsLoading(false)
  }

  return (
    <section className="flex flex-col gap-4 max-w-sm">
      <TextField>
        <Label>Your Name</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </TextField>
      <TextField>
        <Label>Item Carried</Label>
        <Input
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
      </TextField>
      <TextField>
        <Label>Add Image As Proof</Label>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </TextField>
      
      <Button onPress={handleSubmit} isPending={isLoading} isDisabled={!name || !item}>
        Submit
      </Button>
    </section>
  );
}