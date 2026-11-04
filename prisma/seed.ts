/**
 * Bootstraps the very first administrator account.
 *
 * Run once against a fresh database: `npm run prisma:seed`
 *
 * It does NOT create a User with a guessable/hardcoded password. Instead
 * it issues an AccountInvitation for FIRST_ADMIN_EMAIL (from .env) and
 * prints the one-time setup link. Whoever controls that inbox opens the
 * link, chooses their own password, and that becomes the first ADMIN
 * account — the same accept-invite flow every subsequent admin uses.
 *
 * Safe to re-run: if an ADMIN already exists, or an unexpired invitation
 * for this email already exists, it does nothing rather than issuing a
 * confusing second link.
 */
import { prisma } from "../src/lib/db";
import { createInvitation } from "../src/lib/invitation";

// Real content transcribed from KCMSC_profile.pdf — the same facts used
// to build the Phase 2 static pages. Seeding it into the database means
// the public site keeps showing this real information immediately after
// the first migration, rather than going blank until an admin manually
// re-enters everything through the CMS. Nothing here is invented — see
// src/i18n/en.json for the same facts in the pre-CMS static dictionary.

const achievements = [
  {
    titleEn: "National ICT Olympiad Award Winner",
    titleBn: "জাতীয় আইসিটি অলিম্পিয়াড পুরস্কার বিজয়ী",
    descriptionEn:
      "Aymanur Rahman (Class 2, English Version) — Champion; Syed Adiyan Ahsan (Class 3, English Version) — First Runner-Up; Khan Jarif Al Nasib (Class 8, English Version) — First Runner-Up.",
    descriptionBn:
      "আইমানুর রহমান (দ্বিতীয় শ্রেণি, ইংরেজি ভার্সন) — চ্যাম্পিয়ন; সৈয়দ আদিয়ান আহসান (তৃতীয় শ্রেণি, ইংরেজি ভার্সন) — প্রথম রানার-আপ; খান জারিফ আল নাসিব (অষ্টম শ্রেণি, ইংরেজি ভার্সন) — প্রথম রানার-আপ।",
    year: 2025,
    category: "National ICT Olympiad",
    isFeatured: true
  },
  {
    titleEn: "National IQ Olympiad Winner",
    titleBn: "জাতীয় আইকিউ অলিম্পিয়াড বিজয়ী",
    descriptionEn:
      "Nabiha Nur (Class 3, English Version) — Medal of Excellence; Nabila Nur (Preschool/KG, English Version) — Medal of Excellence.",
    descriptionBn:
      "নাবিহা নূর (তৃতীয় শ্রেণি, ইংরেজি ভার্সন) — মেডেল অব এক্সিলেন্স; নাবিলা নূর (প্রি-স্কুল/কেজি, ইংরেজি ভার্সন) — মেডেল অব এক্সিলেন্স।",
    year: 2025,
    category: "National IQ Olympiad",
    isFeatured: true
  },
  {
    titleEn: "PBGSI Government Grant Recipient",
    titleBn: "পিবিজিএসআই সরকারি অনুদান প্রাপ্তি",
    descriptionEn:
      "KCMSC was awarded the Performance Based Grants to Secondary Institutions (PBGSI) grant under government funding initiatives, in recognition of its commitment to quality education and institutional development.",
    descriptionBn:
      "মানসম্মত শিক্ষা ও প্রাতিষ্ঠানিক উন্নয়নের প্রতি অঙ্গীকারের স্বীকৃতিস্বরূপ কেসিএমএসসি পিবিজিএসআই অনুদান লাভ করে।",
    year: 2025,
    category: "Institutional Recognition",
    isFeatured: true
  },
  {
    titleEn: "SSC 2024 Results",
    titleBn: "এসএসসি ২০২৪ ফলাফল",
    descriptionEn: "130 appeared, 128 passed — 98.48% pass rate, 67 students achieved GPA 5.",
    descriptionBn: "১৩০ জন পরীক্ষায় অংশগ্রহণ করে, ১২৮ জন উত্তীর্ণ — পাসের হার ৯৮.৪৮%, ৬৭ জন জিপিএ ৫ অর্জন করে।",
    year: 2024,
    category: "Board Exam Results",
    isFeatured: false
  },
  {
    titleEn: "HSC 2024 Results",
    titleBn: "এইচএসসি ২০২৪ ফলাফল",
    descriptionEn: "47 appeared, 47 passed — 100% pass rate, 13 students achieved GPA 5.",
    descriptionBn: "৪৭ জন পরীক্ষায় অংশগ্রহণ করে, ৪৭ জন উত্তীর্ণ — পাসের হার ১০০%, ১৩ জন জিপিএ ৫ অর্জন করে।",
    year: 2024,
    category: "Board Exam Results",
    isFeatured: false
  },
  {
    titleEn: "2022 Primary Scholarship Examination Results",
    titleBn: "২০২২ প্রাইমারি বৃত্তি পরীক্ষার ফলাফল",
    descriptionEn: "12 total scholarship holders — 9 in the Talent Pool category and 3 in the General Grade category.",
    descriptionBn: "মোট ১২ জন বৃত্তিপ্রাপ্ত — ট্যালেন্ট পুল ক্যাটাগরিতে ৯ জন এবং জেনারেল গ্রেড ক্যাটাগরিতে ৩ জন।",
    year: 2022,
    category: "Primary Scholarship Examination",
    isFeatured: false
  }
];

const clubs = [
  {
    nameEn: "Sports Club",
    nameBn: "স্পোর্টস ক্লাব",
    descriptionEn: "Cricket, football, and basketball courts.",
    descriptionBn: "ক্রিকেট, ফুটবল ও বাস্কেটবল কোর্ট।",
    isFeatured: true
  },
  {
    nameEn: "KC Information and Communication Club (KCICT)",
    nameBn: "কেসি তথ্য ও যোগাযোগ ক্লাব (কেসিআইসিটি)",
    descriptionEn: "Robotics and coding.",
    descriptionBn: "রোবোটিক্স ও কোডিং।",
    isFeatured: true
  },
  {
    nameEn: "Music Club",
    nameBn: "মিউজিক ক্লাব",
    descriptionEn: "Instruments including piano, guitar, and tabla.",
    descriptionBn: "পিয়ানো, গিটার, তবলাসহ বিভিন্ন বাদ্যযন্ত্র।",
    isFeatured: false
  },
  {
    nameEn: "Scout Troop",
    nameBn: "স্কাউট দল",
    descriptionEn: "Community service and leadership.",
    descriptionBn: "কমিউনিটি সেবা ও নেতৃত্ব বিকাশ।",
    isFeatured: false
  },
  {
    nameEn: "Language Club",
    nameBn: "ল্যাঙ্গুয়েজ ক্লাব",
    descriptionEn: "",
    descriptionBn: "",
    isFeatured: false
  },
  {
    nameEn: "Alumni Association",
    nameBn: "অ্যালামনাই অ্যাসোসিয়েশন",
    descriptionEn:
      "Reunions, career talks, and mentorship programs connecting alumni with current students. 50 active members as of the most recent count.",
    descriptionBn:
      "প্রাক্তন ও বর্তমান শিক্ষার্থীদের সংযুক্ত রাখতে পুনর্মিলনী, ক্যারিয়ার আলোচনা ও মেন্টরশিপ প্রোগ্রাম। সর্বশেষ হিসাব অনুযায়ী ৫০ জন সক্রিয় সদস্য।",
    isFeatured: false
  }
];

const facilities = [
  { titleEn: "Air-conditioned computer lab (50+ PCs, high-speed internet)", titleBn: "শীতাতপনিয়ন্ত্রিত কম্পিউটার ল্যাব (৫০+ পিসি)", isFeatured: true },
  { titleEn: "Science labs — Physics, Chemistry, Biology, and Mathematics", titleBn: "বিজ্ঞান ল্যাব — পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও গণিত", isFeatured: true },
  { titleEn: "Library with 10,000+ books and digital resources", titleBn: "১০,০০০+ বই ও ডিজিটাল রিসোর্সসহ লাইব্রেরি", isFeatured: true },
  { titleEn: "Rooftop garden with botany projects", titleBn: "উদ্ভিদবিজ্ঞান প্রকল্পসহ ছাদ বাগান", isFeatured: true },
  { titleEn: "Day Care room", titleBn: "ডে কেয়ার রুম", isFeatured: false },
  { titleEn: "Conference room", titleBn: "কনফারেন্স রুম", isFeatured: false },
  { titleEn: "Two separate library rooms for primary and secondary students", titleBn: "প্রাইমারি ও সেকেন্ডারির জন্য দুটি পৃথক লাইব্রেরি রুম", isFeatured: false },
  { titleEn: "High-capacity backup generator for power outages", titleBn: "বিদ্যুৎ বিভ্রাটের জন্য ব্যাকআপ জেনারেটর", isFeatured: false },
  { titleEn: "Advanced water purification filters on every floor", titleBn: "প্রতিটি ফ্লোরে পানি বিশুদ্ধিকরণ ফিল্টার", isFeatured: false },
  { titleEn: "Organized transportation facilities for students", titleBn: "শিক্ষার্থীদের জন্য পরিবহন সুবিধা", isFeatured: false },
  { titleEn: "Residential facilities for students living in remote areas", titleBn: "দূরবর্তী শিক্ষার্থীদের জন্য আবাসিক সুবিধা", isFeatured: false },
  { titleEn: "A childcare centre for working mothers", titleBn: "কর্মজীবী মায়েদের জন্য চাইল্ডকেয়ার সেন্টার", isFeatured: false },
  { titleEn: "Security and academic activities monitored through CCTV", titleBn: "সিসিটিভি নজরদারির মাধ্যমে নিরাপত্তা পর্যবেক্ষণ", isFeatured: false }
].map((f) => ({ ...f, descriptionEn: "", descriptionBn: "" }));


async function seedContent() {
  const achievementCount = await prisma.achievement.count();
  if (achievementCount === 0) {
    await prisma.achievement.createMany({ data: achievements });
    console.log(`Seeded ${achievements.length} achievements.`);
  }

  const clubCount = await prisma.club.count();
  if (clubCount === 0) {
    await prisma.club.createMany({ data: clubs });
    console.log(`Seeded ${clubs.length} clubs.`);
  }

  const facilityCount = await prisma.facility.count();
  if (facilityCount === 0) {
    await prisma.facility.createMany({ data: facilities });
    console.log(`Seeded ${facilities.length} facilities.`);
  }

  // Deliberately NOT seeding Notice or Career rows — the source material
  // contains no real notices or vacancies, and the brief is explicit
  // that these must never be fabricated (§16, §35).

}

async function main() {
  await seedContent();

  const email = process.env.FIRST_ADMIN_EMAIL;
  if (!email) {
    throw new Error("FIRST_ADMIN_EMAIL is not set in the environment.");
  }

  const existingAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (existingAdmin) {
    console.log(`An ADMIN account already exists (${existingAdmin.email}). Nothing to do.`);
    return;
  }

  const pendingInvite = await prisma.accountInvitation.findFirst({
    where: {
      email: email.toLowerCase().trim(),
      acceptedAt: null,
      expiresAt: { gt: new Date() }
    }
  });
  if (pendingInvite) {
    console.log(
      `An unexpired invitation for ${email} already exists (expires ${pendingInvite.expiresAt.toISOString()}). ` +
        "Not issuing a new one — if it was lost, delete that AccountInvitation row and re-run this script."
    );
    return;
  }

  const { rawToken, expiresAt } = await createInvitation({
    email,
    role: "ADMIN",
    createdById: null
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  console.log("\nFirst-admin invitation created.");
  console.log(`Expires: ${expiresAt.toISOString()}`);
  console.log("Send this link to the first administrator (it is shown only once):\n");
  console.log(`${appUrl}/admin/accept-invite?token=${rawToken}\n`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
