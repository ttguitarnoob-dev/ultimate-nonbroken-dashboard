"use server"

//CREATE CARRY ITEM

export async function createCarryItem({
  name,
  item,
}: {
  name: string;
  item: string;
}) {
  try {
    const newCarryItem = await prisma.carryItem.create({
      data: {
        name,
        item,
      },
    });
    revalidatePath("/carry-list")
    return newCarryItem;
  } catch (error) {
    console.error('Error creating CarryItem:', error);
    throw new Error('Failed to create CarryItem');
  }
}

import { revalidatePath } from "next/cache";
//GET CARRY ITEMS

import { prisma } from "./db";

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