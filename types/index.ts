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