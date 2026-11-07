import Link from "next/link";
import { getDictionary } from "@/i18n/config";
import type { Locale } from "@/i18n/config";

import {
  FaFacebookF,
  FaPinterestP,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
  FaQuora,
  FaXTwitter,
} from "react-icons/fa6";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/kcmsc.edu.bd",
    icon: <FaFacebookF />,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@kcmscofficial",
    icon: <FaYoutube />,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/kcmscofficial/",
    icon: <FaInstagram />,
  },
];

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const isBangla = locale === "bn";

  const groups = [
    {
      title: isBangla ? "পরিচিতি" : "ABOUT",
      links: [
        [isBangla ? "আমাদের গল্প" : "Our story", "about"],
        [
          isBangla ? "নেতৃত্বের বার্তা" : "Leadership messages",
          "leadership-messages",
        ],
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
    <footer className="border-t border-[#d9d8cf] bg-[#efeee7] text-[#69716b]">
      <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
        {/* Main Footer */}
        <div className="grid gap-10 border-b border-[#d9d8cf] pb-9 sm:pb-10 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          {/* School Information */}
          <div>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-3 text-[#124c36]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fffdf8]">
                <img
                  src="/kcmsc/kcmsc-logo.png"
                  alt="K C Model School & College logo"
                  className="block h-9 w-9 object-contain"
                />
              </span>

              <span className="font-heading text-[18px] font-normal">
                {dict.site.name}
              </span>
            </Link>

            <p className="mt-4 max-w-md text-[14px] leading-6">
              {isBangla
                ? "প্লে গ্রুপ থেকে দ্বাদশ শ্রেণি পর্যন্ত বাংলা ও ইংরেজি ভার্সনে শিক্ষা।"
                : "Education from Play Group to Grade Twelve in Bangla and English Versions."}
            </p>

            {/* Institutional Information */}
            <div className="mt-5 max-w-md border-t border-[#d9d8cf] pt-4">
              <p className="text-[12px] uppercase tracking-[.16em] text-[#176b45]">
                {isBangla ? "প্রাতিষ্ঠানিক তথ্য" : "INSTITUTIONAL INFORMATION"}
              </p>

              <dl className="mt-3 grid grid-cols-3 gap-2">
                <div className="min-w-0">
                  <dt className="text-[12px] leading-4 text-[#858b84]">EIIN</dt>
                  <dd className="mt-1 text-[14px] font-medium tabular-nums text-[#124c36]">
                    137368
                  </dd>
                </div>

                <div className="min-w-0 border-l border-[#d9d8cf] pl-3">
                  <dt className="text-[12px] leading-4 text-[#858b84]">
                    {isBangla ? "স্কুল কোড" : "School Code"}
                  </dt>
                  <dd className="mt-1 text-[14px] font-medium tabular-nums text-[#124c36]">
                    1417
                  </dd>
                </div>

                <div className="min-w-0 border-l border-[#d9d8cf] pl-3">
                  <dt className="text-[12px] leading-4 text-[#858b84]">
                    {isBangla ? "কলেজ কোড" : "College Code"}
                  </dt>
                  <dd className="mt-1 text-[14px] font-medium tabular-nums text-[#124c36]">
                    1290
                  </dd>
                </div>
              </dl>
            </div>

            {/* Social Media */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`K C Model School & College on ${social.name}`}
                  title={social.name}
                  className="
                    group
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-[#d5d5cc]
                    bg-[#f5f4ee]
                    text-[#14583d]
                    transition-all
                    duration-200
                    hover:-translate-y-1
                    hover:border-[#14583d]
                    hover:bg-[#14583d]
                    hover:text-white
                  "
                >
                  <span className="text-[16px]">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-6">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="text-[12px] uppercase tracking-[.16em] text-[#176b45]">
                  {group.title}
                </p>

                <div className="mt-3 space-y-2">
                  {group.links.map(([label, href]) => (
                    <Link
                      key={href}
                      href={`/${locale}/${href}`}
                      className="
                        block
                        text-[12px]
                        transition-colors
                        duration-200
                        hover:text-[#176b45]
                      "
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="grid gap-4 pt-6 text-[12px] leading-5 text-[#858b84] sm:grid-cols-2 lg:grid-cols-3">
          {/* Address */}
          <address className="not-italic">
            {dict.footer.address}
            <br />
            {dict.footer.phone} · {dict.footer.mobile}
            <br />
            <a
              href={`mailto:${dict.footer.email}`}
              className="transition-colors hover:text-[#176b45]"
            >
              {dict.footer.email}
            </a>
          </address>

          {/* Website */}
          <p className="sm:text-center">{dict.footer.website}</p>

          {/* Copyright */}
          <p className="lg:text-right">
            © 2014 – {new Date().getFullYear()} {dict.site.shortName}.{" "}
            {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
