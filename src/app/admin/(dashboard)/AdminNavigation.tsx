"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiBriefcase,
  FiChevronRight,
  FiGrid,
  FiMenu,
  FiSettings,
  FiUsers,
  FiX,
  FiMessageSquare,
  FiBell,
  FiHelpCircle,
  FiBookOpen,
  FiUserCheck,
  FiCalendar,
} from "react-icons/fi";
import { SignOutButton } from "./SignOutButton";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: FiGrid,
      },
    ],
  },

  {
    label: "People",
    items: [
      { href: "/admin/teachers", label: "Teachers & faculty", icon: FiUserCheck },
    ],
  },

  {
    label: "Content",
    items: [
      {
        href: "/admin/notices",
        label: "Notices & latest news",
        icon: FiBell,
      },
      { href: "/admin/events", label: "Events & activities", icon: FiCalendar },
      {
        href: "/admin/alumni",
        label: "Alumni messages",
        icon: FiMessageSquare,
      },
      {
        href: "/admin/careers",
        label: "Careers",
        icon: FiBriefcase,
      },
      {
        href: "/admin/help",
        label: "Help Center",
        icon: FiHelpCircle,
      },
      { href: "/admin/blog/applications", label: "Blogger applications", icon: FiBookOpen },
      { href: "/admin/blog/profiles", label: "Blogger profiles", icon: FiUsers },
      { href: "/admin/blog/articles", label: "Blog articles", icon: FiBookOpen },
    ],
  },

  {
    label: "Administration",
    items: [
      {
        href: "/admin/administrators",
        label: "Administrators",
        icon: FiUsers,
      },
      {
        href: "/admin/settings",
        label: "My Account",
        icon: FiSettings,
      },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === "/admin"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavigation({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navigation = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-[#d9d8cf] px-5 py-5">
        <Link
          href="/admin"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#fffdf8]">
            <img
              src="/kcmsc/kcmsc-logo.png"
              alt="K C Model School & College logo"
              className="h-full w-full object-contain"
            />
          </span>

          <span className="min-w-0">
            <span className="block font-heading text-lg leading-tight text-[#124c36]">
              K C Model School
            </span>

            <span className="mt-0.5 block text-[12px] uppercase tracking-[0.18em] text-[#7c847d]">
              Administration
            </span>
          </span>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-6 last:mb-0">
            <p className="px-3 text-[12px] font-medium uppercase tracking-[0.18em] text-[#8a918b]">
              {group.label}
            </p>

            <div className="mt-2 space-y-1.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-b from-[#1f8a5b] to-[#176b45] font-medium text-white shadow-card"
                        : "text-[#4f5751] hover:translate-x-0.5 hover:bg-[#e3f2e9] hover:text-[#124c36]"
                    }`}
                  >
                    <Icon
                      className={`h-[17px] w-[17px] shrink-0 ${
                        active ? "text-white" : "text-[#7d857e]"
                      }`}
                    />

                    <span className="flex-1">{item.label}</span>

                    <FiChevronRight
                      className={`h-3.5 w-3.5 ${
                        active
                          ? "opacity-80"
                          : "opacity-0 group-hover:opacity-50"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[#d9d8cf] p-4">
        <div className="mb-3 rounded-lg bg-[#efeee7] px-3 py-2.5">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#176b45]">
            Signed in as
          </p>

          <p className="mt-1 truncate text-[13px] text-[#59615b]" title={email}>
            {email}
          </p>
        </div>

        <SignOutButton />
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[258px] border-r border-[#d9d8cf] bg-[#fffdf8] lg:block">
        {navigation}
      </aside>

      <div className="fixed inset-x-0 top-0 z-40 flex h-[68px] items-center justify-between border-b border-[#d9d8cf] bg-[#fffdf8]/90 px-4 backdrop-blur lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#fffdf8]">
            <img
              src="/kcmsc/kcmsc-logo.png"
              alt="K C Model School & College logo"
              className="h-full w-full object-contain"
            />
          </span>

          <span className="font-heading text-lg text-[#124c36]">
            KCMSC Admin
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin navigation"
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#d9d8cf] text-[#176b45]"
        >
          <FiMenu className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close admin navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[#124c36]/35"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[min(86vw,320px)] flex-col bg-[#fffdf8] shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close admin navigation"
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-lg border border-[#d9d8cf] text-[#5e665f]"
            >
              <FiX className="h-4 w-4" />
            </button>

            {navigation}
          </aside>
        </div>
      ) : null}
    </>
  );
}
