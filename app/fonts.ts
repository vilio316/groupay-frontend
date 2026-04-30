import { Sora, Inter } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
});

export const { className: soraClass } = sora;
export const inter = Inter({
  subsets: ["latin"],
  weight: "500",
});
