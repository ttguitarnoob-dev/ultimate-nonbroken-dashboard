"use client";

import { CreateHazelReward } from "@/app/lib/server-actions";
import { CreateHazelRewardData } from "@/types";
import {
  Alert,
  Button,
  Form,
  Input,
  Label,
  NumberField,
  Spinner,
  TextField,
} from "@heroui/react";
import React, { useState } from "react";

export default function HazelRewardForm() {
  const [formData, setFormData] = useState<Omit<CreateHazelRewardData, "image">>({
    name: "",
    link: "",
    cost: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const imageFile = form.get("image");
    setIsSubmitting(true);
    setFeedback(null);

    try {
      let imageUrl = "";

      if (imageFile instanceof File && imageFile.size > 0) {
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
        if (typeof uploadResult.url !== "string" || !uploadResult.url) {
          throw new Error("Image upload did not return a URL");
        }
        imageUrl = uploadResult.url;
      }

      const rewardData: CreateHazelRewardData = {
        ...formData,
        image: imageUrl,
      };

      await CreateHazelReward(rewardData);
      formElement.reset();
      setFormData({ name: "", link: "", cost: 0 });
      setFeedback({ type: "success", message: "Reward created successfully." });
    } catch (error) {
      console.error("Error submitting reward:", error);
      setFeedback({
        type: "error",
        message: "Could not create the reward. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background text-foreground">
      <Form
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
        className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">
          Create Hazel Reward
        </h2>

        <TextField isDisabled={isSubmitting} isRequired name="name">
          <Label>Name</Label>
          <Input
            id="reward-name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />
        </TextField>

        <TextField isDisabled={isSubmitting} name="link" type="url">
          <Label>Link</Label>
          <Input
            id="reward-link"
            value={formData.link ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                link: e.target.value ?? "",
              })
            }
          />
        </TextField>

        <NumberField
          className="w-full"
          isDisabled={isSubmitting}
          isRequired
          name="cost"
          value={formData.cost}
          onChange={(cost) =>
            setFormData({ ...formData, cost: cost ?? 0 })
          }
        >
          <Label>Points Cost</Label>
          <NumberField.Group className="w-full">
            <NumberField.DecrementButton />
            <NumberField.Input className="flex-1" id="reward-cost" />
            <NumberField.IncrementButton />
          </NumberField.Group>
        </NumberField>

        <div className="flex flex-col gap-1">
          <Label htmlFor="reward-image">Image</Label>
          <input
            id="reward-image"
            name="image"
            type="file"
            accept="image/*"
            className="w-full text-sm text-zinc-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            disabled={isSubmitting}
            required
          />
        </div>

        {feedback && (
          <Alert status={feedback.type === "success" ? "success" : "danger"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{feedback.message}</Alert.Title>
            </Alert.Content>
          </Alert>
        )}

        <Button
          className="w-full"
          isDisabled={isSubmitting}
          isPending={isSubmitting}
          type="submit"
          variant="primary"
        >
          {isSubmitting ? (
            <>
              <Spinner color="current" size="sm" />
              Creating...
            </>
          ) : (
            "Create Reward"
          )}
        </Button>
      </Form>
    </div>
  );
}