"use client";

import { useState } from "react";

type ApplicantType = "STUDENT" | "TEACHER";

const CLASSES = Array.from({ length: 12 }, (_, index) => String(index + 1));

const RELATIONSHIPS = [
  { value: "Mother", en: "Mother", bn: "মা" },
  { value: "Father", en: "Father", bn: "বাবা" },
  { value: "Guardian", en: "Guardian", bn: "অভিভাবক" },
  { value: "Grandmother", en: "Grandmother", bn: "দাদি / নানি" },
  { value: "Grandfather", en: "Grandfather", bn: "দাদা / নানা" },
  { value: "Brother", en: "Brother", bn: "ভাই" },
  { value: "Sister", en: "Sister", bn: "বোন" },
  { value: "Other", en: "Other", bn: "অন্যান্য" },
];

function formatBangladeshPhone(value: string): string {
  // Keep only digits, allowing users to paste a number in any common format.
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("00880")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("880")) {
    digits = digits.slice(3);
  } else if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Bangladesh mobile numbers have 10 digits after the country code.
  digits = digits.slice(0, 10);

  if (!digits) return "";

  const first = digits.slice(0, 3);
  const second = digits.slice(3, 6);
  const third = digits.slice(6, 10);

  let formatted = `+880-${first}`;

  if (second) formatted += `-${second}`;
  if (third) formatted += `-${third}`;

  return formatted;
}

function isValidBangladeshPhone(value: string): boolean {
  // Bangladesh mobile format: +880-1XX-XXX-XXXX.
  return /^\+880-1[3-9]\d-\d{3}-\d{4}$/.test(value);
}

export default function ApplicationForm({ locale }: { locale: string }) {
  const bn = locale === "bn";

  const [type, setType] = useState<ApplicantType>("STUDENT");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [teacherPhone, setTeacherPhone] = useState("");

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-[#d8ddd4] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#176b45] focus:ring-2 focus:ring-[#176b45]/10";

  const labelClass = "block text-sm font-medium text-[#303830]";

  function field(
    name: string,
    label: string,
    required = true,
    inputType = "text",
  ) {
    return (
      <label key={name} className={labelClass}>
        {label}
        {required && <span className="text-red-600"> *</span>}
        <input
          name={name}
          type={inputType}
          required={required}
          className={fieldClass}
        />
      </label>
    );
  }

  function selectField(
    name: string,
    label: string,
    options: { value: string; label: string }[],
  ) {
    return (
      <label key={name} className={labelClass}>
        {label}
        <span className="text-red-600"> *</span>
        <select name={name} required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            {bn ? "নির্বাচন করুন" : "Select an option"}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (type === "STUDENT" && !isValidBangladeshPhone(guardianPhone)) {
      setMessage(
        bn
          ? "সঠিক বাংলাদেশি মোবাইল নম্বর দিন। উদাহরণ: +880-171-234-5678"
          : "Enter a valid Bangladesh mobile number, e.g. +880-171-234-5678.",
      );
      return;
    }

    if (type === "TEACHER" && !isValidBangladeshPhone(teacherPhone)) {
      setMessage(
        bn
          ? "সঠিক বাংলাদেশি মোবাইল নম্বর দিন। উদাহরণ: +880-171-234-5678"
          : "Enter a valid Bangladesh mobile number, e.g. +880-171-234-5678.",
      );
      return;
    }

    setBusy(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.type = type;

    if (type === "STUDENT") {
      data.guardianPhone = guardianPhone;
    } else {
      data.phone = teacherPhone;
    }

    try {
      const response = await fetch("/api/blog/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Submission failed.");
      }

      setMessage(
        bn
          ? "আবেদন জমা হয়েছে। প্রশাসক পর্যালোচনা করার পর সিদ্ধান্ত জানানো হবে।"
          : "Application submitted. An administrator will review it before making a decision.",
      );

      form.reset();
      setGuardianPhone("");
      setTeacherPhone("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit application.",
      );
    } finally {
      setBusy(false);
    }
  }

  const phoneHelp = bn
    ? "ফরম্যাট: +880-1XX-XXX-XXXX"
    : "Required format: +880-1XX-XXX-XXXX";

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-2xl border border-[#e2e5dd] bg-[#fbfcf8] p-5 sm:p-7"
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setType("STUDENT");
            setMessage("");
          }}
          className={`rounded-xl border p-3 font-semibold ${
            type === "STUDENT"
              ? "border-[#176b45] bg-[#eaf2e9] text-[#176b45]"
              : "border-[#d8ddd4] bg-white"
          }`}
        >
          {bn ? "শিক্ষার্থী" : "Student"}
        </button>

        <button
          type="button"
          onClick={() => {
            setType("TEACHER");
            setMessage("");
          }}
          className={`rounded-xl border p-3 font-semibold ${
            type === "TEACHER"
              ? "border-[#176b45] bg-[#eaf2e9] text-[#176b45]"
              : "border-[#d8ddd4] bg-white"
          }`}
        >
          {bn ? "শিক্ষক" : "Teacher"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {field("fullName", bn ? "পূর্ণ নাম" : "Full name")}

        {field("email", bn ? "ইমেইল ঠিকানা" : "Email address", true, "email")}

        {field(
          "schoolId",
          type === "STUDENT"
            ? bn
              ? "শিক্ষার্থী আইডি"
              : "Student ID"
            : bn
              ? "শিক্ষক আইডি"
              : "Teacher ID",
        )}

        {type === "STUDENT" && (
          <>
            {selectField(
              "className",
              bn ? "শ্রেণি" : "Class",
              CLASSES.map((value) => ({
                value,
                label: value,
              })),
            )}

            {field("section", bn ? "শাখা" : "Section")}

            {field("rollNumber", bn ? "রোল নম্বর" : "Roll number")}

            {field("guardianName", bn ? "অভিভাবকের নাম" : "Guardian name")}

            {selectField(
              "guardianRelationship",
              bn ? "শিক্ষার্থীর সঙ্গে সম্পর্ক" : "Relationship to student",
              RELATIONSHIPS.map((item) => ({
                value: item.value,
                label: bn ? item.bn : item.en,
              })),
            )}

            <label className={labelClass}>
              {bn ? "অভিভাবকের ফোন নম্বর" : "Guardian contact number"}
              <span className="text-red-600"> *</span>

              <input
                name="guardianPhone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                required
                value={guardianPhone}
                onChange={(event) =>
                  setGuardianPhone(formatBangladeshPhone(event.target.value))
                }
                placeholder="+880-1XX-XXX-XXXX"
                aria-describedby="guardian-phone-help"
                className={fieldClass}
              />

              <span
                id="guardian-phone-help"
                className="mt-1 block text-xs font-normal text-[#687168]"
              >
                {phoneHelp}
              </span>
            </label>

            {field("formTeacher", bn ? "শ্রেণি শিক্ষকের নাম" : "Form teacher")}
          </>
        )}

        {type === "TEACHER" && (
          <>
            <label className={labelClass}>
              {bn ? "ফোন নম্বর" : "Phone number"}
              <span className="text-red-600"> *</span>

              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                required
                value={teacherPhone}
                onChange={(event) =>
                  setTeacherPhone(formatBangladeshPhone(event.target.value))
                }
                placeholder="+880-1XX-XXX-XXXX"
                className={fieldClass}
              />

              <span className="mt-1 block text-xs font-normal text-[#687168]">
                {phoneHelp}
              </span>
            </label>

            {field("subject", bn ? "পঠিত বিষয়" : "Subject taught")}
          </>
        )}
      </div>

      <p className="text-xs leading-5 text-[#687168]">
        {bn
          ? "আবেদন অনুমোদিত না হওয়া পর্যন্ত কোনো ব্লগার অ্যাকাউন্ট তৈরি হবে না। আপনার তথ্য যাচাইয়ের জন্য ব্যবহার করা হবে এবং পাবলিক প্রোফাইলে প্রকাশ করা হবে না।"
          : "An account is created only after an administrator approves the application. Your details are used for verification and are not displayed on public profiles."}
      </p>

      {message && (
        <p
          role="status"
          className="rounded-lg bg-[#edf3eb] p-3 text-sm text-[#176b45]"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-[#176b45] px-5 py-3 font-semibold text-white disabled:opacity-60"
      >
        {busy
          ? bn
            ? "জমা হচ্ছে…"
            : "Submitting…"
          : bn
            ? "আবেদন জমা দিন"
            : "Submit application"}
      </button>
    </form>
  );
}
