import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Individual Cluster Page",
};

export default function ClusterLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  return <>{children}</>;
}
