export default function Avatars({ className }: { className?: string }) {
  return (
    <div className={`avatars flex m-1 ${className} items-center`}>
      <Avatar string="C" className="bg-red" />
      <Avatar string="A" className="bg-green" />
      <Avatar string="E" className="bg-yellow-300" />
      <Avatar string="+9" className="bg-teal" />
    </div>
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
