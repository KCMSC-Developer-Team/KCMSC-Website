import Image from "next/image";
import { LeadershipPortrait } from "@/components/leadership/LeadershipPortrait";
import { getDictionary, isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

type Message = {
  number: string;
  roleEn: string;
  roleBn: string;
  name: string;
  titleEn: string;
  titleBn: string;
  image: string;
  body: string[];
  quote?: string;
};

const messages: Message[] = [
  {
    number: "01",
    roleEn: "Chairman’s Message",
    roleBn: "চেয়ারম্যানের বার্তা",
    name: "মোঃ খসরু চৌধুরী",
    titleEn:
      "Chairman, K C Model School & College & K C Foundation · Managing Director, Nipa Group",
    titleBn:
      "চেয়ারম্যান, কে সি মডেল স্কুল অ্যান্ড কলেজ ও কে সি ফাউন্ডেশন · ব্যবস্থাপনা পরিচালক, নীপা গ্রুপ",
    image: "/kcmsc/leadership/chairman.jpg",
    body: [
      "ঢাকা উত্তর সিটি কর্পোরেশনের বিশ্বরোড এলাকা থেকে তুরাগ নদীর তীর পযন্ত এলাকাটি রেল লাইন দ্বারা পূর্ব ও পশ্চিমে দু’ভাগে বিভক্ত। রেল লাইনের পূর্ব দিকটিতে এক বিশাল জনগোষ্ঠি বসবাস করলেও এটি ছিল সব দিক থেকে অবহেলিত, নাগরিক সুবিধা-বঞ্চিত। এখানে উচ্চ শিক্ষার বিদ্যাপিঠ ছিল অভাবনীয়; এমনকি একটি ভালো স্কুল-কলেজও ছিল না। এখানে কোন উন্নত হাসপাতাল বা উল্লেখযোগ্য কোন স্থাপনা পর্যন্ত ছিল না। এখানকার যুব সমাজ নানা সামাজিক ব্যাধিতে আক্রান্ত ছিল। সন্ত্রাস, মাদকাসক্তি, ইভটিজিং ইত্যাদি এলাকার পরিবেশকে বিষাক্ত করে তুলেছিল। দীর্ঘদিন এ এলাকায় বসবাস করছি বিধায় এখানকার বাসিন্দাদের প্রতি একটি দায়বদ্ধতা থেকে কিছু একটা করার তাগিদ অনুভব করি। সিদ্ধান্ত নেই একটি আধুনিক শিক্ষা প্রতিষ্ঠান ও হাসপাতাল গড়ে তুলবো। আমার সহধর্মীনী নীপা চৌধুরীও এ কাজে আমাকে উৎসাহ জোগান। ২০১২ সালে আমার বাসা সংলগ্ন নিজের মালিকানাধীন ৩৯ শতাংশের প্লটে কে সি মডেল স্কুল অ্যান্ড কলেজ ভবনের কাজ শুরু করি এবং তিন বছরের মধ্যে নির্মাণ কাজ শেষ করি।",
      "অতঃপর প্রায় ২২০০ জন শিক্ষার্থী নিয়ে ১ জানুয়ারি ২০১৫ সালে যাত্রা শুরু করে এ প্রতিষ্ঠান। প্রথম বছরেই এ প্রতিষ্ঠানের শিক্ষা, সহশিক্ষা ও ব্যতিক্রমী কর্মকাণ্ড বিশিষ্টজনদের মনোযোগ আকর্ষণে সমর্থ হয়। এরই ফলশ্রুতিতে প্রথম বছরেই শিক্ষা মন্ত্রণালয়ে প্রতিষ্ঠানে নবম ও দশম শ্রেণিতে পাঠদানের অনুমতি প্রদান করে। পরের বছর অর্থাৎ ২০১৬ সাল থেকে একাদশ-দ্বাদশ শ্রেণিতে পাঠদানের অনুমতি পাওয়া যায়। এর মাধ্যমে এ প্রতিষ্ঠানে প্রাক-প্রাথমিক শিক্ষা থেকে শুরু করে দ্বাদশ শ্রেণি পর্যন্ত পাঠদানের সুযোগ অবারিত হয়। এত অল্প সময়ে কোন প্রতিষ্ঠানের পক্ষে এত বড় স্বীকৃতি খুবই বিরল। কে সি মডেল স্কুল অ্যান্ড কলেজ যেহেতু একটি আদর্শ শিক্ষা প্রতিষ্ঠান তাই উন্নত ও আধুনিক শিক্ষার সব ধরনের সুযোগ ও আয়োজন এখানে রয়েছে। এ বিদ্যাপীঠে যুগোপযোগী ও কার্যকর শিক্ষা লাভ করে প্রতিষ্ঠানের শিক্ষার্থীবৃন্দ নিশ্চিত সাফল্য অর্জন করবে এবং বিশ্ব নাগরিক হিসেবে গড়ে উঠবে এটাই আমার একান্ত চাওয়া।",
      "এ প্রতিষ্ঠানের প্রধান উপদেষ্টার দিক নির্দেশনা, অধ্যক্ষ ও উপাধ্যক্ষবৃন্দের দক্ষ পরিচালনা, শিক্ষকমণ্ডলীর আন্তরিক পাঠদান, জীবনমূখী ও সৃজনশীল শিক্ষার অনুশীলন, বিদ্যালয় ব্যবস্থাপনা কমিটির সুচিন্তিত পরামর্শ ও সহযোগিতায় কে সি মডেল স্কুল অ্যান্ড কলেজ তার স্বীয় গৌরব অক্ষুণ্ণ রেখে উত্তরোত্তর সাফল্য ও সমৃদ্ধির দিকে এগিয়ে যাবে, এটা আমার দৃঢ় বিশ্বাস।",
      "প্রতিষ্ঠানের ওয়েবসাইটটি নতুন আঙ্গিকে আরও আকর্ষণীয়ভাবে পুনঃপ্রবর্তনে আমি অত্যন্ত আনন্দিত। এর সাথে সংশ্লিষ্ট সকলকে জানাই আন্তরিক মোবারকবাদ।",
    ],
  },

  {
    number: "02",
    roleEn: "Vice Chairman’s Message",
    roleBn: "ভাইস চেয়ারম্যানের বার্তা",
    name: "নীপা চৌধুরী",
    titleEn: "Vice Chairman, K C Model School & College",
    titleBn: "ভাইস চেয়ারম্যান, কে সি মডেল স্কুল অ্যান্ড কলেজ",
    image: "/kcmsc/leadership/vice-chairman.jpg",
    quote: "মনুষ্যত্বের শিক্ষাটাই চরম শিক্ষা আর সমস্তই তার অধীন।",
    body: [
      "শিক্ষা মানে কিছু পুঁথিগত বিদ্যা মস্তিষ্কে ধারণ করা নয়। শিক্ষা মানে হলো পারিপার্শ্বিক সবকিছু থেকে জ্ঞান আহরণ করা এবং সেটি হতে হবে এমন কিছু যা ব্যক্তির জন্য সুফল বয়ে আনবে এবং নিজের যা কিছু সুকুমার বৃত্তি তা সকলের মাঝে ছড়িয়ে দেওয়ার মানসিকতা থাকতে হবে৷",
      "উত্তরায় অবস্হিত অত্যাধুনিক শিক্ষা প্রতিষ্ঠান কে সি মডেল স্কুল অ্যান্ড কলেজ তার নিজস্ব সাফল্যের ধারাবাহিকতায় ইতোমধ্যে অনেকের কাছেই সুপরিচিত হয়ে উঠেছে। এর যাত্রা আরো একধাপ এগিয়ে নেওয়ার লক্ষ্যে প্রযুক্তির উৎকর্ষে আলোকিত হয়ে স্কুলের ওয়েবসাইট নতুন আঙ্গিকে সাজানো হয়েছে। পৃথিবীর যেকোনো প্রান্তেই মানুষ যেন আমাদের কর্মকাণ্ড সম্পর্কে জ্ঞাত হতে পারে সেজন্যই এ উদ্যোগ। যে জাতি যতো বেশি শিক্ষিত সে জাতি ততোটাই উন্নত। বর্তমান সরকারের শিক্ষা খাত এবং প্রযুক্তি নিয়ে সুদূর-প্রসারি পরিকল্পনা ও এর বাস্তবায়ন দেশকে এগিয়ে নিয়ে যাচ্ছে। বিশ্বের দরবারে মাথা উঁচু করে দাঁড়িয়ে দেশের সুনাম অর্জনের লক্ষ্যে ভালো শিক্ষা প্রতিষ্ঠানের বিকল্প নাই। কে সি মডেল স্কুল অ্যান্ড কলেজ দক্ষ পরিচালকমন্ডলী ও একঝাঁক তরুণ, মেধাবী শিক্ষকের সমন্বয়ে স্বয়ংসম্পূর্ণ ও দৃষ্টিনন্দন একটা শিক্ষা প্রতিষ্ঠান। শিক্ষার মানের ব্যাপারে আমরা আপোষহীন।",
      "সবশেষে প্রতিষ্ঠানের প্রতিষ্ঠাতা ভাইস চেয়ারম্যান হিসেবে কে সি মডেল স্কুল অ্যান্ড কলেজের জন্য নিরন্তর শুভকামনা।",
    ],
  },

  {
    number: "03",
    roleEn: "Chief Advisor’s Message",
    roleBn: "প্রধান উপদেষ্টার বার্তা",
    name: "ব্রিঃ জেঃ এ এস এম মুশফিকুর রহমান (অব), এসপিপি, পিএসসি",
    titleEn:
      "Chief Advisor, K C Model School & College · Former Director of Education, Bangladesh Army · Former Principal, RAJUK Uttara Model College & Pabna Cadet College",
    titleBn:
      "প্রধান উপদেষ্টা, কে সি মডেল স্কুল অ্যান্ড কলেজ · সাবেক শিক্ষা পরিচালক, বাংলাদেশ সেনাবাহিনী · সাবেক অধ্যক্ষ, রাজউক উত্তরা মডেল কলেজ ও পাবনা ক্যাডেট কলেজ",
    image: "/kcmsc/leadership/chief-advisor.jpg",
    body: [
      "বিশ্বায়ন ও তথ্য-প্রযুক্তির অভাবনীয় উৎকর্ষের এ যুগে শিক্ষা কেমন হওয়া উচিৎ? এ প্রশ্নের সর্বজন স্বীকৃত সহজ কোন উত্তর নেই। তবে আমার বিবেচনায় বর্তমান সময়ের শিক্ষা হতে হবে শিক্ষার্থীবান্ধব, জীবন ঘনিষ্ঠ, মানবিক, বিজ্ঞানমুখী ও সর্বাঙ্গীন। এ ধরণের শিক্ষাই কেবল দূরদৃষ্টিসম্পন্ন, দক্ষ ও মানবিক গুণাবলীসম্পন্ন ভবিষ্যৎ প্রজন্ম গড়ে তুলতে সক্ষম। কে সি মডেল স্কুল অ্যান্ড কলেজ সে লক্ষ্যেই কাজ করছে। এ প্রতিষ্ঠানটির গৃহীত নানামুখী উদ্যোগ ও কর্মকাণ্ড এরই মধ্যে বিদগ্ধজনের দৃষ্টি কেড়েছে।",
      "অতি স্বল্প সময়ে এ প্রতিষ্ঠানের পরিচিতি ও খ্যাতি ঢাকা মহানগর ছাড়িয়ে অনেক মফস্বল শহর পর্যন্ত ব্যাপৃত হয়েছে। মেধা ও অভিজ্ঞতার ভিত্তিতে নির্বাচিত শিক্ষকবৃন্দের ক্রমাগত পেশাগত উন্নয়ন এ প্রতিষ্ঠানের একটি বড় বৈশিষ্ট। তাদের পাঠদানের মান এবং শিক্ষার্থীদের প্রতি তাদের মনোভাব ও আচরণ নিয়মিত পর্যবেক্ষণ করে প্রয়োজনীয় দিকনির্দেশনা প্রদান করা হয়। এ প্রতিষ্ঠানে পা রাখলেই এর সুশৃঙ্খল, পরিচ্ছন্ন ও শিক্ষার্থী-বান্ধব পরিবেশ সবার নজর কাড়ে।",
      "এ প্রতিষ্ঠানে বিভিন্ন ক্লাব কাযক্রমের মাধ্যমে পাঠ্যক্রমকে বৈচিত্রপূর্ণ ও সবাঙ্গীন করার প্রয়াস সহজেই লক্ষণীয়। সারা বছরের সব গুরুত্বপূর্ণ কর্মকাণ্ড একটি একাডেমিক পঞ্জিকায় সন্নিবেশিত করার মাধ্যমে শিক্ষক, শিক্ষার্থী, অভিভাবক সবার জন্য ছুটি, বিনোদন ও অন্যান্য কার্যক্রম আগাম পরিকল্পনা করা সহজ হয়ে পড়ে। প্রতিষ্ঠানের আর্থিক খাত ব্যবস্থাপনাও করা হয় দক্ষতার সাথে। এজন্যই তুলনামূলকভাবে অনেক কম ছাত্র বেতন নিয়েও এ প্রতিষ্ঠান গুণগত শিক্ষা নিশ্চিত করার পাশাপাশি জাগ-জমকপূর্ণভাবে বিভিন্ন জাতীয় দিবস, নবীন বরণ, বার্ষিক ক্রিড়া প্রতিযোগিতাসহ নানাবিধ কর্মকাণ্ড সহজেই পরিচালনা করতে পারে।",
      "নবীন শিক্ষার্থীদের মেধা, মনন ও সৃজনশীলতা বিকাশে কে সি মডেল স্কুল অ্যান্ড কলেজ-এর ইতিবাচক ও সৃষ্টিধর্মী উদ্যোগ ইতোমধ্যে শিক্ষার্থী, অভিভাবক ও শিক্ষানুরাগী ব্যক্তিবর্গের নিকট প্রশংসিত হয়েছে।",
      "পাশাপাশি শিক্ষকবৃন্দও তাদের জ্ঞান ও অভিজ্ঞতার আলোকে শিক্ষার্থীদের চরিত্র গঠন ও মননশীলতা বিকাশে দৃষ্টান্তমূলক ভূমিকা পালন করছেন।",
      "প্রতিষ্ঠানের সকল শিক্ষার্থী, অভিভাবক ও শুভানুধ্যায়ী’র আন্তরিক সহযোগিতা এবং শিক্ষক-শিক্ষিকা, কর্মকর্তা-কর্মচারীবৃন্দের অবিরাম প্রচেষ্টায় কে সি মডেল স্কুল অ্যান্ড কলেজ শত বাঁধা পেরিয়ে ক্রমোন্নতির পথে এগিয়ে চলেছে তাদের সবাইকে অনেক অনেক ধন্যবাদ।",
    ],
  },

  {
    number: "04",
    roleEn: "Principal’s Message",
    roleBn: "অধ্যক্ষের বার্তা",
    name: "প্রফেসর মোঃ আবদুল বাতেন",
    titleEn:
      "Principal, K C Model School & College · Former Principal, Mirzapur & Barishal Cadet Colleges",
    titleBn:
      "অধ্যক্ষ, কে সি মডেল স্কুল অ্যান্ড কলেজ · সাবেক অধ্যক্ষ, মির্জাপুর ও বরিশাল ক্যাডেট কলেজ",
    image: "/kcmsc/leadership/principal.jpg",
    body: [
      "হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর, ঢাকা থেকে মাত্র আধা কিলোমিটার দূরে দক্ষিণখানে ১০-তলা বিশিষ্ট নিজস্ব ভবনে গড়ে ওঠা একটি আধুনিকমানের ব্যতিক্রমধর্মী শিক্ষা প্রতিষ্ঠানের নাম কে সি মডেল স্কুল অ্যান্ড কলেজ। শিক্ষা মানুষের মৌলিক অধিকার যা মানুষকে আলোকিত করে, সুপ্ত প্রতিভা বিকাশে সহায়তা করে এবং একটি সুন্দর সমাজ, রাষ্ট্র তথা একটি সুন্দর বিশ্ব গঠনে অনন্য ভূমিকা রাখে। এই মূলমন্ত্রে দীক্ষিত হয়ে ঢাকা মহানগরীর দক্ষিণখানে বসবাসরত বিশিষ্ট শিল্পপতি, সমাজসেবক ও শিক্ষানুরাগী জনাব মোঃ খসরু চৌধুরী (সিআইপি) ২০১৪ সালে উত্তরার সন্নিকটে দক্ষিণখানে কে সি মডেল স্কুল অ্যান্ড কলেজ প্রতিষ্ঠা করেন।",
      "দক্ষিণখান এলাকা ঢাকা মহানগরীর বর্ধিষ্ণু অংশ হলেও আধুনিক সুযোগ সুবিধা সবার দোরগোড়ায় পৌঁছায়নি। ঢাকার উত্তরা ও নিকটবর্তী এলাকার সব নামি-দামী স্কুল, কলেজ ও বিশ্ববিদ্যালয় বিমানবন্দর-টংগী রেল লাইনের পশ্চিম পার্শ্বে অবস্থিত। এ প্রেক্ষাপটে রেল লাইনের পূর্ব পার্শ্বে অবস্থিত কে সি মডেল স্কুল অ্যান্ড কলেজ এতদঞ্চলে তথা সারা বাংলাদেশে শিক্ষা বিস্তারে এবং আলোকিত মানুষ তৈরিতে অনন্য অবদান রাখবে বলে আমি দৃঢ়ভাবে বিশ্বাস করি।",
      "কে সি মডেল স্কুল অ্যান্ড কলেজ এ ইংরেজি ও বাংলা উভয় ভার্সনে পাঠদানের ব্যবস্থা রয়েছে। তবে সকল ছাত্র ছাত্রীকে ইংরেজি ও সহশিক্ষা কার্যত্রমে পারদর্শী করে গড়ে তোলার জন্য বিশেষভাবে গুরুত্বারোপ করা হয় যাতে শিক্ষার্থীরা ভবিষ্যতে দেশ-বিদেশে যে-কোনো পরিস্থিতিতে নিজেদের খাপ খাইয়ে নিতে পারে এবং প্রয়োজনে নিজেদেরকে সঠিকভাবে উপস্থাপন করতে পারে।",
      "প্রতিষ্ঠানের সকল শিক্ষক-কর্মকর্তা, কর্মচারী ও অভিভাবকসহ শুভানুধ্যায়ীদের জানাই আন্তরিক অভিনন্দন ও শুভেচ্ছা।",
    ],
  },
];

export default async function LeadershipMessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if (!isLocale((await params).locale)) notFound();

  const locale: Locale = (await params).locale as Locale;
  const bn = locale === "bn";

  getDictionary(locale);

  return (
    <main className="bg-[#F8FAFC] text-[#23352c]">
      {/* HERO */}
      <section className="border-b border-[#D9E2EC] bg-[#f7f5ef]">
        <div className="mx-auto grid min-h-[500px] max-w-[1440px] lg:grid-cols-[1.05fr_.95fr]">
          <div className="flex flex-col justify-end px-6 pb-14 pt-24 sm:px-10 lg:px-16 lg:pb-20">
            <span
              className={`kc-classic-kicker ${
                bn ? "font-bangla normal-case tracking-normal" : ""
              }`}
              lang={bn ? "bn" : undefined}
            >
              {bn ? "নেতৃত্বের বার্তা" : "Leadership messages"}
            </span>

            <h1
              lang={bn ? "bn" : undefined}
              className={`mt-5 max-w-4xl text-[clamp(3rem,7vw,7rem)] leading-[.86] tracking-[-.055em] text-[#124c36] ${
                bn ? "font-bangla font-heading" : "font-heading"
              }`}
            >
              {bn
                ? "যাঁরা পথ দেখান, তাঁদের কথা।"
                : "Words from those who guide the institution."}
            </h1>

            <p
              lang={bn ? "bn" : undefined}
              className={`mt-8 max-w-2xl text-[15px] leading-7 text-[#69716b] sm:text-[16px] ${
                bn ? "font-bangla" : ""
              }`}
            >
              {bn
                ? "কে সি মডেল স্কুল অ্যান্ড কলেজের নেতৃত্বের বিভিন্ন স্তর থেকে শিক্ষা, মূল্যবোধ ও প্রতিষ্ঠানের ভবিষ্যৎ নিয়ে কিছু কথা।"
                : "Reflections on education, values and the future of K C Model School & College from the people who help guide it."}
            </p>
          </div>

          {/* HERO IMAGE */}
          <div className="relative hidden min-h-[500px] overflow-hidden border-l border-[#D9E2EC] lg:block">
            <Image
              src="/kcmsc/about/leadership-gathering.jpg"
              alt="KCMSC leadership gathering"
              fill
              priority
              quality={100}
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#102e23]/70 via-transparent to-[#102e23]/10" />

            <div className="absolute bottom-8 left-8 right-8 border-t border-white/30 pt-4 text-[9px] font-medium uppercase tracking-[.18em] text-white/80">
              K C Model School & College · Leadership
            </div>
          </div>
        </div>
      </section>

      {/* MESSAGE INDEX */}
      <section className="border-b border-[#D9E2EC] bg-white">
        <div className="mx-auto grid max-w-[1240px] px-6 sm:px-10 lg:grid-cols-4">
          {messages.map((message) => (
            <a
              key={message.number}
              href={`#message-${message.number}`}
              className="group flex items-center justify-between border-b border-[#D9E2EC] py-5 transition hover:bg-[#f7f5ef] lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[.16em] text-[#b59a4a]">
                  {message.number}
                </span>

                <p
                  lang={bn ? "bn" : undefined}
                  className={`mt-1 text-lg text-[#124c36] ${
                    bn ? "font-bangla font-heading" : "font-heading"
                  }`}
                >
                  {bn ? message.roleBn : message.roleEn}
                </p>
              </div>

              <span className="text-[#9a9f99] transition group-hover:translate-x-1 group-hover:text-[#176b45]">
                ↗
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* MESSAGES */}
      <section className="kc-classic-section bg-[#ebe7dc]">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-10">
          <div className="mb-12 max-w-2xl">
            <span
              lang={bn ? "bn" : undefined}
              className={`kc-classic-kicker ${
                bn ? "font-bangla normal-case tracking-normal" : ""
              }`}
            >
              {bn ? "বার্তাসমূহ" : "The messages"}
            </span>

            <h2
              lang={bn ? "bn" : undefined}
              className={`mt-4 text-4xl leading-[.98] tracking-[-.035em] text-[#124c36] sm:text-5xl ${
                bn ? "font-bangla font-heading" : "font-heading"
              }`}
            >
              {bn
                ? "প্রতিষ্ঠানের পরিচয়ের চারটি কণ্ঠস্বর।"
                : "Four voices shaping the institution."}
            </h2>
          </div>

          <div className="space-y-8 lg:space-y-12">
            {messages.map((message, index) => (
              <article
                id={`message-${message.number}`}
                key={message.number}
                className="group scroll-mt-24 overflow-hidden border border-[#d9d8cf] bg-[#fffdf8]"
              >
                <div
                  className={`grid lg:grid-cols-[.68fr_1.32fr] ${
                    index % 2 ? "lg:grid-cols-[1.32fr_.68fr]" : ""
                  }`}
                >
                  {/* PORTRAIT */}
                  <div
                    className={`${
                      index % 2 ? "lg:order-2" : ""
                    } relative p-4 sm:p-6`}
                  >
                    <LeadershipPortrait
                      src={message.image}
                      alt={message.name}
                      label={message.number}
                    />
                  </div>

                  {/* CONTENT */}
                  <div
                    className={`${
                      index % 2 ? "lg:order-1" : ""
                    } p-7 sm:p-10 lg:p-14`}
                  >
                    <div className="flex items-start justify-between gap-5 border-b border-[#d9d8cf] pb-6">
                      <div>
                        {/* ROLE */}
                        <span
                          lang={bn ? "bn" : undefined}
                          className={`kc-classic-kicker ${
                            bn ? "font-bangla normal-case tracking-normal" : ""
                          }`}
                        >
                          {bn ? message.roleBn : message.roleEn}
                        </span>

                        {/* NAME */}
                        <h3
                          lang="bn"
                          className="mt-4 font-bangla font-heading text-[clamp(2rem,4vw,3.5rem)] leading-[.95] tracking-[-.035em] text-[#124c36]"
                        >
                          {message.name}
                        </h3>

                        {/* TITLE */}
                        <p
                          lang={bn ? "bn" : undefined}
                          className={`mt-3 max-w-2xl text-[11px] leading-5 text-[#737a74] ${
                            bn ? "font-bangla" : ""
                          }`}
                        >
                          {bn ? message.titleBn : message.titleEn}
                        </p>
                      </div>

                      <span className="hidden text-[11px] font-medium tracking-[.16em] text-[#b59a4a] sm:block">
                        {message.number}
                      </span>
                    </div>

                    {/* QUOTE */}
                    {message.quote && (
                      <blockquote className="my-7 border-l-2 border-[#b59a4a] pl-5 text-xl leading-8 text-[#124c36] sm:text-2xl">
                        <span lang="bn" className="font-bangla font-heading">
                          “{message.quote}”
                        </span>

                        <cite
                          lang="bn"
                          className="mt-3 block font-bangla text-[9px] font-medium tracking-[.16em] text-[#8a8f89] not-italic"
                        >
                          — রবীন্দ্রনাথ ঠাকুর
                        </cite>
                      </blockquote>
                    )}

                    {/* BODY */}
                    <div className="mt-7 space-y-5 text-[14px] leading-8 text-[#59615b] sm:text-[15px] sm:leading-8">
                      {message.body.map((paragraph, paragraphIndex) => (
                        <p
                          key={paragraphIndex}
                          lang="bn"
                          className="font-bangla"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* FOOTER */}
                    <div className="mt-9 border-t border-[#d9d8cf] pt-5 text-[9px] font-medium uppercase tracking-[.16em] text-[#9a9f99]">
                      K C Model School & College · {message.number}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
