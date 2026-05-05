import { soraClass } from "@/app/fonts";
import { SignOutIcon } from "@phosphor-icons/react/dist/ssr";
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
      <div
        className={`p-3 border-2 border-card-border my-2 rounded-xl ${soraClass} font-bold h-75`}
        id="settings"
      >
        <p>Settings</p>
      </div>
      <div className="flex w-full items-center justify-center">
        <button className="flex gap-x-4 items-center text-red border-red border p-2 hover:text-white hover:bg-red transition-all rounded-xl my-4">
          <SignOutIcon className="h-6 w-6 " />
          Log Out
        </button>
      </div>
    </div>
  );
}
