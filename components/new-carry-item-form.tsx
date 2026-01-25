"use client"

import { useState } from "react";
import { createCarryItem } from "@/app/lib/server-actions";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

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
      <Input
        label="Add Image As Proof"
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
          } else {
            setFile(null);
          }
        }}
      />
      
      <Button onPress={handleSubmit} isLoading={isLoading} disabled={!name || !item}>
        Submit
      </Button>
    </section>
  );
}