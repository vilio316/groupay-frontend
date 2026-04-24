import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="p-2 grid items-center h-full">
      <div>
        <div>
          <p>Sign In</p>
          <p>Log back in to your acccount</p>
        </div>
        <form className="grid">
          <label>Email</label>
          <input type="email" />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
          <button>Log In</button>
          <p>
            Don't have an account? <Link href="/auth/sign-up">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
