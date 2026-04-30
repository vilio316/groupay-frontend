import { soraClass } from "@/app/fonts";
import { BellSimpleSlashIcon } from "@phosphor-icons/react/dist/ssr";

export default function NotificationsPage() {
  return (
    <div className="grid h-full">
      <div>
        <p className={`font-bold ${soraClass} text-green text-3xl my-3`}>
          Your Notifications
        </p>
        <div className="m-4 p-4 text-center border-2 border-card-border rounded-xl grid">
          <div className="grid justify-center">
            <BellSimpleSlashIcon
              className="h-16 w-16 fill-green"
              weight="duotone"
            />
          </div>
          <p className="font-semibold text-2xl p-1 my-2">
            No Recent Notifications
          </p>
          <p className="text-xl">
            Your most recent notifications will show up here
          </p>
        </div>
      </div>
    </div>
  );
}
