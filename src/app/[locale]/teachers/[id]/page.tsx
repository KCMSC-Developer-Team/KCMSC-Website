import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/i18n/config";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: { locale: string; id: string } };

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("").toUpperCase();
}

export default async function TeacherDetail({ params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const teacher = await prisma.teacherProfile.findFirst({
    where: { id: params.id, isActive: true, isPublished: true },
  });
  if (!teacher) notFound();

  const bn = params.locale === "bn";
  const qualifications = (teacher.qualifications || "").split("\n").map((item) => item.trim()).filter(Boolean);
  const hasAcademicDetails = Boolean(teacher.highestDegree || teacher.university || qualifications.length);

  return (
    <main className="min-h-screen bg-[#f2f7f2] text-[#18382b]">
      <div className="border-b border-[#d5e5d9] bg-[#e4f0e7]">
        <div className="w-full px-5 py-4 sm:px-8 lg:px-12 xl:px-16">
          <Link href={`/${params.locale}/teachers`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#126440] transition hover:text-[#0a422b]">
            <span aria-hidden="true">←</span> {bn ? "শিক্ষক তালিকায় ফিরুন" : "Back to all teachers"}
          </Link>
          <div className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-[#347653]">
            <span className="h-px w-7 bg-[#347653]" /> KCMSC <span className="text-[#8ba895]">/</span> {bn ? "শিক্ষক পরিচিতি" : "Faculty profile"}
          </div>
        </div>
      </div>

      <div className="w-full px-0 py-0 sm:py-0">
        <article className="overflow-hidden border-y border-[#cbded0] bg-white shadow-none">
          <header className="relative isolate overflow-hidden bg-[#105b3b] text-white">
            <div aria-hidden="true" className="absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full border-[38px] border-white/[0.055]" />
            <div aria-hidden="true" className="absolute -bottom-36 right-1/4 -z-10 h-64 w-64 rounded-full bg-[#23764f]/50" />
            <div className="grid md:grid-cols-[minmax(320px,34vw)_minmax(0,1fr)] xl:grid-cols-[minmax(390px,32vw)_minmax(0,1fr)]">
              <div className="relative min-h-[360px] bg-[#dcebe0] sm:min-h-[440px] md:min-h-[540px] xl:min-h-[620px]">
                {teacher.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={teacher.photoUrl} alt={teacher.name} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full min-h-[360px] place-items-center bg-[#e4f0e7] text-6xl font-semibold text-[#126440] sm:min-h-[440px] md:min-h-[540px] xl:min-h-[620px]">{initials(teacher.name)}</div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent md:hidden" />
              </div>
              <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-[#e2f2e6]">{teacher.wing}</span>
                  <span className="bg-[#d8eddf] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#105b3b]">{bn ? "অনুষদ সদস্য" : "Faculty member"}</span>
                </div>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[.2em] text-[#b9dfc5]">{bn ? "শিক্ষা ও অনুপ্রেরণা" : "Education · Guidance · Inspiration"}</p>
                <h1 className="mt-3 max-w-3xl font-heading text-4xl leading-[1.08] tracking-[-.035em] text-white sm:text-5xl lg:text-6xl">{teacher.name}</h1>
                <p className="mt-4 text-base font-medium text-[#e2f2e6] sm:text-lg">{teacher.designation}</p>
                {teacher.subjects.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {teacher.subjects.map((subject) => <span key={subject} className="border border-white/20 bg-black/[0.08] px-3 py-1.5 text-xs text-white/90">{subject}</span>)}
                  </div>
                )}
                {(teacher.highestDegree || teacher.university) && (
                  <div className="mt-8 border-t border-white/20 pt-6">
                    {teacher.highestDegree && <p className="text-base font-semibold text-white sm:text-lg">{teacher.highestDegree}</p>}
                    {teacher.university && <p className="mt-1.5 text-sm text-[#d0e7d7]">{teacher.university}</p>}
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(300px,24vw)] xl:grid-cols-[minmax(0,1fr)_minmax(340px,22vw)]">
            <div className="min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 xl:px-16 xl:py-14">
              {teacher.quote && (
                <section className="relative mb-10 overflow-hidden border-l-4 border-[#167047] bg-[#edf6ef] px-6 py-7 sm:px-8 sm:py-8">
                  <span aria-hidden="true" className="absolute -right-1 -top-8 font-heading text-[150px] leading-none text-[#cce3d2]">“</span>
                  <div className="relative">
                    <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#28734c]">{bn ? "প্রিয় উক্তি" : "A thought to remember"}</p>
                    <blockquote className="mt-4 max-w-3xl font-heading text-xl leading-relaxed text-[#174d34] sm:text-2xl">“{teacher.quote}”</blockquote>
                  </div>
                </section>
              )}

              {teacher.biography && (
                <section className="mb-10">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#e4f1e7] text-[#126440]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v15M8 7h8M8 11h8"/></svg></span>
                    <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#43805b]">{bn ? "ব্যক্তিগত পরিচিতি" : "Introduction"}</p><h2 className="mt-1 font-heading text-2xl text-[#123b2a] sm:text-3xl">{bn ? "আমার সম্পর্কে" : "About the educator"}</h2></div>
                  </div>
                  <p className="whitespace-pre-line pl-0 text-sm leading-8 text-[#53695b] sm:text-base sm:leading-8">{teacher.biography}</p>
                </section>
              )}

              {hasAcademicDetails && (
                <section className="mb-10">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#e4f1e7] text-[#126440]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5"><path d="m3 9 9-5 9 5-9 5z"/><path d="M6 11v5c3.5 3 8.5 3 12 0v-5M21 9v7"/></svg></span>
                    <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#43805b]">{bn ? "শিক্ষা ও প্রশিক্ষণ" : "Education & training"}</p><h2 className="mt-1 font-heading text-2xl text-[#123b2a] sm:text-3xl">{bn ? "শিক্ষাগত যোগ্যতা" : "Academic qualifications"}</h2></div>
                  </div>
                  <div className="space-y-3">
                    {(teacher.highestDegree || teacher.university) && <div className="flex gap-4 border border-[#dce9df] bg-[#fbfdfb] p-4 sm:p-5"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#218052] ring-4 ring-[#e4f1e7]"/><div className="min-w-0"><p className="font-semibold leading-6 text-[#244a34]">{teacher.highestDegree || (bn ? "শিক্ষাগত যোগ্যতা" : "Academic qualification")}</p>{teacher.university && <p className="mt-1 text-sm leading-6 text-[#6b7d70]">{teacher.university}</p>}</div></div>}
                    {qualifications.map((qualification, index) => <div key={`${qualification}-${index}`} className="flex gap-4 border-b border-[#e5eee7] p-4 sm:p-5"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#83b294]"/><p className="text-sm leading-7 text-[#53695b]">{qualification}</p></div>)}
                  </div>
                </section>
              )}

              {teacher.studentMessage && (
                <section className="relative overflow-hidden bg-[#105b3b] p-6 text-white sm:p-8">
                  <div aria-hidden="true" className="absolute -bottom-16 -right-12 h-48 w-48 rounded-full border-[24px] border-white/[0.06]" />
                  <div className="relative">
                    <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#b9dfc5]">{bn ? "শিক্ষার্থীদের জন্য" : "A note for learners"}</p>
                    <h2 className="mt-2 font-heading text-2xl text-white sm:text-3xl">{bn ? "শিক্ষার্থীদের প্রতি বার্তা" : "A message to students"}</h2>
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#e0eee4] sm:text-base sm:leading-8">{teacher.studentMessage}</p>
                  </div>
                </section>
              )}
            </div>

            <aside className="border-t border-[#e0ebe2] bg-[#f8fbf8] px-5 py-7 sm:px-8 lg:border-l lg:border-t-0 lg:px-8 lg:py-10 xl:px-10">
              <div className="lg:sticky lg:top-8">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#43805b]">{bn ? "এক নজরে" : "At a glance"}</p>
                <h2 className="mt-2 font-heading text-xl text-[#123b2a]">{bn ? "শিক্ষক পরিচিতি" : "Faculty overview"}</h2>
                <div className="mt-5 divide-y divide-[#dce9df] border-y border-[#dce9df] bg-white px-4">
                  <div className="py-4"><p className="text-[11px] text-[#788b7d]">{bn ? "পদবি" : "Designation"}</p><p className="mt-1 text-sm font-semibold leading-6 text-[#294d37]">{teacher.designation}</p></div>
                  <div className="py-4"><p className="text-[11px] text-[#788b7d]">{bn ? "শাখা" : "Wing"}</p><p className="mt-1 text-sm font-semibold leading-6 text-[#294d37]">{teacher.wing}</p></div>
                  {teacher.subjects.length > 0 && <div className="py-4"><p className="text-[11px] text-[#788b7d]">{bn ? "বিষয়" : "Subject areas"}</p><p className="mt-1 text-sm leading-6 text-[#294d37]">{teacher.subjects.join(", ")}</p></div>}
                  {teacher.university && <div className="py-4"><p className="text-[11px] text-[#788b7d]">{bn ? "প্রতিষ্ঠান" : "Institution"}</p><p className="mt-1 text-sm font-semibold leading-6 text-[#294d37]">{teacher.university}</p></div>}
                </div>
                <div className="mt-5 border-l-4 border-[#167047] bg-[#e9f4ec] p-4">
                  <p className="text-xs font-semibold text-[#205d3b]">{bn ? "K C Model School & College" : "K C Model School & College"}</p>
                  <p className="mt-2 text-xs leading-6 text-[#5d7966]">{bn ? "শিক্ষা, অনুসন্ধিৎসা ও সম্ভাবনার বিকাশে প্রতিশ্রুতিবদ্ধ।" : "Committed to learning, curiosity and the growth of every learner."}</p>
                </div>
                <Link href={`/${params.locale}/teachers`} className="mt-5 flex w-full items-center justify-center gap-2 border border-[#a9cdb4] bg-white px-4 py-3 text-sm font-semibold text-[#126440] transition hover:border-[#126440] hover:bg-[#edf6ef]">{bn ? "সব শিক্ষক দেখুন" : "Explore all teachers"} <span aria-hidden="true">↗</span></Link>
              </div>
            </aside>
          </div>
        </article>

        <div className="mt-0 flex flex-col justify-between gap-3 border-t border-[#cbded0] bg-[#e7f1e9] px-5 py-4 text-xs leading-6 text-[#587461] sm:flex-row sm:items-center sm:px-6">
          <span>{bn ? "এই পরিচিতির তথ্য শিক্ষক ও স্কুল প্রশাসনের অনুমোদিত তথ্যের ভিত্তিতে প্রকাশিত।" : "Profile information is published in accordance with school-approved records."}</span>
          <Link href={`/${params.locale}/teachers`} className="shrink-0 font-semibold text-[#126440] hover:underline">{bn ? "শিক্ষক তালিকায় ফিরুন" : "Return to faculty directory"} →</Link>
        </div>
      </div>
    </main>
  );
}
