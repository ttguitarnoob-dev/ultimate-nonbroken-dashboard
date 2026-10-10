import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type BubblesInquiry = {
  id: string;
  ownerName: string;
  dogName: string;
  email: string;
  inquiry: string;
  createdAt: Date;
}

export type BubblesAppointment = {
  id: string;

  ownerName: string;
  email: string;
  phoneNumber?: string | null;

  dogName: string;

  furLength: "SHORT" | "MEDIUM" | "LONG";
  dogSize: "SMALL" | "MEDIUM" | "LARGE";

  allergy: boolean;
  allergyDescription?: string | null;

  location: string;
  additionalDetails: string;

  createdAt: Date;
  updatedAt: Date;

  slot: {
    id: string;
    startsAt: Date;
  };
};

export type HazelReward = {
  id: number;
  name: string;
  link?: string | null;
  image: string;
  cost: number;
}

export type CreateHazelRewardData = Omit<HazelReward, "id">;

export interface LogItem {
  timestamp: string | Date;
  message: string;
}