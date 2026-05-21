"use client";
export default function EmptyClusters() {
  return (
    <div className="p-4 text-center border-2 border-card-border rounded-xl my-4 mx-4">
      <p className="text-center font-semibold p-1 my-2 text-2xl ">
        No Clusters Yet{" "}
      </p>
      <p className="text-xl">
        Click the "+" button to create your own Cluster or join a friend's via
        their invite link
      </p>
    </div>
  );
}
