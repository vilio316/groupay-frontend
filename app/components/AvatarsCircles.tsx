export default function Avatars({ className }: { className?: string }) {
  return (
    <div className={`avatars flex m-1 ${className} items-center`}>
      <Avatar string="C" />
      <Avatar string="A" />
      <Avatar string="E" />
      <Avatar string="+9" />
    </div>
  );
}

function Avatar({ string }: { string: string }) {
  return (
    <div className="avatar h-7 w-7 rounded-full flex border-2 border-solid border-white items-center justify-center font-bold -mr-2 bg-green/60 text-white">
      <span>{string}</span>
    </div>
  );
}
