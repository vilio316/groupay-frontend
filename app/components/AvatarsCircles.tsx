import { ClusterMember } from "../(user-facing)/cluster/[id]/ClusterDetailsClient";

export default function Avatars({
  className,
  members,
}: {
  className?: string;
  members: ClusterMember[];
}) {
  return (
    <>
      {members && members.length > 0 ? (
        <div
          className={`avatars flex m-1 ${className} items-center`}
          title={
            members &&
            `${members[0].user.name} ${members.length > 1 && `and ${members.length - 1} others are here`}`
          }
        >
          {members &&
            members?.map((member) => (
              <Avatar
                string={member.user.name.charAt(0)}
                className="bg-green/50"
                key={member.userId}
              />
            ))}
        </div>
      ) : (
        <p className="md:text-[12px] text-[10px]">No Members</p>
      )}
    </>
  );
}

function Avatar({ string, className }: { string: string; className?: string }) {
  return (
    <div
      className={`avatar lg:h-7 lg:w-7 h-5 w-5 rounded-full flex border-2 border-solid border-white items-center justify-center font-bold lg:-mr-2 -mr-1.25 text-white ${className}`}
    >
      <span>{string}</span>
    </div>
  );
}
