import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react/dist/ssr";
import { soraClass } from "../fonts";

export function InviteRejectedCard() {
  return (
    <div className="max-h-3/4 w-3/4 mx-auto border border-card-border shadow-xl shadow-card-border rounded-xl md:px-6 py-4 text-center">
      <div className="flex justify-center">
        <XCircleIcon className="h-18 w-18 fill-red" />
      </div>
      <p className={`${soraClass} text-3xl my-4`}>
        You rejected <span>ClusterMember</span>'s Invite
      </p>
      <p>
        They will be notified of this soon. Would you also like to prevent them
        from sending you Cluster invites in the future?
      </p>
      <div className="flex justify-center gap-x-8 p-2">
        <div>
          <input type="radio" name="sendInvitesFuture" id="yes" />
          <label>Yes</label>
        </div>

        <div>
          <input type="radio" name="sendInvitesFuture" id="no" />
          <label>No</label>
        </div>
      </div>

      <button className="rounded-xl text-white bg-teal hover:scale-x-105 p-2 w-1/4 my-6">
        Confirm
      </button>
    </div>
  );
}

export function InviteAcceptedCard() {
  return (
    <div className="max-h-3/4 w-3/4 mx-auto border border-card-border shadow-xl shadow-card-border rounded-xl md:px-6 py-4 text-center">
      <div className="flex justify-center">
        <CheckCircleIcon className="h-18 w-18 fill-green" />
      </div>
      <p className={`${soraClass} text-3xl my-4`}>
        You accepted <span>ClusterMember</span>'s Invite!
      </p>
      <p>
        Click the button below to confirm this. You will beredirected to the
        Cluster's homepage immediately after.
      </p>

      <button className="rounded-xl text-white bg-teal hover:scale-x-105 p-2 w-1/4 my-6">
        Confirm
      </button>
    </div>
  );
}
