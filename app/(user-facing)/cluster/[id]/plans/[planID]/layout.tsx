import React from "react";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    id: string;
    planID: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, planID } = await params;
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${id}/plans/${planID}`,
  );
  const response = await request.json();

  return {
    title: `${response.name} : Plan Page`,
  };
}

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
