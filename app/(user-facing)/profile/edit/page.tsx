"use client";
import { authClient, useSession } from "@/lib/authClient";
import { soraClass } from "../../../fonts";
import { EyeClosedIcon, EyeIcon, FileArrowUpIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function EditPage() {
  const { data } = useSession();
  const [isViewing, viewPassword] = useState(false);
  const [isViewingNew, viewNewPassword] = useState(false);
  const [password, updatePwd] = useState("");
  const [newPassword, updateNewPwd] = useState("");

  return (
    <div className="h-full p-2">
      <p className={`${soraClass} text-3xl text-green my-2 font-bold`}>
        Edit Profile Details
      </p>
      <div className="border border-card-border rounded-2xl p-2">
        <div className="flex gap-x-4 gap-y-2 md:flex-row flex-col">
          <div className="relative group">
            <div className="absolute hidden group-hover:flex top-0 left-0 rounded-full items-center justify-center bg-gray-500/70 text-white h-24 w-24">
              <label className="text-center grid justify-center">
                <FileArrowUpIcon
                  weight="fill"
                  className="text-2xl justify-self-center fill-green text-white"
                />
                <span className="text-[10px]">Add new file here</span>
                <input
                  type="file"
                  name="imageFile"
                  id="heh"
                  className="hidden"
                  accept=".jpg, .jpeg, .png, .heic, .jfif "
                />
              </label>
            </div>
            <img src="/family.jpg" className="rounded-full md:h-24 md:w-24" />
          </div>
          <div>
            <p className={`${soraClass} my-2 font-bold text-xl`}>
              Edit User Details
            </p>
            <label>First Name</label>
            <input
              type="text"
              readOnly
              className="w-full p-2 indent-3 border border-card-border focus:border-green rounded-2xl outline-none"
              defaultValue={data?.user.name.split(" ")[0]}
            />
            <label>Last Name</label>
            <input
              type="text"
              readOnly
              className="w-full p-2 indent-3 border border-card-border focus:border-green rounded-2xl outline-0"
              defaultValue={data?.user.name.split(" ")[1]}
            />
            <section className="my-2 px-1">
              <p className={`${soraClass} my-1 font-bold`}>Change Password</p>
              <label>Existing Password</label>
              <div className="flex items-center gap-x-2">
                <input
                  type={`${isViewing ? "text" : "password"}`}
                  onChange={(e) => updatePwd(e.target.value)}
                  className="w-full p-2 indent-3 border border-card-border focus:border-green rounded-2xl outline-0"
                />
                <button
                  className="p-1"
                  onClick={() => viewPassword(!isViewing)}
                >
                  {isViewing ? (
                    <EyeClosedIcon
                      weight="light"
                      className="h-8 w-8 text-2xl"
                    />
                  ) : (
                    <EyeIcon weight="light" className="h-8 w-8 text-2xl" />
                  )}
                </button>
              </div>

              <label>New Password</label>
              <div className="flex items-center gap-x-2">
                <input
                  type={`${isViewingNew ? "text" : "password"}`}
                  onChange={(e) => updateNewPwd(e.target.value)}
                  className="w-full p-2 indent-3 border border-card-border focus:border-green rounded-2xl outline-0"
                />
                <button
                  className="p-1"
                  onClick={() => viewNewPassword(!isViewingNew)}
                >
                  {isViewingNew ? (
                    <EyeClosedIcon
                      weight="light"
                      className="h-8 w-8 text-2xl"
                    />
                  ) : (
                    <EyeIcon weight="light" className="h-8 w-8 text-2xl" />
                  )}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
      <button
        className="bg-green hover:bg-greener hover:scale-105 text-white p-2 rounded-2xl my-4"
        onClick={async () => {
          console.log("attempting!");
          if (
            password !== newPassword &&
            newPassword.length >= 8 &&
            password.length >= 8
          ) {
            try {
              await authClient.changePassword(
                {
                  newPassword: newPassword,
                  currentPassword: password,
                  revokeOtherSessions: true,
                },
                {
                  onSuccess: () => console.log("Pwd changed successfully"),
                  onError: (e) => alert(e.error.message),
                },
              );
            } catch (error) {
              console.log(error);
            }
          }
        }}
      >
        Save Changes
      </button>
    </div>
  );
}
