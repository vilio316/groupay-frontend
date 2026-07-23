import { organizationClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        phone: {
          type: "string",
        },
      },
    }),
    organizationClient(),
  ],
});

export const { signIn, signOut, signUp, getSession, useSession } = authClient;
