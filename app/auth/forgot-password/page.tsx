import { soraClass } from "@/app/fonts";

export default function ForgotPassword() {
  return (
    <div className="items-center grid p-2 h-3/4 md:h-auto">
      <div>
        <p className={`text-2xl my-2 ${soraClass} font-bold text-forest`}>
          Forgot Password?
        </p>
        <p>
          Enter your email address in the field below to reset your password
        </p>
        <input
          type="email"
          className="rounded-2xl outline-none border border-card-border focus:border-green w-full md:w-3/4 p-2 my-1"
          placeholder="Enter your email here"
        />
        <button className="text-white font-bold hover:bg-greener bg-green hover:scale-105 block p-2 md:rounded-2xl rounded-xl justify-self-center my-2 w-1/2">
          Confirm
        </button>
      </div>
    </div>
  );
}
