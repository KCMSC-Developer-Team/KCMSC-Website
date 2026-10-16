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
    name: "X",
    href: "https://x.com/kcmodelcollege",
    icon: <FaXTwitter />,
  },
  {
    name: "Pinterest",
    href: "https://www.pinterest.com/kcmscofficial",
    icon: <FaPinterestP />,
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
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/k-c-model-school-and-college-51251532b/?locale=en_US",
    icon: <FaLinkedinIn />,
  },
  {
    name: "Quora",
    href: "https://bn.quora.com/profile/K-C-Model-School-and-College",
    icon: <FaQuora />,
  },
];

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const groups = [
    {
      title: locale === "bn" ? "পরিচিতি" : "ABOUT",
      links: [
        [locale === "bn" ? "আমাদের গল্প" : "Our story", "about"],
        [
          locale === "bn" ? "নেতৃত্বের বার্তা" : "Leadership messages",
          "leadership-messages",
        ],
        [locale === "bn" ? "একাডেমিক" : "Academics", "academics"],
      ] as const,
    },
    {
      title: locale === "bn" ? "ক্যাম্পাস" : "CAMPUS",
      links: [
        [locale === "bn" ? "শিক্ষাজীবন" : "Student life", "student-life"],
        [locale === "bn" ? "সুযোগ-সুবিধা" : "Facilities", "facilities"],
      ] as const,
    },
    {
      title: locale === "bn" ? "তথ্য" : "INFORMATION",
      links: [
        [locale === "bn" ? "ফলাফল ও অর্জন" : "Results & achievements", "academics"],
        [locale === "bn" ? "যোগাযোগ" : "Contact", "contact"],
        [locale === "bn" ? "সহায়তা কেন্দ্র" : "Help Center", "help"],
      ] as const,
    },
  ];

  return (
    <footer className="border-t border-[#d9d8cf] bg-[#efeee7] text-[#69716b]">
      <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 lg:px-10 lg:py-14">
        {/* Main Footer */}
        <div className="grid gap-10 border-b border-[#d9d8cf] pb-10 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          {/* School Information */}
          <div>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-3 text-[#124c36]"
            >
              {/* FIXED LOGO */}
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] bg-[#fffdf8]">
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

            <p className="mt-4 max-w-md text-[13px] leading-6">
              {locale === "bn"
                ? "প্লে গ্রুপ থেকে দ্বাদশ শ্রেণি পর্যন্ত বাংলা ও ইংরেজি ভার্সনে শিক্ষা।"
                : "Education from Play Group to Grade Twelve in Bangla and English Versions."}
            </p>

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
                <p className="text-[9px] uppercase tracking-[.16em] text-[#176b45]">
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
        <div className="grid gap-4 pt-6 text-[11px] leading-5 text-[#858b84] sm:grid-cols-2 lg:grid-cols-3">
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
            © {new Date().getFullYear()} {dict.site.shortName}.{" "}
            {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
