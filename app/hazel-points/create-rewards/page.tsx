"use client";

import { CreateHazelReward } from "@/app/lib/server-actions";
import { CreateHazelRewardData, HazelReward } from "@/types";
import React, { useState } from "react";



export default function HazelRewardForm() {
  const [formData, setFormData] = useState<CreateHazelRewardData>({
    name: "",
    link: "",
    image: "",
    cost: 0,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const form = new FormData(event.currentTarget);

      const imageFile = form.get("image") as File | null;

      let imageUrl = "";

      if (imageFile && imageFile.size > 0) {
        const imageUploadData = new FormData();
        imageUploadData.append("file", imageFile);

        const uploadResponse = await fetch("https://uploadyimage.kitty-cottage.com/upload", {
          method: "POST",
          body: imageUploadData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.url;
      }

      const rewardData: CreateHazelRewardData = {
        name: form.get("name") as string,
        link: form.get("link") as string,
        cost: Number(form.get("cost")),
        image: imageUrl,
      };
      console.log("WHTAT", rewardData)

      await CreateHazelReward(rewardData);
    } catch (error) {
      console.error("Error submitting reward:", error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background text-foreground">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">
          Create Hazel Reward
        </h2>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Name</label>

          <input
            name="name"
            type="text"
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Link</label>

          <input
            name="link"
            type="url"
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700"
            value={formData.link}
            onChange={(e) =>
              setFormData({
                ...formData,
                link: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Points Cost
          </label>

          <input
            name="cost"
            type="number"
            min="0"
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700"
            value={formData.cost}
            onChange={(e) =>
              setFormData({
                ...formData,
                cost: Number(e.target.value),
              })
            }
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">Image</label>

          <input
            name="image"
            type="file"
            accept="image/*"
            className="w-full text-sm text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition duration-200 hover:bg-blue-700"
        >
          Create Reward
        </button>
      </form>
    </div>
  );
}