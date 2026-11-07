import Link from "next/link";
import LoginForm from "./LoginForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function BloggerLoginPage() {
  return (
    <AuthShell
      portal="blogger"
      eyebrow="KCMSC Journal"
      headline={<>Write for<br />your <span className="text-[#e4d49a]">school.</span></>}
      blurb="Sign in to write, edit, and manage articles for the school blog."
      points={["Draft and publish your articles", "Manage your writer profile", "Read what your classmates are writing"]}
      title="Blogger sign in"
      subtitle="Use the school ID and password provided when your blogger account was activated."
      footer={
        <>
          <p>
            Not a blogger yet?{" "}
            <Link className="font-semibold text-[#176b45] hover:underline" href="/en/blog/apply">
              Apply here
            </Link>
          </p>
          <Link className="inline-flex items-center gap-2 font-medium text-[#176b45] transition hover:text-[#124c36] hover:underline" href="/en/blog">
            ← Back to blog
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
