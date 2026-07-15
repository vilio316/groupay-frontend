import React from "react";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/clusters/${id}`,
  );
  const response = await request.json();

  return {
    title: `${response.name} : Cluster Page`,
  };
}

export default function ClusterLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return <>{children}</>;
}
