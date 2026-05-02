import ClusterCreateSuccessCard, {
  ClusterCreateFailureCard,
} from "@/app/components/ClusterCreateStatusCards";
import SpinnerLoader from "@/app/components/SpinnerLoader";
import { soraClass } from "@/app/fonts";
import {
  BasketIcon,
  CreditCardIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";

export default function NewClusterPage() {
  return (
    <>
      <div className="py-4 px-6 border-2 border-card-border place-self-center w-3/4 shadow-card-border shadow-2xl rounded-xl max-h-3/4">
        <p
          className={`${soraClass} font-bold text-2xl my-4 text-green flex gap-2`}
        >
          <UsersThreeIcon weight="duotone" />
          Create A New Cluster
        </p>
        <div>
          <form>
            <label
              htmlFor="clusterFunct"
              className="font-semibold text-sm text-ink-mid block my-2 uppercase"
            >
              Cluster Name
            </label>
            <input
              type="text"
              id="clusterFunct"
              autoFocus
              placeholder="The name of your cluster"
              className="w-3/4 block mb-4 mt-2 p-2 indent-4 border-card-border border-2 rounded-[10px] outline-none focus:border-green"
            />

            <div className="my-3">
              <label className="font-semibold text-sm text-ink-mid block my-3 uppercase">
                {" "}
                What's this Cluster for?
              </label>
              <div className="flex items-center gap-x-4  group border border-card-border w-3/5 my-4 p-2 rounded-xl hover:border-2 hover:border-green hover:translate-y-0.5 transition-all duration-75">
                <input type="radio" name="purpose" id="subs" />
                <label htmlFor="subs">
                  <div className="flex gap-x-3 items-center">
                    <CreditCardIcon
                      weight="duotone"
                      className="fill-green w-6 h-6"
                    />
                    <p className="text-xl">Subscriptions </p>
                  </div>
                  <p>
                    For recurring local and international payments. Comes with a
                    virtual card
                  </p>
                </label>
              </div>

              <div className="flex items-center gap-x-4 group border border-card-border p-2 rounded-xl hover:border-2 hover:border-green hover:translate-y-0.5 transition-all duration-75 w-3/5">
                <input type="radio" name="purpose" id="general" />
                <label htmlFor="general">
                  <div className="flex gap-x-3 items-center">
                    <BasketIcon
                      className="w-6 h-6 fill-green"
                      weight="duotone"
                    />
                    <p className="text-xl">General Purpose</p>
                  </div>
                  <p>
                    Multipurpose cash bucket suitable for collections, savings
                    or long-term holdings
                  </p>
                </label>
              </div>
            </div>
            <label
              htmlFor="clusterFunct"
              className="font-semibold text-sm text-ink-mid block my-3 uppercase"
            >
              Cluster Description
            </label>
            <input
              type="text"
              id="clusterDesc"
              placeholder="A brief description for the members of your cluster..."
              className="w-3/4 block mb-4 p-2 indent-4 border-card-border focus:border-green border-2 rounded-[10px] outline-none"
            />

            <button
              className="text-white flex gap-x-2 bg-green items-center p-3 rounded-[10px] font-bold text-center uppercase hover:bg-greener hover:translate-y-px transition-all"
              type="submit"
            >
              Create Cluster
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
