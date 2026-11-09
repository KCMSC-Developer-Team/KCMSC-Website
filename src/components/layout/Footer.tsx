import Link from "next/link";
import { getDictionary } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa6";

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/kcmsc.edu.bd", icon: <FaFacebookF /> },
  { name: "YouTube", href: "https://www.youtube.com/@kcmscofficial", icon: <FaYoutube /> },
  { name: "Instagram", href: "https://www.instagram.com/kcmscofficial/", icon: <FaInstagram /> },
];

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7297.776086443836!2d90.41308!3d23.858109!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c5c555555555%3A0x89fc3a22dc626e58!2sK%20C%20MODEL%20SCHOOL%20%26%20COLLEGE!5e0!3m2!1sen!2sbd!4v1791212644537!5m2!1sen!2sbd";

const headingClass = "text-[12px] font-medium uppercase tracking-[.16em] text-[#176b45]";
const linkClass =
  "w-fit text-[14px] text-[#58645c] transition-colors duration-200 hover:text-[#176b45]";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const isBangla = locale === "bn";

  const groups = [
    {
      title: isBangla ? "পরিচিতি" : "ABOUT",
      links: [
        [isBangla ? "আমাদের গল্প" : "Our story", "about"],
        [isBangla ? "নেতৃত্বের বার্তা" : "Leadership messages", "leadership-messages"],
        [isBangla ? "একাডেমিক" : "Academics", "academics"],
      ] as const,
    },
    {
      title: isBangla ? "ক্যাম্পাস" : "CAMPUS",
      links: [
        [isBangla ? "শিক্ষাজীবন" : "Student life", "student-life"],
        [isBangla ? "সুযোগ-সুবিধা" : "Facilities", "facilities"],
      ] as const,
    },
    {
      title: isBangla ? "তথ্য" : "INFORMATION",
      links: [
        [isBangla ? "ফলাফল ও অর্জন" : "Results & achievements", "achievements"],
        [isBangla ? "যোগাযোগ" : "Contact", "contact"],
        [isBangla ? "সহায়তা কেন্দ্র" : "Help Center", "help"],
      ] as const,
    },
  ];

  return (
    <footer className="relative isolate overflow-hidden border-t border-[#d9d8cf] bg-[#efeee7] text-[#69716b]">
      <img
        src="/kcmsc/footer-building-outline.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-[-9%] z-0 w-[min(112vw,620px)] max-w-none select-none object-contain opacity-75 sm:right-[-5%] sm:w-[min(68vw,760px)] lg:right-[-2%] lg:w-[min(58vw,760px)]"
      />

      <div className="relative z-10 mx-auto max-w-[1180px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        <div className="kc-footer-main grid gap-10 border-b border-[#d9d8cf] pb-9 sm:pb-10">
          {/* Left: campus map, then contact details */}
          <div>
            <div className="mb-7">
              <Link href={`/${locale}`} className="inline-flex items-center gap-3 text-[#124c36]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fffdf8]">
                  <img src="/kcmsc/kcmsc-logo.png" alt="K C Model School & College logo" className="block h-9 w-9 object-contain" />
                </span>
                <span className="font-heading text-[18px] font-normal">{dict.site.name}</span>
              </Link>

              <p className="mt-4 max-w-md text-[14px] leading-6">
                {isBangla
                  ? "প্লে গ্রুপ থেকে দ্বাদশ শ্রেণি পর্যন্ত বাংলা ও ইংরেজি ভার্সনে শিক্ষা।"
                  : "Education from Play Group to Grade Twelve in Bangla and English Versions."}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#d9d8cf] bg-[#fffdf8] shadow-[var(--kc-shadow-card)]">
              <p className={`${headingClass} px-5 pb-3 pt-4`}>
                {isBangla ? "মানচিত্রে আমাদের অবস্থান" : "Find us on the map"}
              </p>
              <iframe
                src={MAP_SRC}
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="block h-[240px] w-full lg:h-[260px]"
                title="K C Model School & College location"
              />
            </div>

            <address className="mt-6 space-y-1.5 text-[14px] not-italic leading-6">
              <p>{dict.footer.address}</p>
              <p className="tabular-nums">
                {dict.footer.phone} · {dict.footer.mobile}
              </p>
              <a href={`mailto:${dict.footer.email}`} className="transition-colors hover:text-[#176b45]">
                {dict.footer.email}
              </a>
            </address>
          </div>

          {/* Right: navigation and social links */}
          <div className="flex flex-col justify-between gap-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className={headingClass}>{group.title}</p>
                  <div className="mt-4 flex flex-col gap-3">
                    {group.links.map(([label, href]) => (
                      <Link key={href} href={`/${locale}/${href}`} className={linkClass}>
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className={headingClass}>{isBangla ? "সামাজিক যোগাযোগ" : "SOCIAL LINKS"}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`K C Model School & College on ${social.name}`}
                    title={social.name}
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[#d5d5cc] bg-[#f5f4ee] text-[#14583d] transition-all duration-200 hover:-translate-y-1 hover:border-[#14583d] hover:bg-[#14583d] hover:text-white"
                  >
                    <span className="text-[16px]">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 pt-6 text-[12px] leading-5 text-[#858b84] sm:grid-cols-2">
          <p>{dict.footer.website}</p>
          <p className="sm:text-right">
            © 2014 – {new Date().getFullYear()} {dict.site.shortName}. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
