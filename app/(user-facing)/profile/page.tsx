import { soraClass } from "@/app/fonts";
export default function ProfilePage() {
  return (
    <div className="p-3 h-full">
      <p className={`text-3xl ${soraClass} font-bold text-green my-3`}>
        Your Profile
      </p>
      <div className="flex gap-4 items-center p-4 border border-card-border rounded-xl shadow-sm shadow-green/40">
        <div>
          <img
            className="rounded-full h-28 w-28 object-cover"
            src="/family.jpg"
          />
        </div>
        <div>
          <p className="text-xl font-bold">UserNames</p>
          <p className="text-ink-mid font-semibold">@username</p>
          <p>
            Member in 5+ Clusters, including{" "}
            <span className="font-semibold text-green">mostActive </span>
          </p>
        </div>
      </div>
    </div>
  );
}
