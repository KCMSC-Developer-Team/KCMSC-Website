import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import AcademicCalendar from "@/components/content/AcademicCalendar";

type Item = {
  title: string;
  body: string;
  href?: string;
  label?: string;
  external?: boolean;
};
type PageContent = {
  kicker: string;
  title: string;
  intro: string;
  note: string;
  sections: { title: string; body: string; items: Item[] }[];
};
const content: Record<string, Record<Locale, PageContent>> = {
  teachers: {
    en: {
      kicker: "Our people",
      title: "Meet the people behind the learning.",
      intro:
        "A school is shaped by the people who teach, guide and support its students. This section is designed to introduce KCMSC’s teaching team and their professional backgrounds.",
      note: "Staff profiles will be published as verified information is approved by the school.",
      sections: [
        {
          title: "Teaching at KCMSC",
          body: "Explore the people and academic teams supporting learning across the Junior and Senior Wings.",
          items: [
            {
              title: "Junior Wing",
              body: "Teaching and learning across the early and primary years.",
            },
            {
              title: "Senior Wing",
              body: "Subject teaching and academic support across secondary and higher secondary levels.",
            },
            {
              title: "Professional profiles",
              body: "Qualifications, subject areas and profile photographs will be shown when verified and approved.",
            },
          ],
        },
      ],
    },
    bn: {
      kicker: "আমাদের মানুষ",
      title: "শেখার পেছনের মানুষদের সঙ্গে পরিচিত হোন।",
      intro:
        "যাঁরা পাঠদান করেন, দিকনির্দেশনা দেন এবং শিক্ষার্থীদের সহায়তা করেন, তাঁদের নিয়েই একটি শিক্ষাপ্রতিষ্ঠান গড়ে ওঠে। এই বিভাগে KCMSC-এর শিক্ষক ও তাঁদের পেশাগত পরিচিতি তুলে ধরা হবে।",
      note: "প্রতিষ্ঠান কর্তৃক যাচাইকৃত ও অনুমোদিত তথ্য পাওয়া গেলে শিক্ষক-প্রোফাইল প্রকাশ করা হবে।",
      sections: [
        {
          title: "KCMSC-তে পাঠদান",
          body: "জুনিয়র ও সিনিয়র উইংয়ের শিক্ষা কার্যক্রমে যুক্ত শিক্ষক দল সম্পর্কে জানুন।",
          items: [
            {
              title: "জুনিয়র উইং",
              body: "প্রাক-প্রাথমিক ও প্রাথমিক পর্যায়ের পাঠদান ও শিক্ষা কার্যক্রম।",
            },
            {
              title: "সিনিয়র উইং",
              body: "মাধ্যমিক ও উচ্চমাধ্যমিক পর্যায়ে বিষয়ভিত্তিক পাঠদান ও একাডেমিক সহায়তা।",
            },
            {
              title: "পেশাগত পরিচিতি",
              body: "যাচাই ও অনুমোদনের পর যোগ্যতা, বিষয় ও ছবি প্রকাশ করা হবে।",
            },
          ],
        },
      ],
    },
  },
  scholarships: {
    en: {
      kicker: "Scholarships & recognition",
      title: "Celebrating effort, progress and achievement.",
      intro:
        "KCMSC’s scholarship information can bring together scholarship examination updates, recipient announcements and recognition of student achievement.",
      note: "Specific dates, recipient names and results should be published only after official confirmation.",
      sections: [
        {
          title: "Scholarship information",
          body: "Use these resources to find academic results and official announcements. New scholarship lists can be added here as verified content becomes available.",
          items: [
            {
              title: "Class 5 & 8 scholarship",
              body: "Scholarship examination results and award ceremony updates.",
              href: "/achievements",
              label: "View academic achievements",
            },
            {
              title: "Nipa Group scholarship",
              body: "Annual recipient lists and related announcements, after verification.",
              href: "/notices",
              label: "View official notices",
            },
            {
              title: "Results & achievements",
              body: "Academic results and student accomplishments published by KCMSC.",
              href: "/academics",
              label: "Explore academics",
            },
          ],
        },
      ],
    },
    bn: {
      kicker: "বৃত্তি ও স্বীকৃতি",
      title: "পরিশ্রম, অগ্রগতি ও সাফল্যের স্বীকৃতি।",
      intro:
        "KCMSC-এর বৃত্তি-সংক্রান্ত তথ্যের মধ্যে বৃত্তি পরীক্ষার আপডেট, নির্বাচিত শিক্ষার্থীদের তালিকা এবং শিক্ষার্থীদের সাফল্যের স্বীকৃতি একত্রে রাখা যেতে পারে।",
      note: "নির্দিষ্ট তারিখ, প্রাপকের নাম ও ফলাফল কেবল আনুষ্ঠানিকভাবে নিশ্চিত হওয়ার পর প্রকাশ করা উচিত।",
      sections: [
        {
          title: "বৃত্তি-সংক্রান্ত তথ্য",
          body: "যাচাইকৃত তথ্য যুক্ত হওয়ার সঙ্গে সঙ্গে এই বিভাগে বৃত্তি ও ফলাফলের তথ্য প্রকাশ করা যাবে।",
          items: [
            {
              title: "পঞ্চম ও অষ্টম শ্রেণির বৃত্তি",
              body: "বৃত্তি পরীক্ষার ফলাফল ও পুরস্কার বিতরণীর আপডেট।",
              href: "/achievements",
              label: "একাডেমিক সাফল্য দেখুন",
            },
            {
              title: "নিপা গ্রুপ বৃত্তি",
              body: "যাচাইয়ের পর বার্ষিক বৃত্তিপ্রাপ্তদের তালিকা ও ঘোষণা।",
              href: "/notices",
              label: "অফিশিয়াল নোটিশ দেখুন",
            },
            {
              title: "ফলাফল ও অর্জন",
              body: "KCMSC কর্তৃক প্রকাশিত একাডেমিক ফলাফল ও শিক্ষার্থীদের সাফল্য।",
              href: "/academics",
              label: "একাডেমিক বিভাগ দেখুন",
            },
          ],
        },
      ],
    },
  },
  calendar: {
    en: {
      kicker: "Plan ahead",
      title: "The academic year, clearly laid out.",
      intro:
        "The academic calendar will bring important dates, school events, examinations and holidays into one place for students and families.",
      note: "Dates can change. Please follow official notices for the latest confirmed information.",
      sections: [
        {
          title: "Calendar & important dates",
          body: "The calendar is intended to be updated by the school team as dates are confirmed.",
          items: [
            {
              title: "Examinations",
              body: "Term, selection and board examination dates will be published when confirmed.",
            },
            {
              title: "School events",
              body: "Assemblies, programmes, seminars and other school events.",
            },
            {
              title: "Holidays & closures",
              body: "Official holidays and any school closure notices.",
              href: "/notices",
              label: "Check official notices",
            },
          ],
        },
      ],
    },
    bn: {
      kicker: "আগাম পরিকল্পনা",
      title: "এক নজরে শিক্ষাবর্ষের গুরুত্বপূর্ণ তারিখ।",
      intro:
        "শিক্ষাবর্ষের ক্যালেন্ডারে গুরুত্বপূর্ণ তারিখ, বিদ্যালয়ের অনুষ্ঠান, পরীক্ষা ও ছুটির তথ্য শিক্ষার্থী ও পরিবারের জন্য এক জায়গায় রাখা হবে।",
      note: "তারিখ পরিবর্তিত হতে পারে। সর্বশেষ নিশ্চিত তথ্যের জন্য অফিসিয়াল নোটিশ অনুসরণ করুন।",
      sections: [
        {
          title: "ক্যালেন্ডার ও গুরুত্বপূর্ণ তারিখ",
          body: "তারিখ নিশ্চিত হওয়ার সঙ্গে সঙ্গে বিদ্যালয় কর্তৃপক্ষ এই ক্যালেন্ডার হালনাগাদ করবে।",
          items: [
            {
              title: "পরীক্ষা",
              body: "টার্ম, নির্বাচনী ও বোর্ড পরীক্ষার তারিখ নিশ্চিত হলে প্রকাশ করা হবে।",
            },
            {
              title: "বিদ্যালয়ের অনুষ্ঠান",
              body: "সমাবেশ, অনুষ্ঠান, সেমিনার ও অন্যান্য কার্যক্রম।",
            },
            {
              title: "ছুটি ও বন্ধ",
              body: "সরকারি ছুটি এবং বিদ্যালয় বন্ধের বিজ্ঞপ্তি।",
              href: "/notices",
              label: "অফিশিয়াল নোটিশ দেখুন",
            },
          ],
        },
      ],
    },
  },
  routine: {
    en: {
      kicker: "Everyday learning",
      title: "Class routines and daily schedules.",
      intro:
        "Find class routine updates in one place. Because schedules can change, always check the publication date and follow the latest notice from the school.",
      note: "The current routine should be uploaded by the school office. No unverified timetable is displayed here.",
      sections: [
        {
          title: "Routine information",
          body: "This page is prepared to host approved routine files for each wing, class or version.",
          items: [
            {
              title: "Junior Wing",
              body: "Routine files for relevant junior classes can be listed here when uploaded.",
            },
            {
              title: "Senior Wing",
              body: "Routine files for secondary and higher secondary classes can be listed here when uploaded.",
            },
            {
              title: "Routine changes",
              body: "Changes and temporary adjustments should be communicated through official notices.",
              href: "/notices",
              label: "Read notices",
            },
          ],
        },
      ],
    },
    bn: {
      kicker: "দৈনন্দিন শিক্ষা",
      title: "শ্রেণির রুটিন ও দৈনিক সময়সূচি।",
      intro:
        "শ্রেণির রুটিন-সংক্রান্ত আপডেট এক জায়গায় দেখুন। সময়সূচি পরিবর্তিত হতে পারে, তাই প্রকাশের তারিখ দেখে সর্বশেষ নোটিশ অনুসরণ করুন।",
      note: "বিদ্যালয় অফিস কর্তৃক বর্তমান রুটিন আপলোড করা হলে এখানে দেখানো হবে। যাচাই না করা কোনো সময়সূচি এখানে দেওয়া হয়নি।",
      sections: [
        {
          title: "রুটিন-সংক্রান্ত তথ্য",
          body: "অনুমোদিত রুটিন ফাইল উইং, শ্রেণি বা ভার্সন অনুযায়ী প্রকাশের জন্য এই পৃষ্ঠা প্রস্তুত করা হয়েছে।",
          items: [
            {
              title: "জুনিয়র উইং",
              body: "আপলোড করা হলে সংশ্লিষ্ট শ্রেণির রুটিন এখানে পাওয়া যাবে।",
            },
            {
              title: "সিনিয়র উইং",
              body: "আপলোড করা হলে মাধ্যমিক ও উচ্চমাধ্যমিক শ্রেণির রুটিন এখানে পাওয়া যাবে।",
            },
            {
              title: "রুটিন পরিবর্তন",
              body: "পরিবর্তন বা সাময়িক সমন্বয় অফিসিয়াল নোটিশে জানানো উচিত।",
              href: "/notices",
              label: "নোটিশ দেখুন",
            },
          ],
        },
      ],
    },
  },
  downloads: {
    en: {
      kicker: "Resources",
      title: "Useful documents, in one place.",
      intro:
        "The downloads library is intended to make approved forms, notices, academic documents and other school resources easier to find.",
      note: "Only documents approved for public distribution should be uploaded. Each file should include a clear title and update date.",
      sections: [
        {
          title: "Browse resources",
          body: "Resources can be grouped by purpose as the school publishes approved files.",
          items: [
            {
              title: "Admission forms & documents",
              body: "Admission-related forms and instructions.",
              href: "/admissions",
              label: "Admission information",
            },
            {
              title: "Notices & circulars",
              body: "Official announcements and downloadable circulars.",
              href: "/notices",
              label: "Browse notices",
            },
            {
              title: "Academic resources",
              body: "Class routines, calendars and other academic documents when available.",
              href: "/academics",
              label: "Academic information",
            },
          ],
        },
        {
          title: "Transport & student services",
          body: "Forms and practical documents for services provided by the school.",
          items: [
            {
              title: "Transport Service Application Form",
              body: "Download the official KCMSC transport service application form as a PDF. Complete the form and follow the instructions provided by the school.",
              href: "https://kcmsc.edu.bd/wp-content/uploads/2023/02/Transport-Form-KCMSC.pdf",
              label: "Download PDF",
              external: true,
            },
          ],
        },
        {
          title: "Teachers & staff",
          body: "Administrative forms for KCMSC teachers and staff.",
          items: [
            {
              title: "Teachers & Staff Leave Application",
              body: "Download the leave application form for teachers and staff. Complete the form and submit it through the school's established process.",
              href: "https://kcmsc.edu.bd/wp-content/uploads/2024/09/Leave-Application-0.2-F.pdf",
              label: "Download leave form (PDF)",
              external: true,
            },
          ],
        },
      ],
    },
    bn: {
      kicker: "রিসোর্স",
      title: "প্রয়োজনীয় নথি, এক জায়গায়।",
      intro:
        "অনুমোদিত ফর্ম, নোটিশ, একাডেমিক নথি ও অন্যান্য প্রয়োজনীয় উপকরণ সহজে খুঁজে পেতে এই ডাউনলোড বিভাগ তৈরি করা হয়েছে।",
      note: "শুধু জনসাধারণের জন্য অনুমোদিত নথি আপলোড করা উচিত। প্রতিটি ফাইলে স্পষ্ট শিরোনাম ও হালনাগাদের তারিখ থাকতে হবে।",
      sections: [
        {
          title: "রিসোর্স দেখুন",
          body: "অনুমোদিত ফাইল প্রকাশের সঙ্গে সঙ্গে প্রয়োজন অনুযায়ী বিভাগভিত্তিক সাজানো যাবে।",
          items: [
            {
              title: "ভর্তি ফর্ম ও নথি",
              body: "ভর্তি-সংক্রান্ত ফর্ম ও নির্দেশনা।",
              href: "/admissions",
              label: "ভর্তির তথ্য",
            },
            {
              title: "নোটিশ ও বিজ্ঞপ্তি",
              body: "অফিশিয়াল ঘোষণা ও ডাউনলোডযোগ্য বিজ্ঞপ্তি।",
              href: "/notices",
              label: "নোটিশ দেখুন",
            },
            {
              title: "একাডেমিক রিসোর্স",
              body: "রুটিন, ক্যালেন্ডার ও অন্যান্য একাডেমিক নথি পাওয়া গেলে এখানে যুক্ত হবে।",
              href: "/academics",
              label: "একাডেমিক তথ্য",
            },
          ],
        },
        {
          title: "পরিবহন ও শিক্ষার্থী সেবা",
          body: "বিদ্যালয়ের সেবার জন্য প্রয়োজনীয় ফর্ম ও ব্যবহারিক নথি।",
          items: [
            {
              title: "পরিবহন সেবা আবেদন ফর্ম",
              body: "KCMSC-এর পরিবহন সেবা আবেদন ফর্মটি PDF হিসেবে ডাউনলোড করুন। ফর্মটি পূরণ করে বিদ্যালয়ের নির্দেশনা অনুসরণ করুন।",
              href: "https://kcmsc.edu.bd/wp-content/uploads/2023/02/Transport-Form-KCMSC.pdf",
              label: "PDF ডাউনলোড করুন",
              external: true,
            },
          ],
        },
        {
          title: "শিক্ষক ও কর্মচারী",
          body: "KCMSC-এর শিক্ষক ও কর্মচারীদের প্রশাসনিক ফর্ম।",
          items: [
            {
              title: "শিক্ষক ও কর্মচারীদের ছুটির আবেদন",
              body: "শিক্ষক ও কর্মচারীদের ছুটির আবেদন ফর্ম ডাউনলোড করুন। ফর্মটি পূরণ করে বিদ্যালয়ের নির্ধারিত প্রক্রিয়ায় জমা দিন।",
              href: "https://kcmsc.edu.bd/wp-content/uploads/2024/09/Leave-Application-0.2-F.pdf",
              label: "ছুটির ফর্ম ডাউনলোড (PDF)",
              external: true,
            },
          ],
        },
      ],
    },
  },
  why: {
    en: {
      kicker: "Why KCMSC",
      title: "A connected journey from the first classroom to Grade XII.",
      intro:
        "KCMSC serves students from Play Group through Grade Twelve in Bangla and English Versions of the National Curriculum. Our aim is to make each stage of the learning journey clear and connected.",
      note: "This page presents the school’s existing educational scope and links to further information; it does not make unsupported rankings or performance claims.",
      sections: [
        {
          title: "What families can explore",
          body: "Learn about the academic structure, campus environment and student experiences through the school’s existing pages.",
          items: [
            {
              title: "A connected academic journey",
              body: "Explore the stages from early learning through higher secondary education.",
              href: "/academics",
              label: "Explore academics",
            },
            {
              title: "Spaces for learning",
              body: "Learn about campus facilities and the spaces used by students.",
              href: "/facilities",
              label: "Explore facilities",
            },
            {
              title: "Life beyond lessons",
              body: "Discover clubs, activities and student experiences.",
              href: "/student-life",
              label: "Explore student life",
            },
          ],
        },
      ],
    },
    bn: {
      kicker: "কেন KCMSC",
      title:
        "প্রথম শ্রেণিকক্ষ থেকে দ্বাদশ শ্রেণি পর্যন্ত সংযুক্ত শিক্ষাযাত্রা।",
      intro:
        "KCMSC বাংলা ও ইংরেজি ভার্সনে জাতীয় শিক্ষাক্রম অনুসরণ করে প্লে গ্রুপ থেকে দ্বাদশ শ্রেণি পর্যন্ত শিক্ষা কার্যক্রম পরিচালনা করে। প্রতিটি ধাপকে স্পষ্ট ও সংযুক্ত রাখা আমাদের লক্ষ্য।",
      note: "এই পৃষ্ঠায় প্রতিষ্ঠানের বিদ্যমান শিক্ষার পরিসর ও সংশ্লিষ্ট পৃষ্ঠার লিংক দেওয়া হয়েছে; যাচাইবিহীন র‍্যাঙ্কিং বা ফলাফলের দাবি করা হয়নি।",
      sections: [
        {
          title: "পরিবারগুলো যা জানতে পারবেন",
          body: "প্রতিষ্ঠানের বিদ্যমান পৃষ্ঠাগুলো থেকে একাডেমিক কাঠামো, ক্যাম্পাস ও শিক্ষার্থীদের অভিজ্ঞতা সম্পর্কে জানুন।",
          items: [
            {
              title: "সংযুক্ত একাডেমিক যাত্রা",
              body: "প্রাথমিক পর্যায় থেকে উচ্চমাধ্যমিক পর্যন্ত শিক্ষার ধাপগুলো দেখুন।",
              href: "/academics",
              label: "একাডেমিক বিভাগ",
            },
            {
              title: "শেখার পরিবেশ",
              body: "ক্যাম্পাসের সুবিধা ও শিক্ষার্থীদের ব্যবহৃত স্থান সম্পর্কে জানুন।",
              href: "/facilities",
              label: "সুবিধাগুলো দেখুন",
            },
            {
              title: "পাঠ্যক্রমের বাইরের জীবন",
              body: "ক্লাব, কার্যক্রম ও শিক্ষার্থীদের অভিজ্ঞতা আবিষ্কার করুন।",
              href: "/student-life",
              label: "শিক্ষাজীবন দেখুন",
            },
          ],
        },
      ],
    },
  },
  virtual: {
    en: {
      kicker: "Explore the campus",
      title: "A closer look at the KCMSC campus.",
      intro:
        "This page is prepared to host a virtual campus experience using school-approved photographs, video or a guided tour.",
      note: "An interactive 360-degree tour is not yet connected. Until approved media is added, explore the existing campus and facilities information.",
      sections: [
        {
          title: "Explore campus spaces",
          body: "Start with the facilities page while a dedicated virtual tour is being prepared.",
          items: [
            {
              title: "Campus & Facilities",
              body: "Read about facilities and learning spaces already described on the website.",
              href: "/facilities",
              label: "Explore facilities",
            },
            {
              title: "Student Life",
              body: "See the wider student experience and campus activities.",
              href: "/student-life",
              label: "Explore student life",
            },
            {
              title: "Contact the school",
              body: "Contact KCMSC for further information about the campus.",
              href: "/contact",
              label: "Contact KCMSC",
            },
          ],
        },
      ],
    },
    bn: {
      kicker: "ক্যাম্পাস ঘুরে দেখুন",
      title: "KCMSC ক্যাম্পাসকে আরও কাছ থেকে জানুন।",
      intro:
        "বিদ্যালয়-অনুমোদিত ছবি, ভিডিও বা নির্দেশিত ট্যুরের মাধ্যমে ভার্চুয়াল ক্যাম্পাস অভিজ্ঞতা যুক্ত করার জন্য এই পৃষ্ঠা প্রস্তুত করা হয়েছে।",
      note: "ইন্টার‌্যাকটিভ ৩৬০-ডিগ্রি ট্যুর এখনো যুক্ত হয়নি। অনুমোদিত মিডিয়া যুক্ত হওয়ার আগ পর্যন্ত ক্যাম্পাস ও সুবিধা-সংক্রান্ত বিদ্যমান তথ্য দেখুন।",
      sections: [
        {
          title: "ক্যাম্পাসের বিভিন্ন স্থান",
          body: "ভার্চুয়াল ট্যুর প্রস্তুত হওয়ার সময় বিদ্যমান সুবিধা পৃষ্ঠা থেকে শুরু করুন।",
          items: [
            {
              title: "ক্যাম্পাস ও সুবিধা",
              body: "ওয়েবসাইটে বর্ণিত সুবিধা ও শিক্ষার স্থান সম্পর্কে জানুন।",
              href: "/facilities",
              label: "সুবিধা দেখুন",
            },
            {
              title: "শিক্ষাজীবন",
              body: "শিক্ষার্থীদের অভিজ্ঞতা ও ক্যাম্পাস কার্যক্রম দেখুন।",
              href: "/student-life",
              label: "শিক্ষাজীবন দেখুন",
            },
            {
              title: "যোগাযোগ",
              body: "ক্যাম্পাস সম্পর্কে আরও তথ্যের জন্য KCMSC-এর সঙ্গে যোগাযোগ করুন।",
              href: "/contact",
              label: "যোগাযোগ করুন",
            },
          ],
        },
      ],
    },
  },
};
export function InstitutionalLanding({
  locale,
  page,
}: {
  locale: Locale;
  page: keyof typeof content;
}) {
  const data = content[page]?.[locale];
  if (!data) notFound();
  const bn = locale === "bn";

  const ResourceLink = ({ item }: { item: Item }) => {
    if (!item.href) return null;
    const className =
      "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#08664D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064F3C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#08664D]";
    const label = item.label || (bn ? "আরও জানুন" : "Learn more");
    return item.external ? (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
        <span aria-hidden="true">↗</span>
      </a>
    ) : (
      <Link href={`/${locale}${item.href}`} className={className}>
        {label}
        <span aria-hidden="true">↗</span>
      </Link>
    );
  };

  if (page === "why") {
    const journey = bn
      ? [
          { n: "01", title: "শুরুর বছরগুলো", body: "Play Group থেকে প্রাথমিক পর্যায়: কৌতূহল, ভাষা, সংখ্যা ও শেখার অভ্যাস গড়ে তোলার ভিত্তি।", href: "/academics", link: "একাডেমিক কাঠামো দেখুন" },
          { n: "02", title: "মাধ্যমিক পর্যায়", body: "বিষয়ভিত্তিক শেখা, নিয়মিত অনুশীলন এবং শিক্ষার্থীদের আগ্রহ ও সক্ষমতা বিকাশের সময়।", href: "/academics", link: "শিক্ষার ধাপগুলো জানুন" },
          { n: "03", title: "উচ্চমাধ্যমিক পর্যায়", body: "Grade XI–XII-তে উচ্চশিক্ষা ও পরবর্তী পথের জন্য বিষয়ভিত্তিক প্রস্তুতি।", href: "/admissions", link: "ভর্তি-সংক্রান্ত তথ্য" },
        ]
      : [
          { n: "01", title: "The early years", body: "From Play Group through primary learning, children begin building language, numeracy, curiosity and the habits that support future learning.", href: "/academics", link: "Explore the academic structure" },
          { n: "02", title: "The secondary years", body: "Subject-based learning, regular practice and room for students to develop their interests and capabilities.", href: "/academics", link: "Understand the learning stages" },
          { n: "03", title: "Higher secondary", body: "Grades XI–XII offer the next stage of subject-focused study and preparation for further education.", href: "/admissions", link: "Find admission information" },
        ];
    const pathways = bn
      ? [
          { n: "A", title: "শেখার জন্য উপযোগী স্থান", body: "শ্রেণিকক্ষ, বিজ্ঞান ও কম্পিউটার ল্যাব এবং লাইব্রেরি প্রতিদিনের শেখার বিভিন্ন প্রয়োজনকে সহায়তা করে।", href: "/facilities", link: "ক্যাম্পাস ও সুবিধা" },
          { n: "B", title: "শ্রেণিকক্ষের বাইরেও শেখা", body: "ক্লাব, সহশিক্ষা কার্যক্রম ও শিক্ষার্থীদের উদ্যোগ আগ্রহকে কাজে লাগানোর সুযোগ তৈরি করে।", href: "/student-life", link: "শিক্ষাজীবন আবিষ্কার করুন" },
          { n: "C", title: "মানুষ ও দিকনির্দেশনা", body: "শিক্ষক, নেতৃত্ব ও স্কুলের সহায়ক পরিবেশ শিক্ষার্থীদের দৈনন্দিন অভিজ্ঞতার গুরুত্বপূর্ণ অংশ।", href: "/leadership-messages", link: "প্রতিষ্ঠানের নেতৃত্ব সম্পর্কে জানুন" },
        ]
      : [
          { n: "A", title: "Spaces made for learning", body: "Classrooms, science and computer laboratories, and library facilities support different needs throughout the school day.", href: "/facilities", link: "Explore campus and facilities" },
          { n: "B", title: "Learning beyond lessons", body: "Clubs, co-curricular activities and student initiatives give interests a place to grow beyond the timetable.", href: "/student-life", link: "Discover student life" },
          { n: "C", title: "People and guidance", body: "Teachers, school leadership and a supportive environment are important parts of a student’s everyday experience.", href: "/leadership-messages", link: "Meet the school’s leadership" },
        ];
    return (
      <main className="kc-why-journey bg-[#f8f7f1] text-[#173f32]">
        {/* The tall stage keeps the video pinned while the next section rises over it. */}
        <div className="kc-why-scroll-stage relative h-[140svh] -mb-[40svh]">
        <section className="kc-why-hero sticky top-0 isolate flex h-[100svh] min-h-[600px] overflow-hidden bg-[#102f25] text-[#fffdf7]">
          <video className="kc-why-hero-video absolute inset-0 -z-20 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster="/kcmsc/hero/kcmsc-building.jpg" aria-hidden="true">
            <source src="/videos/kcmsc-campus.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,34,25,.91)_0%,rgba(7,34,25,.76)_42%,rgba(7,34,25,.35)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(7,34,25,.74)_0%,transparent_55%)]" />
          <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-between px-6 pb-8 pt-20 sm:px-10 sm:pb-10 sm:pt-24 lg:px-14 lg:pb-12 lg:pt-28">
            <div className="max-w-4xl">
              <p className="kc-light-kicker">{bn ? "কেন KCMSC · আমাদের শিক্ষাযাত্রা" : "WHY KCMSC · OUR LEARNING JOURNEY"}</p>
              <h1 className="mt-6 max-w-5xl font-heading text-[clamp(3.15rem,8vw,7.8rem)] leading-[.88] tracking-[-.06em]">{bn ? "শেখার প্রতিটি ধাপে, সম্ভাবনার আরও কাছে।" : "A school journey shaped by learning, discovery and possibility."}</h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">{bn ? "প্লে গ্রুপ থেকে দ্বাদশ শ্রেণি পর্যন্ত বাংলা ও ইংরেজি ভার্সনে জাতীয় শিক্ষাক্রম অনুসরণ করে KCMSC শিক্ষার্থীদের শেখার ধারাবাহিক যাত্রায় সঙ্গী হয়।" : "From Play Group to Grade XII, KCMSC serves learners through Bangla and English Versions of the National Curriculum, connecting each stage of school life to the next."}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/${locale}/academics`} className="inline-flex min-h-12 items-center gap-3 border border-[#e6d69a] bg-[#e6d69a] px-5 text-sm font-semibold text-[#173f32] transition hover:bg-[#f3e7bd]">{bn ? "একাডেমিক কাঠামো দেখুন" : "Explore academics"}<span aria-hidden="true">↗</span></Link>
                <Link href={`/${locale}/admissions`} className="inline-flex min-h-12 items-center gap-3 border border-white/55 px-5 text-sm font-semibold text-white transition hover:bg-white/10">{bn ? "ভর্তি তথ্য" : "Admissions information"}<span aria-hidden="true">↗</span></Link>
              </div>
            </div>
            <div className="mt-16 grid gap-5 border-t border-white/30 pt-5 sm:grid-cols-3 sm:gap-8">
              <div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#e6d69a]">{bn ? "শিক্ষার পরিসর" : "LEARNING SPAN"}</p><p className="mt-2 font-heading text-2xl sm:text-3xl">{bn ? "প্লে গ্রুপ – দ্বাদশ" : "Play Group – Grade XII"}</p></div>
              <div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#e6d69a]">{bn ? "পাঠ্যক্রম" : "CURRICULUM"}</p><p className="mt-2 font-heading text-2xl sm:text-3xl">{bn ? "বাংলা ও ইংরেজি ভার্সন" : "Bangla & English Versions"}</p></div>
              <div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#e6d69a]">{bn ? "অবস্থান" : "LOCATION"}</p><p className="mt-2 font-heading text-2xl sm:text-3xl">{bn ? "দক্ষিণখান, ঢাকা" : "Dakshinkhan, Dhaka"}</p></div>
            </div>
          </div>
        </section>
        </div>

        <section className="kc-why-intro relative z-10 border-b border-[#deddd3] bg-[#fffdf7]">
          <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[.72fr_1.28fr] lg:px-12 lg:py-24">
            <div><p className="kc-classic-kicker">{bn ? "আমাদের দৃষ্টিভঙ্গি" : "THE KCMSC APPROACH"}</p><p className="mt-5 max-w-sm font-heading text-3xl leading-tight sm:text-4xl">{bn ? "শুধু একটি শ্রেণি নয়, শিক্ষার ধারাবাহিক পথ।" : "Not just the next class. A connected path through school."}</p></div>
            <div><h2 className="max-w-3xl font-heading text-[clamp(2rem,4.4vw,4.4rem)] leading-[.96] tracking-[-.045em]">{bn ? "প্রতিটি পর্যায়ের নিজস্ব প্রয়োজন আছে।" : "Every stage brings a different kind of growth."}</h2><p className="mt-6 max-w-3xl text-[15px] leading-8 text-[#5f6d64] sm:text-base">{bn ? "শিশুরা বড় হওয়ার সঙ্গে সঙ্গে তাদের শেখার ধরন, বিষয় ও দায়িত্ব বদলায়। তাই পরিবারগুলোর জন্য একাডেমিক ধাপ, ক্যাম্পাসের পরিবেশ এবং শিক্ষাজীবনের সুযোগগুলো একসঙ্গে বোঝা গুরুত্বপূর্ণ।" : "As students grow, their learning needs, subjects and responsibilities change. Families should be able to understand the academic stages alongside the spaces, people and experiences that shape school life."}</p><p className="mt-4 max-w-3xl text-[15px] leading-8 text-[#5f6d64] sm:text-base">{bn ? "এই পৃষ্ঠাটি KCMSC-এর বিদ্যমান বিভাগগুলোর সঙ্গে পরিচয় করিয়ে দেয়, যাতে প্রয়োজনীয় তথ্যের জন্য আলাদা আলাদা জায়গায় খুঁজতে না হয়।" : "This guide brings together the school’s existing information so families can move naturally from an overview to the details that matter to them."}</p></div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
          <div className="mb-10 grid gap-5 sm:grid-cols-[.8fr_1.2fr] sm:items-end"><div><p className="kc-classic-kicker">{bn ? "০১ · শিক্ষার ধাপ" : "01 · THE LEARNING JOURNEY"}</p><h2 className="mt-4 max-w-lg font-heading text-4xl leading-[.98] tracking-[-.04em] sm:text-5xl">{bn ? "শুরু থেকে পরবর্তী গন্তব্য।" : "From first steps to what comes next."}</h2></div><p className="max-w-xl text-sm leading-7 text-[#65736a] sm:justify-self-end sm:text-base">{bn ? "প্রতিটি পর্যায় সম্পর্কে বিস্তারিত জানতে একাডেমিক পৃষ্ঠায় যান।" : "Explore the stages of learning in more detail on the academics page."} <Link className="font-semibold text-[#08664d] underline decoration-[#c8ad56] underline-offset-4" href={`/${locale}/academics`}>{bn ? "একাডেমিক বিভাগ" : "Academics"} ↗</Link></p></div>
          <div className="grid border-y border-[#d8d8cd] md:grid-cols-3">{journey.map((item) => <article key={item.n} className="flex min-h-[255px] flex-col border-b border-[#d8d8cd] py-7 md:border-b-0 md:px-6 md:py-8 md:first:pl-0 md:last:pr-0 md:not(:first-child):border-l"><p className="text-xs font-semibold tracking-[.16em] text-[#b18620]">{item.n}</p><h3 className="mt-5 font-heading text-2xl leading-tight">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#647168]">{item.body}</p><Link className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-bold uppercase tracking-[.08em] text-[#08664d] hover:text-[#173f32]" href={`/${locale}${item.href}`}>{item.link}<span aria-hidden="true">↗</span></Link></article>)}</div>
        </section>

        <section className="bg-[#efeee6]">
          <div className="mx-auto max-w-[1240px] px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
            <div className="mb-10 grid gap-5 sm:grid-cols-[.8fr_1.2fr] sm:items-end"><div><p className="kc-classic-kicker">{bn ? "০২ · স্কুলজীবনের পরিসর" : "02 · THE WIDER SCHOOL EXPERIENCE"}</p><h2 className="mt-4 max-w-lg font-heading text-4xl leading-[.98] tracking-[-.04em] sm:text-5xl">{bn ? "শেখা শ্রেণিকক্ষেই শেষ হয় না।" : "Learning happens beyond the classroom."}</h2></div><p className="max-w-xl text-sm leading-7 text-[#65736a] sm:justify-self-end sm:text-base">{bn ? "ক্যাম্পাসের স্থান, সহশিক্ষা কার্যক্রম এবং মানুষের সঙ্গে পরিচিত হোন।" : "The campus, co-curricular activities and school community all contribute to a student’s experience."}</p></div>
            <div className="grid border-y border-[#d3d3c8] md:grid-cols-3">{pathways.map((item) => <article key={item.n} className="flex min-h-[270px] flex-col border-b border-[#d3d3c8] py-7 md:border-b-0 md:px-6 md:py-8 md:first:pl-0 md:last:pr-0 md:not(:first-child):border-l"><p className="text-xs font-semibold tracking-[.16em] text-[#b18620]">{item.n}</p><h3 className="mt-5 font-heading text-2xl leading-tight">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#647168]">{item.body}</p><Link className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-bold uppercase tracking-[.08em] text-[#08664d] hover:text-[#173f32]" href={`/${locale}${item.href}`}>{item.link}<span aria-hidden="true">↗</span></Link></article>)}</div>
          </div>
        </section>

        <section className="bg-[#fffdf7]">
          <div className="mx-auto grid max-w-[1240px] gap-8 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center lg:px-12 lg:py-20"><div><p className="kc-classic-kicker">{bn ? "পরিবারের জন্য পরবর্তী ধাপ" : "FOR FAMILIES"}</p><h2 className="mt-4 max-w-3xl font-heading text-4xl leading-[.98] tracking-[-.04em] sm:text-5xl">{bn ? "আপনার প্রয়োজনীয় তথ্য এখান থেকেই খুঁজে নিন।" : "Find the information you need to take the next step."}</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-[#65736a] sm:text-base">{bn ? "ভর্তি, স্কুলের সঙ্গে যোগাযোগ এবং সাম্প্রতিক ঘোষণার জন্য সংশ্লিষ্ট বিভাগে যান।" : "Continue to admissions, contact the school, or check official notices for current information."}</p></div><div className="flex flex-wrap gap-3 lg:justify-end"><Link href={`/${locale}/admissions`} className="inline-flex min-h-12 items-center gap-3 bg-[#08664d] px-5 text-sm font-semibold text-white transition hover:bg-[#064f3c]">{bn ? "ভর্তি" : "Admissions"} ↗</Link><Link href={`/${locale}/notices`} className="inline-flex min-h-12 items-center gap-3 border border-[#b8c4ba] px-5 text-sm font-semibold text-[#173f32] transition hover:bg-[#f1f0e8]">{bn ? "নোটিশ" : "Official notices"} ↗</Link><Link href={`/${locale}/contact`} className="inline-flex min-h-12 items-center gap-3 border border-[#b8c4ba] px-5 text-sm font-semibold text-[#173f32] transition hover:bg-[#f1f0e8]">{bn ? "যোগাযোগ" : "Contact"} ↗</Link></div></div>
        </section>
      </main>
    );
  }

  if (page === "downloads") {
    const categories = data.sections[0];
    if (!categories) {
      return null;
    }
    const documents = data.sections.slice(1);
    const categoryIcons = ["▤", "◉", "▱"];
    return (
      <main className="bg-[#F3F6F5] text-[#123B32]">
        <section className="border-b border-[#D9E2DA] bg-[#FFFCF5]">
          <div className="mx-auto grid max-w-[1240px] items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.15fr_.85fr] lg:gap-12">
            <div>
              <span className="kc-classic-kicker">{data.kicker}</span>
              <h1 className="mt-4 max-w-4xl font-heading text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] tracking-[-.045em] text-[#104B3B]">
                {bn
                  ? "প্রয়োজনীয় নথি, এক জায়গায়।"
                  : "Useful documents, all in one place."}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#526579] sm:text-lg">
                {data.intro}
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-[#E1E4D8] bg-white p-7 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF1E8] text-2xl text-[#08664D]"
                    aria-hidden="true"
                  >
                    ▤
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#104B3B]">
                      {bn ? "ডাউনলোড লাইব্রেরি" : "Downloads library"}
                    </p>
                    <p className="mt-1 text-sm text-[#64748B]">
                      {bn
                        ? "ফর্ম ও প্রয়োজনীয় নথি"
                        : "Forms and essential documents"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {documents.map((section) => (
                    <div
                      key={section.title}
                      className="flex items-center justify-between gap-4 border-t border-[#E7EBE6] py-3"
                    >
                      <div>
                        <p className="font-medium text-[#173F35]">
                          {section.title}
                        </p>
                        <p className="mt-1 text-sm text-[#64748B]">
                          {section.items.length}{" "}
                          {bn
                            ? "টি নথি"
                            : section.items.length === 1
                              ? "document"
                              : "documents"}
                        </p>
                      </div>
                      <span
                        className="text-xl text-[#0B7657]"
                        aria-hidden="true"
                      >
                        ↓
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-10 sm:px-8 sm:py-12">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="kc-classic-kicker">
                {bn ? "সহজে খুঁজুন" : "QUICK ACCESS"}
              </span>
              <h2 className="mt-2 font-heading text-3xl tracking-[-.03em] text-[#104B3B] sm:text-4xl">
                {categories.title}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[#5C6E7F]">
              {categories.body}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {categories.items.map((item, i) => (
              <article
                key={item.title}
                className="flex h-full flex-col rounded-xl border border-[#DDE4DC] bg-[#FFFEFA] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF1E8] text-2xl font-semibold text-[#08664D]"
                    aria-hidden="true"
                  >
                    {categoryIcons[i] || "▤"}
                  </span>
                  <div>
                    <h3 className="font-heading text-xl leading-snug text-[#123B32]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-base leading-6 text-[#5D6D7D]">
                      {item.body}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-3">
                  {item.href &&
                    (item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-[#08664D] underline-offset-4 hover:underline"
                      >
                        {item.label} ↗
                      </a>
                    ) : (
                      <Link
                        href={`/${locale}${item.href}`}
                        className="text-sm font-bold text-[#08664D] underline-offset-4 hover:underline"
                      >
                        {item.label} ↗
                      </Link>
                    ))}
                  <span className="text-xl text-[#95A29B]" aria-hidden="true">
                    ›
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 space-y-8">
            {documents.map((section, i) => (
              <section
                key={section.title}
                aria-labelledby={`download-section-${i}`}
              >
                <div className="mb-4 flex flex-col gap-2 border-b border-[#D9E2DA] pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="kc-classic-kicker">
                      {bn
                        ? `নথির বিভাগ ০${i + 1}`
                        : `DOCUMENT CATEGORY 0${i + 1}`}
                    </span>
                    <h2
                      id={`download-section-${i}`}
                      className="mt-2 font-heading text-2xl leading-tight tracking-[-.025em] text-[#104B3B] sm:text-3xl"
                    >
                      {section.title}
                    </h2>
                  </div>
                  <p className="max-w-xl text-base leading-6 text-[#5C6E7F]">
                    {section.body}
                  </p>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {section.items.map((item) => (
                    <article
                      key={item.title}
                      className="flex flex-col gap-5 rounded-xl border border-[#DDE4DC] bg-[#FFFEFA] p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-6"
                    >
                      <div className="flex min-w-0 gap-4">
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF1E8] text-2xl text-[#08664D]"
                          aria-hidden="true"
                        >
                          ▤
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-heading text-xl leading-snug text-[#123B32] sm:text-2xl">
                            {item.title}
                          </h3>
                          <p className="mt-2 max-w-2xl text-base leading-7 text-[#5D6D7D]">
                            {item.body}
                          </p>
                          <p className="mt-3 text-xs font-semibold uppercase tracking-[.12em] text-[#718174]">
                            PDF <span className="mx-2 text-[#B7A56E]">•</span>{" "}
                            {i === 0
                              ? bn
                                ? "ফর্ম"
                                : "Official form"
                              : bn
                                ? "প্রশাসনিক ফর্ম"
                                : "Staff form"}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 sm:self-end">
                        <ResourceLink item={item} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#F8FAFC] text-[#23352c]">
      <section className="border-b border-[#D9E2EC] bg-[#fffdf8]">
        <div className="mx-auto max-w-[1240px] px-6 pb-14 pt-16 sm:px-10 sm:pb-20 sm:pt-24">
          <span className="kc-classic-kicker">{data.kicker}</span>
          <h1 className="mt-5 max-w-4xl font-heading text-[clamp(2.7rem,6vw,5.8rem)] leading-[.94] tracking-[-.05em] text-[#12324A]">
            {data.title}
          </h1>
          <p className="mt-7 max-w-3xl text-[15px] leading-7 text-[#64748B] sm:text-base">
            {data.intro}
          </p>
          <p className="mt-6 max-w-3xl border-l-2 border-[#d5bd75] pl-4 text-sm leading-6 text-[#707770]">
            {data.note}
          </p>
        </div>
      </section>

      <section className="kc-classic-section">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
          {page === "calendar" && <AcademicCalendar locale={locale} />}
          {data.sections.map((section, i) => (
            <div key={section.title} className="mb-14 last:mb-0">
              <div className="grid gap-6 border-b border-[#D9E2EC] pb-6 md:grid-cols-[.7fr_1.3fr]">
                <div>
                  <span className="kc-classic-kicker">
                    {bn ? `বিভাগ ০${i + 1}` : `SECTION 0${i + 1}`}
                  </span>
                  <h2 className="mt-3 font-heading text-3xl leading-tight tracking-[-.035em] text-[#12324A] sm:text-4xl">
                    {section.title}
                  </h2>
                </div>
                <p className="max-w-2xl self-end text-sm leading-7 text-[#64748B]">
                  {section.body}
                </p>
              </div>
              <div className="grid gap-0 md:grid-cols-3">
                {section.items.map((item, j) => (
                  <article
                    key={item.title}
                    className="flex min-h-[205px] flex-col border-b border-[#D9E2EC] py-7 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                  >
                    <span className="text-[11px] font-semibold tracking-[.15em] text-[#9A854A]">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 font-heading text-xl text-[#12324A]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#64748B]">
                      {item.body}
                    </p>
                    {item.href &&
                      (item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex pt-5 text-xs font-semibold uppercase tracking-[.08em] text-[#176b45] hover:text-[#12324A]"
                        >
                          {item.label || (bn ? "আরও জানুন" : "Learn more")}{" "}
                          <span className="ml-2" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      ) : (
                        <Link
                          href={`/${locale}${item.href}`}
                          className="mt-auto inline-flex pt-5 text-xs font-semibold uppercase tracking-[.08em] text-[#176b45] hover:text-[#12324A]"
                        >
                          {item.label || (bn ? "আরও জানুন" : "Learn more")}{" "}
                          <span className="ml-2" aria-hidden="true">
                            ↗
                          </span>
                        </Link>
                      ))}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
