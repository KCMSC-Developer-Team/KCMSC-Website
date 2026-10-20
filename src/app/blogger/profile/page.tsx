import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { FiArrowLeft, FiLock, FiUser } from "react-icons/fi";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/db";
import PasswordForm from "./PasswordForm";

export const dynamic = "force-dynamic";

export default async function BloggerProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "BLOGGER") {
    redirect("/blogger/login");
  }
  const profile = await prisma.bloggerProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      displayName: true,
      schoolId: true,
      type: true,
      className: true,
      section: true,
      subject: true,
      photoUrl: true,
    },
  });
  if (!profile) redirect("/blogger/login");

  const roleLabel =
    profile.type === "STUDENT"
      ? `Student${profile.className ? ` · Class ${profile.className}` : ""}${
          profile.section ? ` · Section ${profile.section}` : ""
        }`
      : `Teacher${profile.subject ? ` · ${profile.subject}` : ""}`;

  return (
    <main className="min-h-screen bg-[#f5f6f3] px-5 py-8 text-[#25352b] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blogger/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#176b45] transition hover:text-[#124c36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176b45]"
        >
          <FiArrowLeft aria-hidden="true" size={16} />
          Back to dashboard
        </Link>

        <header className="mt-7">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#778078]">
            Blogger workspace
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium tracking-[-.03em] text-[#203a2c] sm:text-4xl">
            Account settings
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#768078]">
            Manage your sign-in security and review your verified blogger profile.
          </p>
        </header>

        <section className="mt-7 rounded-2xl border border-[#e4e8e1] bg-white p-5 shadow-[0_2px_8px_rgba(30,55,38,.03)] sm:p-7">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-[#dce4da] bg-[#e8f0e9] text-[#176b45]">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser aria-hidden="true" size={20} />
              )}
            </span>
            <div>
              <h2 className="font-serif text-xl text-[#263c2f]">Blogger profile</h2>
              <p className="mt-1 text-xs text-[#7b857d]">
                Your public author details are managed by the school.
              </p>
            </div>
          </div>
          <dl className="mt-6 grid gap-4 border-t border-[#edf0eb] pt-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-[#899189]">Display name</dt>
              <dd className="mt-1 text-sm font-semibold text-[#35483b]">
                {profile.displayName}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[#899189]">School ID</dt>
              <dd className="mt-1 text-sm font-semibold text-[#35483b]">
                {profile.schoolId}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-[#899189]">Account type</dt>
              <dd className="mt-1 text-sm font-semibold text-[#35483b]">
                {roleLabel}
              </dd>
            </div>
          </dl>
          <p className="mt-5 rounded-xl bg-[#f6f7f4] px-4 py-3 text-xs leading-5 text-[#768078]">
            For changes to your verified name or school details, please contact
            the school administration.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-[#e4e8e1] bg-white p-5 shadow-[0_2px_8px_rgba(30,55,38,.03)] sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf2ee] text-[#176b45]">
              <FiLock aria-hidden="true" size={17} />
            </span>
            <div>
              <h2 className="font-serif text-xl text-[#263c2f]">Change password</h2>
              <p className="mt-1 text-xs text-[#7b857d]">
                Confirm your current password before choosing a new one.
              </p>
            </div>
          </div>
          <PasswordForm />
        </section>
      </div>
    </main>
  );
}
