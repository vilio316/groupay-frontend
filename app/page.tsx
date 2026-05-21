"use client";

import Link from "next/link";
import { inter, soraClass } from "./fonts";
import "./globals.css";
import { AirplaneIcon, ForkKnifeIcon, HouseIcon } from "@phosphor-icons/react";
import Avatars from "./components/AvatarsCircles";
export default function HomePage() {
  return (
    <div>
      <nav className="fixed top-0 left-0 z-100 bg-white backdrop-blur-md border-b border-b-solid border-b-card-border">
        <div className="nav-inner flex items-center justify-between w-screen mx-auto px-6 h-16">
          <Link
            href="/"
            className={`logo ${soraClass} font-bold text-forest flex items-center gap-2 text-xl`}
          >
            <div className="bg-green h-8 w-8 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 20 20" className="fill-white h-4 w-4">
                <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm-1 3v4l3.5 2-.7 1.2L8 12.2V7h1z" />
              </svg>
            </div>
            GrouPay
          </Link>
          <div className="nav-links flex items-center gap-x-4">
            <Link
              href="/#how-it-works"
              className="hover:text-forest text-ink-mid"
            >
              How it Works
            </Link>
            <Link href="/#features" className="hover:text-forest text-ink-mid">
              Features
            </Link>
            {/* <Link
              href="#testimonials"
              className="hover:text-forest text-ink-mid"
            >
              Reviews
            </Link> */}
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/auth/sign-in"
              className="text-[14px] font-semibold text-forest hover:text-teal py-3"
            >
              Log In
            </a>
            <a
              href="/auth/sign-up"
              className={`bg-green hover:bg-greener text-white inline-flex center gap-2 py-3 px-6 rounded-full font-semibold cursor-pointer transition-all`}
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      <div>
        <section className="hero py-40 pl-6 pr-6 text-center relative overflow-hidden">
          <div className="hero-bg absolute inset-0 z-0">
            <div className="hero-blob md:w-100 md:h-100 bg-aqua -top-25 -right-80 absolute rounded-full backdrop-blur-3xl opacity-25 "></div>
            <div className="blob-2 absolute rounded-full backdrop-blur-3xl opacity-25 md:w-75 md:h-75 bg-green -bottom-15 -left-15 "></div>
            <div
              className="blob-3 absolute rounded-full backdrop-blur-3xl opacity-25 bg-teal"
              style={{
                width: "200px",
                height: "200px",
                bottom: "40px",
                right: "20%",
              }}
            ></div>
          </div>
          <div className="hero-content relative z-1 grid justify-center items-center">
            <div
              className="hero-badge flex items-center bg-aqua/15 border border-solid border-aqua/40 py-1.5 px-3.5 text-sm font-semibold md:mb-7 rounded-full w-2/5 justify-self-center gap-x-2
            "
            >
              <span className="hero-badge-dot w-2 h-2 bg-aqua rounded-full"></span>{" "}
              <p className="text-center w-[90%]">New features available!</p>
            </div>
            <p
              className={`${soraClass} text-[48px] font-bold max-w-195 text-forest my-0 md:mx-6 tracking-tight`}
              style={{
                margin: "0 auto 24px",
              }}
            >
              Split bills.
              <br />
              Chase goals.
              <br />
              <span className="text-green">Together.</span>
            </p>
            <p
              className="text-lg/relaxed text-ink-mid md:max-w-140 "
              style={{
                margin: "0 auto 40px",
              }}
            >
              GrouPay makes it effortless to split expenses with anyone, track
              who owes what, and pool money toward shared goals — all in one
              beautiful place.
            </p>
            <div className="hero-actions flex justify-center  flex-wrap gap-4">
              <a
                href="/auth/sign-up"
                className="btn bg-green hover:bg-[#3db029] md:px-9 md:py-4 rounded-full"
              >
                Start for free →
              </a>
              <a
                href="#how-it-works"
                className="btn bg-transparent text-green border border-green border-solid md:px-9 md:py-4 rounded-full"
              >
                See how it works
              </a>
            </div>
            <div className="hero-stats md:gap-12 md:my-18 flex justify-center flex-wrap">
              <div className="stat text-center">
                <div
                  className={`${soraClass} text-[32px] font-bold text-forest`}
                >
                  2.4<span className="text-green">M+</span>
                </div>
                <div className="stat-label text-ink-mid">Active users</div>
              </div>
              <div className="stat text-center">
                <div
                  className={`${soraClass} text-[32px] font-bold text-forest`}
                >
                  ₦<span className="text-green">480B</span>
                </div>
                <div className="stat-label text-ink-mid">Settled to date</div>
              </div>
              {/* <div className="stat">
                <div className="stat-num">
                  4.9<span>★</span>
                </div>
                <div className="stat-label">App store rating</div>
              </div> */}
              <div className="stat text-center">
                <div
                  className={`${soraClass} text-[32px] font-bold text-forest`}
                >
                  0<span className="text-green">%</span>
                </div>
                <div className="stat-label text-ink-mid">Hidden fees</div>
              </div>
            </div>
          </div>
        </section>

        <div className="mockup-strip pt-0 px-6 pb-20 flex justify-center">
          <div className="mockup-card bg-white border border-card-border rounded-2xl p-7 max-w-215 w-full shadow-xl">
            <div className="mockup-header flex items-center justify-between md:mb-5">
              <div
                className={`mockup-title ${soraClass} font-bold text-forest`}
              >
                🏖️ Zanzibar Trip — June 2026
              </div>
              <span className="py-1 px-3 rounded-full text-sm font-semibold bg-aqua/0.2 text-[#006e8a]">
                3 of 6 settled
              </span>
            </div>
            <div className="expense-list flex flex-col md:gap-3">
              <div className="expense-row flex items-center md:gap-4 bg-white border border-card-border rounded-[14px] p-4 ">
                <div className="expense-icon w-10 h-10 rounded-sm flex place-items-center justify-center shrink-0 bg-teal/25">
                  <AirplaneIcon className="h-4 w-4" />
                </div>
                <div className="expense-info flex-1">
                  <div className="expense-name font-bold text-[14px] text-forest">
                    Group flights
                  </div>
                  <div className="expense-meta text-ink-mid text-sm mt-0.5">
                    Paid by Chidi · 6 people · Apr 12
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`expense-amount ${soraClass} font-bold text-forest text-right`}
                  >
                    ₦285,000
                  </div>
                  <div className="expense-share text-[11px] text-teal font-semibold">
                    Your share: ₦47,500
                  </div>
                  <span className="text-sm rounded-full text-[#006e8a] text-right bg-green/30 py-1 px-2">
                    You paid ✓
                  </span>
                </div>
              </div>
              <div className="expense-row flex items-center md:gap-4 bg-white border border-card-border rounded-[14px] p-4">
                <div className="expense-icon w-10 h-10 rounded-sm flex place-items-center justify-center shrink-0 bg-green/30">
                  <HouseIcon weight="duotone" className="w-4 h-4" />
                </div>
                <div className="expense-info flex-1">
                  <div className="expense-name font-bold text-[14px] text-forest">
                    Beachfront villa (4 nights)
                  </div>
                  <div className="expense-meta text-ink-mid text-sm mt-0.5">
                    Paid by Amara · 6 people · Apr 14
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`expense-amount ${soraClass} font-bold text-forest text-right`}
                  >
                    ₦360,000
                  </div>
                  <div className="expense-share text-[11px] text-teal font-semibold">
                    Your share: ₦60,000
                  </div>
                  <span className="text-sm rounded-full text-[#006e8a] text-right bg-amber-300/30 py-1 px-2">
                    Pending
                  </span>
                </div>
              </div>
              <div className="expense-row flex items-center md:gap-4 bg-white border border-card-border rounded-[14px] p-4">
                <div className="expense-icon w-10 h-10 rounded-sm flex place-items-center justify-center shrink-0 bg-red-500/40">
                  <ForkKnifeIcon className="w-4 h-4" />
                </div>
                <div className="expense-info flex-1">
                  <div className="expense-name font-bold text-[14px] text-forest">
                    Rooftop Dinner
                  </div>
                  <div className="expense-meta text-ink-mid text-sm mt-0.5 ">
                    Paid by Emeka · 6 people · Apr 15
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`expense-amount ${soraClass} font-bold text-forest text-right`}
                  >
                    ₦96,000
                  </div>
                  <div className="expense-share text-[11px] text-teal font-semibold">
                    Your share: ₦16,000
                  </div>
                  <span className="text-sm rounded-full text-[#006e8a] text-right bg-amber-300/30 py-1 px-2">
                    Pending
                  </span>
                </div>
              </div>
            </div>
            <div className="progress-section md:mt-5 ">
              <div className="progress-label flex  justify-between text-sm mb-2">
                <span className="font-bold text-forest">
                  Group settlement progress
                </span>
                <span className="text-teal font-semibold">50% complete</span>
              </div>
              <div className="progress-track h-2.5 rounded-full overflow-hidden w-full bg-mist/45">
                <div className="progress-fill rounded-full bg-linear-90 from-teal to-green w-1/2 h-2.5"></div>
              </div>
              <div className="flex items-center my-2">
                <Avatars />
              </div>
              <button className="w-1/5 text-center rounded-full p-1 justify-self-end bg-teal text-white hover:bg-green hover:shadow-lg -translate-y-1 block hover:scale-105">
                Settle up ✓
              </button>
            </div>
          </div>
        </div>

        <section id="how-it-works" className="py-24 px-6">
          <div className="container grid">
            <div className="section-label text-xs uppercase text-teal tracking-wider font-bold my-2">
              Simple by design
            </div>
            <h2
              className={`section-title font-bold text-forest md:mb-4 ${soraClass}`}
            >
              Up and running in seconds
            </h2>
            <p className="section-subtitle text-ink-mid max-w-130 text-[16px]/1.7">
              No spreadsheets. No awkward reminders. Just GrouPay doing the
              maths while you enjoy the moment.
            </p>
            <div className="steps-grid grid grid-cols-2 w-4/5 gap-3 p-2 justify-self-center">
              <div className="step-card border border-card-border p-7 shadow-2xs transition-all hover:border-aqua hover:shadow-lg rounded-xl">
                <div
                  className={`step-num md:w-11 md:h-11 flex items-center justify-center ${soraClass} text-[18px]`}
                >
                  1
                </div>
                <h3 className="mb-2 text-forest">Create a group</h3>
                <p>
                  Name your group, set a currency, and invite members by email,
                  phone, or a shareable link. They're in with one tap.
                </p>
              </div>
              <div className="step-card  border border-card-border p-7 shadow-2xs transition-all hover:border-aqua hover:shadow-lg rounded-xl">
                <div
                  className={`step-num md:w-11 md:h-11 flex items-center justify-center ${soraClass} text-[18px]`}
                >
                  2
                </div>
                <h3 className="mb-2 text-forest">Add expenses</h3>
                <p>
                  Log any bill — equally split or custom. Snap the receipt for
                  your records. Everyone sees their share instantly.
                </p>
              </div>
              <div className="step-card  border border-card-border p-7 shadow-2xs transition-all hover:border-aqua hover:shadow-lg rounded-xl">
                <div
                  className={`step-num md:w-11 md:h-11 flex items-center justify-center ${soraClass} text-[18px]`}
                >
                  3
                </div>
                <h3 className="mb-2 text-forest">Track & remind</h3>
                <p>
                  Watch the live balance dashboard. GrouPay auto-calculates who
                  owes what, and sends gentle nudges so you don't have to.
                </p>
              </div>
              <div className="step-card  border border-card-border p-7 shadow-2xs transition-all hover:border-aqua hover:shadow-lg rounded-xl">
                <div
                  className={`step-num md:w-11 md:h-11 flex items-center justify-center ${soraClass} text-[18px]`}
                >
                  4
                </div>
                <h3 className="mb-2 text-forest">Settle up</h3>
                <p>
                  Our debt-simplification algorithm minimises the number of
                  transfers. Confirm payment and everyone's balance resets
                  clean.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section features-bg pt-24 pb-12 px-6 bg-forest text-white"
          id="features"
        >
          <div className="container grid ">
            <div className="section-label text-sm uppercase my-2 text-teal">
              Everything you need
            </div>
            <h2 className={`section-title ${soraClass} my-1 text-lg`}>
              Built for real life
            </h2>
            <p className="section-subtitle my-2 text-[16px]/1.7">
              From spontaneous dinners to year-long savings goals, GrouPay
              handles every kind of shared money moment.
            </p>
            <div className="features-grid grid grid-cols-3 justify-self-center w-4/5 gap-4 md:py-6">
              <div className="feature-card bg-white/5 border border-solid border-white/20 p-7 transition-all hover:bg-white/10 rounded-xl">
                <div className="feature-icon">💸</div>
                <h3 className={`${soraClass} text-bold`}>
                  Flexible Bill Splitting
                </h3>
                <p>
                  Split equally, by percentage, by exact amounts, or by shares.
                  Handle complex group bills without the headache.
                </p>
              </div>
              <div className="feature-card bg-white/5 border border-solid border-white/20 p-7 transition-all hover:bg-white/10 rounded-xl">
                <div className="feature-icon">🎯</div>
                <h3 className={`${soraClass} text-bold`}>Group Goals</h3>
                <p>
                  Pool contributions toward any shared objective — a group gift,
                  a holiday fund, or a team dinner. Watch the progress bar fill
                  up.
                </p>
              </div>
              <div className="feature-card bg-white/5 border border-solid border-white/20 p-7 transition-all hover:bg-white/10 rounded-xl">
                <div className="feature-icon">📊</div>
                <h3 className={`${soraClass} text-bold`}>
                  Live Balance Dashboard
                </h3>
                <p>
                  See all your groups, what you owe, and what you're owed — at a
                  glance, always up to date.
                </p>
              </div>
              <div className="feature-card bg-white/5 border border-solid border-white/20 p-7 transition-all hover:bg-white/10 rounded-xl">
                <div className="feature-icon">🔔</div>
                <h3 className={`${soraClass} text-bold`}>Smart Reminders</h3>
                <p>
                  Automated, friendly nudges so you never have to be the awkward
                  one asking for money back.
                </p>
              </div>
              <div className="feature-card bg-white/5 border border-solid border-white/20 p-7 transition-all hover:bg-white/10 rounded-xl">
                <div className="feature-icon">🧮</div>
                <h3 className={`${soraClass} text-bold`}>
                  Debt Simplification
                </h3>
                <p>
                  Our algorithm condenses tangled IOUs into the minimum number
                  of transfers. Everyone settles fast.
                </p>
              </div>
              <div className="feature-card bg-white/5 border border-solid border-white/20 p-7 transition-all hover:bg-white/10 rounded-xl">
                <div className="feature-icon">🌍</div>
                <h3 className={`${soraClass} text-bold`}>Multi-Currency</h3>
                <p>
                  Travel the world together. GrouPay handles currency conversion
                  so cross-border trips don't get messy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="section" id="testimonials">
          <div className="container">
            <div className="section-label">What people say</div>
            <h2 className="section-title">Loved by groups everywhere</h2>
            <p className="section-subtitle">
              Real people, real expenses, zero awkwardness.
            </p>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <div className="testimonial-quote">
                  We used GrouPay for a 10-person trip to Morocco. The debt
                  simplification alone saved us hours of confusion at the end.
                </div>
                <div className="testimonial-author">
                  <div className="avatar">AK</div>
                  <div>
                    <div className="author-name">Aisha Kamara</div>
                    <div className="author-handle">Lagos · Travel blogger</div>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <div className="testimonial-quote">
                  Our house of 5 uses it for rent, groceries, utilities —
                  everything. No more arguments about who owes what. Absolute
                  lifesaver.
                </div>
                <div className="testimonial-author">
                  <div className="avatar">JO</div>
                  <div>
                    <div className="author-name">James Osei</div>
                    <div className="author-handle">Accra · Student</div>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <div className="testimonial-quote">
                  The Goals feature is underrated — we pooled for a team offsite
                  and hit our target two weeks early. Clean UI, everything just
                  works.
                </div>
                <div className="testimonial-author">
                  <div className="avatar">FN</div>
                  <div>
                    <div className="author-name">Fatima Nwosu</div>
                    <div className="author-handle">Abuja · Product Manager</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        <section className="cta-banner py-20 px-6 bg-linear-150 from-[rgba(73, 198, 53, 0.08)] to-[rgba(0, 189, 157, 0.08)] border border-y-card-border text-center ">
          <h2 className={`text-[40px] text-forest ${soraClass} font-bold mb-4`}>
            Ready to end the awkwardness?
          </h2>
          <p className="text-ink-mid md:mb-9">
            Join 2.4 million people who've made shared money simple.
          </p>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 py-3 px-7 bg-green rounded-full transition-all cursor-pointer font-semibold hover:bg-[#3db029] hover:translate-y-0.5 hover:shadow-lg"
          >
            Create your free account →
          </Link>
        </section>

        <footer className="bg-forest text-mist md:pt-14 md:pb-8 md:px-6">
          <div className="footer-grid grid grid-cols-5 md:gap-8">
            <div className="footer-brand col-span-2">
              <div className="logo text-white mb-3">
                <div className="h-8 w-8 bg-green rounded-sm flex items-center justify-center">
                  <svg viewBox="0 0 20 20" className="fill-white h-4 w-4">
                    <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4zm-1 3v4l3.5 2-.7 1.2L8 12.2V7h1z" />
                  </svg>
                </div>
                GrouPay
              </div>
              <p>
                Making shared spending fair,
                <br />
                transparent, and friction-free
                <br />
                for groups everywhere.
              </p>
            </div>
            <div className="footer-col">
              <p
                className={`${soraClass} text-sm font-bold text-white tracking-wider uppercase mb-4`}
              >
                Product
              </p>
              <a href="#" className="block">
                Bill Splitting
              </a>
              <a href="#" className="block">
                Group Goals
              </a>
              <a href="#" className="block">
                Dashboard
              </a>
              <a href="#" className="block">
                Integrations
              </a>
              <a href="#" className="block">
                Mobile App
              </a>
            </div>
            <div className="footer-col">
              <p
                className={`${soraClass} text-sm font-bold text-white tracking-wider uppercase mb-4`}
              >
                Company
              </p>
              <a href="#" className="block">
                About
              </a>
              <a href="#" className="block">
                Blog
              </a>
              <a href="#" className="block">
                Careers
              </a>
              <a href="#" className="block">
                Press
              </a>
              <a href="#" className="block">
                Contact
              </a>
            </div>
            <div className="footer-col">
              <p
                className={`${soraClass} text-sm font-bold text-white tracking-wider uppercase mb-4`}
              >
                Legal
              </p>
              <a href="#" className="block text-mist mb-2.5 hover:text-aqua">
                Privacy Policy
              </a>
              <a href="#" className="block">
                Terms of Service
              </a>
              <a href="#" className="block">
                Cookie Policy
              </a>
              <a href="#" className="block">
                Security
              </a>
            </div>
          </div>
          <div className="footer-bottom bt-1 bt-aqua md:pt-6 flex justify-between items-center">
            <span>© 2026 GrouPay Inc. All rights reserved.</span>
            <div>
              <a href="#" className="hover:text-aqua text-mist ml-5">
                Twitter
              </a>
              <a href="#" className="hover:text-aqua text-mist ml-5">
                Instagram
              </a>
              <a href="#" className="hover:text-aqua text-mist ml-5">
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
