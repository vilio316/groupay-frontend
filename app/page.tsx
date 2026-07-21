"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { soraClass } from "./fonts";
import "./globals.css";

import { AirplaneIcon, ForkKnifeIcon, HouseIcon } from "@phosphor-icons/react";
import { useSession } from "@/lib/authClient";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { data } = useSession();

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.05,
        });

        tl.fromTo(
          ".hero-badge",
          { y: -24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55 },
        )
          .fromTo(
            ".hero-title",
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 },
            "-=0.25",
          )
          .fromTo(
            ".hero-subtitle",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65 },
            "-=0.45",
          )
          .fromTo(
            ".hero-actions",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            "-=0.35",
          )
          .fromTo(
            ".hero-stats .stat",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.12, duration: 0.4 },
            "-=0.25",
          )
          .fromTo(
            ".mockup-card",
            { y: 100, opacity: 0, scale: 0.92 },
            { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: "power4.out" },
            "-=0.3",
          );

        gsap.utils.toArray<HTMLElement>(".stat-count").forEach((el) => {
          const target = parseFloat(el.getAttribute("data-target") || "0");
          const isDecimal = el.getAttribute("data-decimal") === "true";
          const proxy = { val: 0 };
          gsap.to(proxy, {
            val: target,
            duration: 2.2,
            delay: 1.2,
            ease: "power2.out",
            onUpdate() {
              el.textContent = isDecimal
                ? proxy.val.toFixed(1)
                : String(Math.round(proxy.val));
            },
          });
        });

        gsap.to(".blob1", {
          x: 30,
          y: -50,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(".blob2", {
          x: -25,
          y: 30,
          duration: 11,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(".blob3", {
          x: 35,
          y: -30,
          duration: 13,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(".blob4", {
          x: -15,
          y: 20,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".hero-highlight", {
          backgroundPosition: "300% center",
          repeat: -1,
          duration: 5,
          ease: "none",
        });

        const hero = heroRef.current;
        let moveFn: ((e: MouseEvent) => void) | undefined;
        let leaveFn: (() => void) | undefined;

        if (hero) {
          moveFn = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth - 0.5;
            const y = e.clientY / window.innerHeight - 0.5;
            gsap.to(cardRef.current, {
              rotateY: x * 12,
              rotateX: -y * 8,
              transformPerspective: 1200,
              duration: 0.9,
              ease: "power2.out",
            });
            gsap.to(".blob1", { x: x * 20, y: y * 15, duration: 1.5 });
          };
          leaveFn = () => {
            gsap.to(cardRef.current, {
              rotateY: 0,
              rotateX: 0,
              duration: 1.2,
              ease: "elastic.out(1, 0.5)",
            });
          };
          hero.addEventListener("mousemove", moveFn);
          hero.addEventListener("mouseleave", leaveFn);
        }

        gsap.utils
          .toArray<HTMLElement>(".section-reveal-group")
          .forEach((group) => {
            gsap.fromTo(
              group.querySelectorAll(".section-reveal"),
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: { trigger: group, start: "top 85%", once: true },
              },
            );
          });

        // How it works steps
        gsap.fromTo(
          ".step-card",
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "#how-it-works",
              start: "top 85%",
              once: true,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>(".feature-card").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 90%", once: true },
            },
          );
        });

        // Expense rows
        gsap.utils.toArray<HTMLElement>(".expense-row").forEach((row) => {
          gsap.fromTo(
            row,
            { x: -30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: { trigger: row, start: "top 90%", once: true },
            },
          );
        });

        // Progress bar
        ScrollTrigger.create({
          trigger: ".progress-track",
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              ".progress-fill",
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 1.4,
                ease: "power3.out",
                transformOrigin: "left",
              },
            );
          },
        });

        // CTA section
        gsap.fromTo(
          ".cta-inner",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".cta-banner",
              start: "top 85%",
              once: true,
            },
          },
        );

        return () => {
          if (hero && moveFn && leaveFn) {
            hero.removeEventListener("mousemove", moveFn);
            hero.removeEventListener("mouseleave", leaveFn);
          }
        };
      }, rootRef);

      const refresh = () => ScrollTrigger.refresh();

      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh);

      return () => {
        window.removeEventListener("load", refresh);
        ctx.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <div className="groupay-root" ref={rootRef}>
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 z-50 w-full pointer-events-none">
        <div className="pointer-events-auto mx-4 mt-4 rounded-2xl border border-white/20 bg-white/80 backdrop-blur-lg shadow-sm">
          <div className="flex items-center justify-between px-6 h-15">
            <Link
              href="/"
              className={`${soraClass} font-bold text-forest-text flex items-center gap-2 text-xl`}
            >
              <div className="bg-green h-8 w-8 rounded-lg flex items-center justify-center shadow-md shadow-green/30">
                <svg viewBox="0 0 20 20" className="fill-white h-4 w-4">
                  <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm-1 3v4l3.5 2-.7 1.2L8 12.2V7h1z" />
                </svg>
              </div>
              GrouPay
            </Link>
            <div className="hidden md:flex items-center gap-x-6">
              <Link
                href="/#how-it-works"
                className="text-sm font-medium text-ink-mid hover:text-forest-text transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="/#features"
                className="text-sm font-medium text-ink-mid hover:text-forest-text transition-colors"
              >
                Features
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={data?.user ? "/dashboard" : "/auth/sign-in"}
                className="text-[14px] font-semibold text-forest-text hover:text-teal transition-colors py-2"
              >
                {data?.user ? data.user.name : "Log In"}
              </a>
              <a
                href="/auth/sign-up"
                className="bg-green hover:bg-greener text-white inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-green/25 hover:shadow-lg hover:shadow-green/35 hover:-translate-y-px"
              >
                Get Started →
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="hero relative overflow-hidden min-h-screen flex flex-col items-center justify-center pt-32 pb-12 px-6 text-center"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="blob1 absolute rounded-full opacity-30 bg-aqua blur-3xl"
            style={{ width: 480, height: 480, top: -120, right: -120 }}
          />
          <div
            className="blob2 absolute rounded-full opacity-20 bg-green blur-3xl"
            style={{ width: 360, height: 360, bottom: -60, left: -60 }}
          />
          <div
            className="blob3 absolute rounded-full opacity-20 bg-teal blur-3xl"
            style={{ width: 240, height: 240, bottom: 120, right: "18%" }}
          />
          <div
            className="blob4 absolute rounded-full opacity-15 bg-aqua blur-2xl"
            style={{ width: 180, height: 180, top: "40%", left: "8%" }}
          />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(#0d3d2a 1px, transparent 1px), linear-gradient(90deg, #0d3d2a 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="hero-content relative z-10 flex flex-col items-center max-w-5xl mx-auto">
          {/* opacity-0 here = CSS sets initial state, GSAP animates to opacity-1 */}
          <div className="hero-badge opacity-0 inline-flex items-center gap-2 bg-aqua/10 border border-aqua/30 py-1.5 px-4 rounded-full text-sm font-semibold text-forest-text mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-aqua rounded-full animate-pulse" />
            New: Multi-currency group goals are live!
          </div>

          <h1
            className={`hero-title opacity-0 ${soraClass} font-bold text-forest-text tracking-tight mb-6`}
            style={{ fontSize: "clamp(48px, 8vw, 80px)", lineHeight: 1.05 }}
          >
            Split bills.
            <br />
            Chase goals.
            <br />
            <span
              className="hero-highlight inline-block"
              style={{
                background:
                  "linear-gradient(90deg, #1a6b41, #00bd9d, #49c635, #00bd9d, #1a6b41)",
                backgroundSize: "300% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Together.
            </span>
          </h1>

          <p className="hero-subtitle opacity-0 text-lg text-ink-mid max-w-lg mb-10 leading-relaxed">
            GrouPay makes it effortless to split expenses with anyone, track who
            owes what, and pool money toward shared goals — all in one beautiful
            place.
          </p>

          <div className="hero-actions opacity-0 flex flex-wrap justify-center gap-4 mb-14">
            <a
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 bg-green hover:bg-greener text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-green/30 hover:shadow-xl hover:shadow-green/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Start for free
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-forest-text border border-forest/25 bg-white/60 hover:bg-white font-semibold px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-200 hover:shadow-md"
            >
              See how it works
            </a>
          </div>

          <div className="hero-stats flex flex-wrap justify-center gap-10 mb-16">
            {[
              {
                num: "2.4",
                suffix: "M+",
                label: "Active users",
                decimal: true,
              },
              {
                num: "480",
                prefix: "₦",
                suffix: "B",
                label: "Settled to date",
              },
              { num: "0", suffix: "%", label: "Hidden fees" },
            ].map(({ num, prefix, suffix, label, decimal }, i) => (
              <div key={i} className="stat opacity-0 text-center">
                <div
                  className={`${soraClass} text-[36px] font-bold text-forest-text leading-none flex items-end justify-center gap-0.5`}
                >
                  {prefix && (
                    <span className="text-[24px] mb-1 text-ink-mid">
                      {prefix}
                    </span>
                  )}
                  <span
                    className="stat-count"
                    data-target={num}
                    data-decimal={decimal ? "true" : "false"}
                  >
                    {num}
                  </span>
                  <span className="text-green">{suffix}</span>
                </div>
                <div className="stat-label text-sm text-ink-mid mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mockup Card */}
        <div className="w-full flex justify-center px-2">
          <div
            ref={cardRef}
            onMouseEnter={() =>
              gsap.to(cardRef.current, {
                scale: 1.015,
                y: -8,
                duration: 0.35,
                ease: "power2.out",
              })
            }
            onMouseLeave={() =>
              gsap.to(cardRef.current, {
                scale: 1,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                duration: 0.8,
                ease: "elastic.out(1,0.6)",
              })
            }
            className="mockup-card opacity-0 relative bg-white border border-card-border rounded-2xl p-7 max-215 w-full shadow-2xl"
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          >
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.04)",
              }}
            />

            <div className="mockup-header flex items-center justify-between mb-5">
              <div className={`${soraClass} font-bold text-forest-text text-lg`}>
                🏖️ Zanzibar Trip — June 2026
              </div>
              <span className="py-1.5 px-3.5 rounded-full text-xs font-bold tracking-wide uppercase bg-teal/10 text-teal border border-teal/20">
                3 of 6 settled
              </span>
            </div>

            <div className="expense-list flex flex-col gap-3 mb-5">
              {[
                {
                  icon: <AirplaneIcon className="h-4 w-4 text-teal" />,
                  iconBg: "bg-teal/15",
                  name: "Group flights",
                  meta: "Paid by Chidi · 6 people · Apr 12",
                  amount: "₦285,000",
                  share: "Your share: ₦47,500",
                  badge: "You paid ✓",
                  badgeBg: "bg-green/15 text-green border border-green/20",
                },
                {
                  icon: (
                    <HouseIcon
                      weight="duotone"
                      className="h-4 w-4 text-forest-text"
                    />
                  ),
                  iconBg: "bg-green/20",
                  name: "Beachfront villa (4 nights)",
                  meta: "Paid by Amara · 6 people · Apr 14",
                  amount: "₦360,000",
                  share: "Your share: ₦60,000",
                  badge: "Pending",
                  badgeBg:
                    "bg-amber-400/15 text-amber-700 border border-amber-300/30",
                },
                {
                  icon: <ForkKnifeIcon className="h-4 w-4 text-rose-500" />,
                  iconBg: "bg-rose-100",
                  name: "Rooftop Dinner",
                  meta: "Paid by Emeka · 6 people · Apr 15",
                  amount: "₦96,000",
                  share: "Your share: ₦16,000",
                  badge: "Pending",
                  badgeBg:
                    "bg-amber-400/15 text-amber-700 border border-amber-300/30",
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="expense-row group flex items-center gap-4 bg-white border border-card-border rounded-xl p-4 hover:border-teal/30 hover:shadow-md transition-all duration-200 cursor-default"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${row.iconBg} group-hover:scale-110 transition-transform duration-200`}
                  >
                    {row.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[14px] text-forest-text">
                      {row.name}
                    </div>
                    <div className="text-ink-mid text-xs mt-0.5">
                      {row.meta}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`${soraClass} font-bold text-forest-text text-[15px]`}
                    >
                      {row.amount}
                    </div>
                    <div className="text-[11px] text-teal font-semibold mt-0.5">
                      {row.share}
                    </div>
                    <span
                      className={`inline-block mt-1 text-[11px] font-semibold rounded-full py-0.5 px-2.5 ${row.badgeBg}`}
                    >
                      {row.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="progress-section bg-stone-50 rounded-xl p-4 border border-card-border">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-sm text-forest-text">
                  Group settlement
                </span>
                <span className="text-teal font-bold text-sm">
                  50% complete
                </span>
              </div>
              <div className="progress-track h-2.5 rounded-full overflow-hidden w-full bg-mist/60">
                <div
                  className="progress-fill h-full rounded-full"
                  style={{
                    width: "50%",
                    background: "linear-gradient(90deg, #00bd9d, #49c635)",
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <button className="text-xs font-bold text-white bg-teal hover:bg-green px-4 py-1.5 rounded-full transition-all hover:shadow-md hover:-translate-y-px">
                  Settle up ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="section-reveal-group mb-14">
            <div className="section-reveal opacity-0 text-xs uppercase text-teal tracking-widest font-bold mb-3">
              Simple by design
            </div>
            <h2
              className={`section-reveal opacity-0 ${soraClass} text-4xl font-bold text-forest-text mb-4`}
            >
              Up and running in seconds
            </h2>
            <p className="section-reveal opacity-0 text-ink-mid max-w-md text-base leading-relaxed">
              No spreadsheets. No awkward reminders. Just GrouPay doing the
              maths while you enjoy the moment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                num: "01",
                icon: "👥",
                title: "Create a group",
                body: "Name your group, set a currency, and invite members by email, phone, or a shareable link. They're in with one tap.",
                accent: "from-teal/10 to-aqua/5",
              },
              {
                num: "02",
                icon: "🧾",
                title: "Add expenses",
                body: "Log any bill — equally split or custom. Snap the receipt for your records. Everyone sees their share instantly.",
                accent: "from-green/10 to-teal/5",
              },
              {
                num: "03",
                icon: "📡",
                title: "Track & remind",
                body: "Watch the live balance dashboard. GrouPay auto-calculates who owes what, and sends gentle nudges so you don't have to.",
                accent: "from-aqua/10 to-green/5",
              },
              {
                num: "04",
                icon: "⚡",
                title: "Settle up",
                body: "Our debt-simplification algorithm minimises the number of transfers. Confirm payment and everyone's balance resets clean.",
                accent: "from-teal/10 to-green/5",
              },
            ].map((step, i) => (
              <div
                key={i}
                className={`step-card opacity-0 group relative bg-linear-to-br ${step.accent} border border-card-border p-8 rounded-2xl hover:border-teal/40 hover:shadow-lg transition-all duration-300 overflow-hidden`}
              >
                <div
                  className={`absolute -top-3 -right-1 ${soraClass} text-[80px] font-black text-forest-text/5 leading-none select-none pointer-events-none`}
                >
                  {step.num}
                </div>
                <div className="text-3xl mb-4">{step.icon}</div>
                <div
                  className={`${soraClass} text-xs font-bold text-teal tracking-wider uppercase mb-2`}
                >
                  Step {step.num}
                </div>
                <h3
                  className={`${soraClass} text-xl font-bold text-forest-text mb-3`}
                >
                  {step.title}
                </h3>
                <p className="text-ink-mid text-[15px] leading-relaxed">
                  {step.body}
                </p>
                {(i === 0 || i === 2) && (
                  <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 bg-white border border-card-border rounded-full flex items-center justify-center shadow-sm">
                      <svg
                        className="w-3 h-3 text-teal"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="features"
        className="relative py-28 px-6 bg-forest text-white overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #49c635 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="section-reveal-group mb-14">
            <div className="section-reveal opacity-0 text-xs uppercase tracking-widest font-bold text-teal mb-3">
              Everything you need
            </div>
            <h2
              className={`section-reveal opacity-0 ${soraClass} text-4xl font-bold mb-4`}
            >
              Built for real life
            </h2>
            <p className="section-reveal opacity-0 text-white/60 max-w-md text-base leading-relaxed">
              From spontaneous dinners to year-long savings goals, GrouPay
              handles every kind of shared money moment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: "💸",
                title: "Flexible Bill Splitting",
                body: "Split equally, by percentage, by exact amounts, or by shares. Handle complex group bills without the headache.",
              },
              {
                icon: "🎯",
                title: "Group Goals",
                body: "Pool contributions toward any shared objective — a group gift, a holiday fund, or a team dinner. Watch the progress bar fill up.",
              },
              {
                icon: "📊",
                title: "Live Balance Dashboard",
                body: "See all your groups, what you owe, and what you're owed — at a glance, always up to date.",
              },
              {
                icon: "🔔",
                title: "Smart Reminders",
                body: "Automated, friendly nudges so you never have to be the awkward one asking for money back.",
              },
              {
                icon: "🧮",
                title: "Debt Simplification",
                body: "Our algorithm condenses tangled IOUs into the minimum number of transfers. Everyone settles fast.",
              },
              {
                icon: "🌍",
                title: "Multi-Currency",
                body: "Travel the world together. GrouPay handles currency conversion so cross-border trips don't get messy.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="feature-card opacity-0 group relative bg-white/5 border border-white/10 p-7 rounded-2xl hover:bg-white/10 hover:border-teal/40 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-teal/0 to-green/0 group-hover:from-teal/5 group-hover:to-green/5 transition-all duration-500 rounded-2xl" />
                <div className="relative z-10">
                  <span className="text-3xl mb-4 block">{f.icon}</span>
                  <h3
                    className={`${soraClass} font-bold text-white mb-2 text-lg`}
                  >
                    {f.title}
                  </h3>
                  <p className="text-white/55 text-[14px] leading-relaxed">
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-teal/8 via-transparent to-green/8" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#0d3d2a 1px, transparent 1px), linear-gradient(90deg, #0d3d2a 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="cta-inner opacity-0 relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green/10 border border-green/20 text-green text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green rounded-full" />
            Free forever for personal use
          </div>
          <h2
            className={`${soraClass} text-[clamp(32px,6vw,52px)] font-bold text-forest-text mb-4 leading-tight`}
          >
            Ready to end the awkwardness?
          </h2>
          <p className="text-ink-mid mb-10 text-lg">
            Join 2.4 million people who've made shared money simple.
          </p>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 bg-green hover:bg-greener text-white font-semibold text-lg py-4 px-10 rounded-full shadow-xl shadow-green/30 hover:shadow-2xl hover:shadow-green/40 hover:-translate-y-1 transition-all duration-200"
          >
            Create your free account
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <p className="text-ink-mid/60 text-sm mt-5">
            No credit card required.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-forest text-white/60">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-white/10">
            <div className="col-span-2">
              <div
                className={`${soraClass} font-bold text-white text-xl flex items-center gap-2 mb-4`}
              >
                <div className="h-8 w-8 bg-green rounded-lg flex items-center justify-center shadow-md shadow-green/30">
                  <svg viewBox="0 0 20 20" className="fill-white h-4 w-4">
                    <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm-1 3v4l3.5 2-.7 1.2L8 12.2V7h1z" />
                  </svg>
                </div>
                GrouPay
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Making shared spending fair, transparent, and friction-free for
                groups everywhere.
              </p>
            </div>
            {[
              {
                heading: "Product",
                links: [
                  "Bill Splitting",
                  "Group Goals",
                  "Dashboard",
                  "Integrations",
                  "Mobile App",
                ],
              },
              {
                heading: "Company",
                links: ["About", "Blog", "Careers", "Press", "Contact"],
              },
              {
                heading: "Legal",
                links: [
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "Security",
                ],
              },
            ].map((col) => (
              <div key={col.heading}>
                <p
                  className={`${soraClass} text-xs font-bold text-white tracking-widest uppercase mb-4`}
                >
                  {col.heading}
                </p>
                {col.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-sm text-white/50 hover:text-teal transition-colors mb-2.5"
                  >
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
            <span className="text-sm text-white/40">
              © 2026 GrouPay Inc. All rights reserved.
            </span>
            <div className="flex items-center gap-5">
              {["Twitter", "Instagram", "LinkedIn"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-sm text-white/40 hover:text-aqua transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
