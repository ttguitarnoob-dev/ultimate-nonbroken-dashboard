"use server"
import { prisma } from "./db";

//CREATE CARRY ITEM

export async function createCarryItem({
  name,
  item,
  imageURL,
}: {
  name: string;
  item: string;
  imageURL?: string;
}) {
  try {
    console.log("SWARTING ", name, item, imageURL)
    

   
    


    // Create the CarryItem in Prisma
    const newCarryItem = await prisma.carryItem.create({
      data: {
        name,
        item,
        imageURL, // save the uploaded image URL
      },
    });

    // Revalidate the page
    revalidatePath("/carry-list");

    return newCarryItem;
  } catch (error) {
    console.error("Error creating CarryItem:", error);
    throw new Error("Failed to create CarryItem");
  }
}

import { revalidatePath } from "next/cache";

// GET ONE CARRY ITEM
export async function GetCarryItem(carryItemId: string) {
  if (!carryItemId) {
    throw new Error("carryItemId is required")
  }

  const carryItem = await prisma.carryItem.findUnique({
    where: {
      id: carryItemId,
    },
  })

  if (!carryItem) {
    throw new Error("CarryItem not found")
  }

  return carryItem
}

//GET CARRY ITEMS
export async function GetCarryItems() {

    try {
        const items = await prisma.carryItem.findMany({
          orderBy: {
            createdAt: 'desc', // Optional: sort newest first
          },
        });
        return items;
      } catch (error) {
        console.error('Error retrieving CarryItems:', error);
    
        // Optionally, rethrow a custom error if you're using error boundaries or want better control
        throw new Error('Failed to retrieve carry items from the database.');
      } finally {
        await prisma.$disconnect();
      }
}

// FETCH HAZELTUBE LIST

export async function getHazelTube() {
  try {
    const queues = await prisma.hazelTube.findMany({
      where: {
        id: { in: [1, 2] },
      },
    });

    const byId = Object.fromEntries(
      queues.map(q => [q.id, q])
    );

    return {
      video: byId[1] ?? null,
      audio: byId[2] ?? null,
    };
  } catch (error) {
    console.error("Error fetching video queues:", error);
    throw error;
  }
}

// FETCH ALL HAZELSEARCH
export async function fetchHazelSearch() {
  console.log("SERACING THESERDH")
  try {
    const searches = await prisma.hazelSearch.findMany({
      orderBy: {
        createdAt: "desc", // optional, remove if you don't have this field
      },
    });

    return {
      success: true,
      data: searches,
    };
  } catch (error) {
    console.error("Error fetching HazelSearch records:", error);

    return {
      success: false,
      data: [],
      error: "Failed to fetch HazelSearch records.",
    };
  }
}

 
// LOG HAZELSEARCH
export async function logHazelSearch(query: string) {

  console.log("SHESERCH", query)
  try {
    if (!query || query.trim().length === 0) {
      throw new Error("Query is required")
    }

    const search = await prisma.hazelSearch.create({
      data: {
        query: query.trim(),
      },
    })

    return search
  } catch (error) {
    console.error("Failed to log Hazel search:", error)

    // Optional: rethrow if you want upstream handling
    throw new Error("Unable to log search")
  }
}



//ADD VIDEO TO HAZELTUBE LIST

export async function addToHazelTube(videoId: string, isAudio: boolean) {
  if (!videoId) throw new Error("videoId is required");

  try {
    // Fetch current array
    const queue = await prisma.hazelTube.findUnique({
      where: {
        id: isAudio ? 2 : 1,
      },
    });
    

    if (!queue) {
      throw new Error("Video queue not found");
    }

    // Prevent duplicates
    if (queue.videoIds.includes(videoId)) {
      return queue; // already in the array
    }

    // Append new ID
    const updatedQueue = await prisma.hazelTube.update({
      where: {
        id: isAudio ? 2 : 1,
      },
      data: {
        videoIds: [...queue.videoIds, videoId],
      },
    });
    

    return updatedQueue;
  } catch (error) {
    console.error("Failed to add video to queue:", error);
    throw error;
  }
}

// REMOVE AN ITEM FROM HAZELTUBE LIST

export async function removeFromHazelTube(videoId: string, isAudio: boolean) {
  if (!videoId) throw new Error("videoId is required");

  try {
    // Fetch current queue
    const queue = await prisma.hazelTube.findUnique({
      where: {
        id: isAudio ? 2 : 1,
      },
    });

    if (!queue) {
      throw new Error("Video queue not found");
    }

    // Remove the ID from the array
    const updatedVideoIds = queue.videoIds.filter((id) => id !== videoId);

    // Update the row
    const updatedQueue = await prisma.hazelTube.update({
      where: {
        id: isAudio ? 2 : 1,
      },
      data: {
        videoIds: updatedVideoIds,
      },
    });

    return updatedQueue;
  } catch (error) {
    console.error("Failed to remove video from queue:", error);
    throw error;
  }
}

// DOWNLOAD ONE VIDEO
export interface DownloadApiResponse {
  message: string;
  url: string;
  bitrate: string;
  resolution: string;
}

export async function downloadHazelTube(url: string, isAudio: boolean): Promise<string> {
  const endpoint = isAudio ? "https://nogogglevids.kitty-cottage.com/audio" : "https://nogogglevids.kitty-cottage.com/hazeltube";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url
      }),
    });

    if (!response.ok) {
      // HTTP-level error
      return `HTTP error: ${response.status} ${response.statusText}`;
    }

    const data: DownloadApiResponse = await response.json();
    console.log("API MESSAGE!", data.message)
    return data.message;
  } catch (error) {
    // Network or unexpected error
    return (error instanceof Error) ? error.message : String(error);
  }
}

// Download my videos

export async function downloadMyVid(url: string, resolution: string): Promise<string> {
  try {
    const response = await fetch("https://nogogglevids.kitty-cottage.com/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        resolution
      }),
    });

    if (!response.ok) {
      // HTTP-level error
      return `HTTP error: ${response.status} ${response.statusText}`;
    }

    const data: DownloadApiResponse = await response.json();
    console.log("API MESSAGE!", data.message)
    return data.message;
  } catch (error) {
    // Network or unexpected error
    return (error instanceof Error) ? error.message : String(error);
  }
}