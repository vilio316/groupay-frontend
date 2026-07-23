"use client";

import { soraClass } from "@/app/fonts";
import { signOut } from "@/lib/authClient";
import { usePathname, redirect } from "next/navigation";
import {
  HouseLineIcon,
  UserIcon,
  UsersThreeIcon,
  ArticleIcon,
  BellIcon,
  GearIcon,
  SignOutIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useNotifications } from "@/app/NotificationsProvider";
import { useSession } from "@/lib/authClient";
import { useState } from "react";
import ThemeToggle from "@/app/components/ThemeToggle";

const bottomLinks = [{ href: "/profile", label: "Settings", Icon: GearIcon }];

export default function Sidebar() {
  const pathname = usePathname();
  const { data } = useSession();
  const { unreadCount } = useNotifications();
  const [loading, updateLoading] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Home", Icon: HouseLineIcon },
    { href: "/profile", label: "Profile", Icon: UserIcon },
    { href: "/kyc", label: "Verification", Icon: ShieldCheckIcon },
    { href: "/clusters", label: "Your Clusters", Icon: UsersThreeIcon },
    { href: "/plans", label: "Your Plans", Icon: ArticleIcon },
    {
      href: "/notifications",
      label: "Notifications",
      Icon: BellIcon,
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className="flex flex-col h-screen w-72 mr-4 bg-white dark:bg-surface border-r border-[#e8efe8] dark:border-[#1a2e24] px-3 py-4 shrink-0 z-20 transition-colors"
      style={{ boxShadow: "1px 0 0 0 #e8efe8" }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 px-3 py-2 mb-6">
        <div className="bg-green h-8 w-8 rounded-lg flex items-center justify-center shadow-md shadow-green/25 shrink-0">
          <svg viewBox="0 0 20 20" className="fill-white h-4 w-4">
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm-1 3v4l3.5 2-.7 1.2L8 12.2V7h1z" />
          </svg>
        </div>
        <Link
          href="/dashboard"
          className={`${soraClass} font-bold text-[18px] leading-none tracking-tight`}
        >
          GrouPay
        </Link>
      </div>

      {/* ── Section label ── */}
      <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-ink-mid/50 mb-2">
        Menu
      </p>

      {/* ── Main nav ── */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navLinks.map(({ href, label, Icon, badge }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${
                  active
                    ? "bg-forest text-white shadow-md shadow-forest/20 dark:text-white font-semibold"
                    : "text-ink-mid dark:text-green hover:bg-[#f0f7f0] dark:hover:bg-[#1a2e24] hover:font-bold"
                }
              `}
            >
              {/* Active left accent bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-green rounded-r-full" />
              )}

              <Icon
                weight={active ? "fill" : "regular"}
                className={`h-4.5 w-4.5 shrink-0 transition-transform duration-150 ${
                  active ? "text-white" : "text-ink-mid group-hover:scale-110"
                }`}
              />

              <span className="flex-1">{label}</span>

              {/* Notification badge */}
              {badge && badge > 0 && (
                <span
                  className={`
                    text-[10px] font-bold min-w-4.5 h-4.5 px-1 rounded-full
                    flex items-center justify-center leading-none
                    ${active ? "bg-green text-white" : "bg-green/15 text-green"}
                  `}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div className="my-3 h-px bg-[#e8efe8] dark:bg-[#1a2e24]" />

      {/* ── Bottom: Theme + Settings + Sign out ── */}
      <div className="flex flex-col gap-0.5">
        <ThemeToggle />

        {bottomLinks.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150
                ${
                  active
                    ? "bg-forest text-white shadow-md shadow-forest/20"
                    : "text-ink-mid hover:bg-[#f0f7f0] dark:hover:bg-[#1a2e24] hover:text-forest"
                }
              `}
            >
              <Icon
                weight={active ? "fill" : "regular"}
                className={`h-4.5 w-4.5 shrink-0 transition-transform duration-150 ${
                  active
                    ? "text-white"
                    : "text-ink-mid group-hover:text-forest group-hover:scale-110"
                }`}
              />
              <span>{label}</span>
            </Link>
          );
        })}

        <button
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-mid hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150 w-full text-left"
          onClick={async (e) => {
            e.preventDefault();
            updateLoading(true);
            await signOut({
              fetchOptions: {
                onSuccess: () => {
                  updateLoading(false);
                  redirect("/auth/sign-in");
                },
              },
            });
          }}
        >
          {loading ? (
            <div>
              <span className="w-5 h-5 rounded-full animate-spin border-2 border-white border-t-red" />{" "}
              Signing out...
            </div>
          ) : (
            <>
              <SignOutIcon className="h-4.5 w-4.5 shrink-0 text-ink-mid group-hover:text-red-500 dark:group-hover:text-red-400 group-hover:scale-110 transition-transform duration-150" />
              <span>Sign Out</span>
            </>
          )}
        </button>
      </div>

      {/* ── User pill at very bottom ── */}
      <div className="mt-3 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#f5faf5] dark:bg-[#0f1f16] border border-[#e8efe8] dark:border-[#1a2e24] transition-colors">
        <div className="h-8 w-8 rounded-full bg-linear-to-br from-teal to-green flex items-center justify-center text-white text-xs font-bold shrink-0">
          U
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`${soraClass} text-[13px] font-semibold truncate leading-tight`}
          >
            {data?.user.name ? data.user.name : "User Account"}
          </p>
          <p className="text-[11px] text-ink-mid/70 truncate leading-tight">
            Tier 1
          </p>
        </div>
        <Link
          href="/profile"
          className="shrink-0 text-ink-mid/50 hover:text-forest transition-colors"
          aria-label="Account settings"
        >
          <GearIcon className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
