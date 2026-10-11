"use client";

import { useEffect, useId, useMemo, useState, useTransition } from "react";

const classes = [
  "Nursery",

  "KG",

  ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`),
];

const months = [
  "January",

  "February",

  "March",

  "April",

  "May",

  "June",

  "July",

  "August",

  "September",

  "October",

  "November",

  "December",
];

const days = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);

const currentYear = new Date().getFullYear();

const selectedAdmissionCycle = "Test Admission 2026";

const years = Array.from({ length: currentYear - 1949 }, (_, i) =>
  String(currentYear - i),
);

const nationalities = [
  "Afghan",

  "Albanian",

  "Algerian",

  "Andorran",

  "Angolan",

  "Antiguan and Barbudan",

  "Argentine",

  "Armenian",

  "Australian",

  "Austrian",

  "Azerbaijani",

  "Bahamian",

  "Bahraini",

  "Bangladeshi",

  "Barbadian",

  "Belarusian",

  "Belgian",

  "Belizean",

  "Beninese",

  "Bhutanese",

  "Bolivian",

  "Bosnian and Herzegovinian",

  "Motswana",

  "Brazilian",

  "Bruneian",

  "Bulgarian",

  "Burkinabè",

  "Burundian",

  "Cabo Verdean",

  "Cambodian",

  "Cameroonian",

  "Canadian",

  "Central African",

  "Chadian",

  "Chilean",

  "Chinese",

  "Colombian",

  "Comorian",

  "Congolese (Republic of the Congo)",

  "Congolese (Democratic Republic of the Congo)",

  "Costa Rican",

  "Ivorian",

  "Croatian",

  "Cuban",

  "Cypriot",

  "Czech",

  "Danish",

  "Djiboutian",

  "Dominican (Dominican Republic)",

  "Dominican (Dominica)",

  "Dutch",

  "Ecuadorian",

  "Egyptian",

  "Salvadoran",

  "Equatorial Guinean",

  "Eritrean",

  "Estonian",

  "Eswatini citizen",

  "Ethiopian",

  "Fijian",

  "Finnish",

  "French",

  "Gabonese",

  "Gambian",

  "Georgian",

  "German",

  "Ghanaian",

  "Greek",

  "Grenadian",

  "Guatemalan",

  "Guinean",

  "Bissau-Guinean",

  "Guyanese",

  "Haitian",

  "Honduran",

  "Hungarian",

  "Icelandic",

  "Indian",

  "Indonesian",

  "Iranian",

  "Iraqi",

  "Irish",

  "Israeli",

  "Italian",

  "Jamaican",

  "Japanese",

  "Jordanian",

  "Kazakhstani",

  "Kenyan",

  "Kiribati",

  "Kuwaiti",

  "Kyrgyzstani",

  "Lao",

  "Latvian",

  "Lebanese",

  "Lesotho citizen",

  "Liberian",

  "Libyan",

  "Liechtensteiner",

  "Lithuanian",

  "Luxembourgish",

  "Malagasy",

  "Malawian",

  "Malaysian",

  "Maldivian",

  "Malian",

  "Maltese",

  "Marshallese",

  "Mauritanian",

  "Mauritian",

  "Mexican",

  "Micronesian",

  "Moldovan",

  "Monégasque",

  "Mongolian",

  "Montenegrin",

  "Moroccan",

  "Mozambican",

  "Myanmar citizen",

  "Namibian",

  "Nauruan",

  "Nepalese",

  "New Zealander",

  "Nicaraguan",

  "Nigerien",

  "Nigerian",

  "North Korean",

  "North Macedonian",

  "Norwegian",

  "Omani",

  "Pakistani",

  "Palauan",

  "Panamanian",

  "Papua New Guinean",

  "Paraguayan",

  "Peruvian",

  "Philippine",

  "Polish",

  "Portuguese",

  "Qatari",

  "Romanian",

  "Russian",

  "Rwandan",

  "Kittitian and Nevisian",

  "Saint Lucian",

  "Saint Vincentian",

  "Samoan",

  "San Marinese",

  "São Toméan",

  "Saudi Arabian",

  "Senegalese",

  "Serbian",

  "Seychellois",

  "Sierra Leonean",

  "Singaporean",

  "Slovak",

  "Slovenian",

  "Solomon Islander",

  "Somali",

  "South African",

  "South Korean",

  "South Sudanese",

  "Spanish",

  "Sri Lankan",

  "Sudanese",

  "Surinamese",

  "Swedish",

  "Swiss",

  "Syrian",

  "Tajikistani",

  "Tanzanian",

  "Thai",

  "Timorese",

  "Togolese",

  "Tongan",

  "Trinidadian and Tobagonian",

  "Tunisian",

  "Turkish",

  "Turkmen",

  "Tuvaluan",

  "Ugandan",

  "Ukrainian",

  "Emirati",

  "British",

  "American",

  "Uruguayan",

  "Uzbekistani",

  "Vanuatuan",

  "Venezuelan",

  "Vietnamese",

  "Yemeni",

  "Zambian",

  "Zimbabwean",

  "Palestinian",

  "Vatican citizen",

  "Other",
];

const guardianRelationships = [
  "Grandfather",

  "Grandmother",

  "Brother",

  "Sister",

  "Uncle",

  "Aunt",

  "Legal Guardian",

  "Other",
];

type Guardian = {
  name: string;

  relationship: string;

  nidNumber: string;

  contactNumber: string;

  occupation: string;

  nationality: string;

  isAlive: boolean;
};

const emptyGuardian = (): Guardian => ({
  name: "",

  relationship: "",

  nidNumber: "",

  contactNumber: "",

  occupation: "",

  nationality: "Bangladeshi",

  isAlive: true,
});

type FormState = {
  fullName: string;

  dateOfBirth: string;

  gender: string;

  nationality: string;

  medium: string;

  applyingClass: string;

  previousInstitution: string;

  birthRegistrationNo: string;

  fatherName: string;

  fatherNidNumber: string;

  fatherContactNumber: string;

  fatherOccupation: string;

  fatherNationality: string;

  motherName: string;

  motherNidNumber: string;

  motherContactNumber: string;

  motherOccupation: string;

  motherNationality: string;

  presentAddress: string;

  permanentAddress: string;
};

const initialState: FormState = {
  fullName: "",

  dateOfBirth: "",

  gender: "",

  nationality: "",

  medium: "",

  applyingClass: "",

  previousInstitution: "",

  birthRegistrationNo: "",

  fatherName: "",

  fatherNidNumber: "",

  fatherContactNumber: "",

  fatherOccupation: "",

  fatherNationality: "",

  motherName: "",

  motherNidNumber: "",

  motherContactNumber: "",

  motherOccupation: "",

  motherNationality: "",

  presentAddress: "",

  permanentAddress: "",
};

const PHONE_PLACEHOLDER = "+880-1X-XXXX-XXXX";

/**
 * Formats a Bangladesh mobile number without changing its actual digits.
 * Accepted input examples:
 *   01XXXXXXXXX
 *   +8801XXXXXXXXX
 *   008801XXXXXXXXX
 *   1XXXXXXXXX
 *   +880-1X-XXXX-XXXX
 *
 * The stored/displayed value is normalized to:
 *   +880-1X-XXXX-XXXX
 */
function formatBangladeshPhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  let local = digits;

  // Accept Bangladesh numbers entered as 01XXXXXXXXX, 8801XXXXXXXXX,
  // 008801XXXXXXXXX, or the already-formatted +880-1X-XXXX-XXXX form.
  if (local.startsWith("00880")) {
    local = local.slice(5);
  } else if (local.startsWith("880")) {
    local = local.slice(3);
  } else if (local.startsWith("0")) {
    local = local.slice(1);
  }

  // A Bangladesh mobile number has 10 digits after the leading 0:
  // 1XXXXXXXXX. Never invent or alter digits.
  local = local.slice(0, 10);

  if (!local) {
    return "+880-";
  }

  // +880-1X-XXXX-XXXX
  const prefix = local.slice(0, 2);
  const middle = local.slice(2, 6);
  const last = local.slice(6, 10);

  let formatted = `+880-${prefix}`;

  if (middle) {
    formatted += `-${middle}`;
  }

  if (last) {
    formatted += `-${last}`;
  }

  return formatted;
}

function isValidBangladeshPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("01")) {
    return true;
  }

  if (digits.length === 13 && digits.startsWith("8801")) {
    return true;
  }

  if (digits.length === 15 && digits.startsWith("008801")) {
    return true;
  }

  return /^\+880-1\d-\d{4}-\d{4}$/.test(value);
}

function pdfSafe(value: string): string {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "?");
}

function pdfWrap(value: string, maxChars: number): string[] {
  const text = String(value ?? "").trim() || "—";
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if (!line) {
      line = word;
      continue;
    }

    const candidate = `${line} ${word}`;
    if (candidate.length <= maxChars) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines.length ? lines : ["—"];
}

function downloadAdmissionPdf(
  form: FormState,
  fatherAlive: boolean,
  motherAlive: boolean,
  guardians: Guardian[],
  certificate: File | null,
) {
  const PAGE_WIDTH = 595;
  const PAGE_HEIGHT = 842;
  const MARGIN = 42;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
  const pages: string[][] = [];
  let commands: string[] = [];
  let y = 780;

  const newPage = () => {
    commands = [];
    pages.push(commands);
    y = 780;

    commands.push("0.09 0.28 0.19 RG 0.09 0.28 0.19 rg");
    commands.push(
      `BT /F2 17 Tf ${MARGIN} ${y} Td (K C Model School & College) Tj ET`,
    );
    y -= 22;
    commands.push("0.20 0.20 0.20 rg");
    commands.push(
      `BT /F1 10 Tf ${MARGIN} ${y} Td (Admission Application Form) Tj ET`,
    );
    y -= 18;
    commands.push("0.55 0.42 0.16 RG");
    commands.push(`0.8 w ${MARGIN} ${y} m ${PAGE_WIDTH - MARGIN} ${y} l S`);
    y -= 25;
  };

  const ensureSpace = (height: number) => {
    if (y - height < 55) {
      newPage();
    }
  };

  const text = (value: string, x: number, size = 10, bold = false) => {
    commands.push(
      `BT /${bold ? "F2" : "F1"} ${size} Tf ${x} ${y} Td (${pdfSafe(value)}) Tj ET`,
    );
  };

  const section = (title: string) => {
    ensureSpace(38);
    commands.push("0.94 0.95 0.93 rg");
    commands.push(`${MARGIN} ${y - 17} ${CONTENT_WIDTH} 25 re f`);
    commands.push("0.09 0.28 0.19 rg");
    text(title.toUpperCase(), MARGIN + 9, 10, true);
    y -= 38;
  };

  const row = (label: string, value: string, fullWidth = false) => {
    const maxChars = fullWidth ? 78 : 38;
    const lines = pdfWrap(value, maxChars);
    const height = Math.max(24, lines.length * 13 + 8);
    ensureSpace(height);

    text(label, MARGIN + 8, 8.5, true);
    const valueX = fullWidth ? MARGIN + 8 : MARGIN + 170;

    lines.forEach((line, index) => {
      const previousY = y;
      y -= index === 0 ? 0 : 13;
      text(line, valueX, 9.5, false);
      y = previousY;
    });

    y -= lines.length * 13;
    commands.push("0.82 0.82 0.78 RG 0.45 w");
    commands.push(`${MARGIN} ${y + 6} ${CONTENT_WIDTH} 0 l S`);
    y -= 7;
  };

  const addressRow = (label: string, value: string) => {
    const lines = pdfWrap(value, 78);
    const height = lines.length * 13 + 24;
    ensureSpace(height);
    text(label, MARGIN + 8, 8.5, true);
    y -= 14;
    lines.forEach((line) => {
      text(line, MARGIN + 8, 9.5);
      y -= 13;
    });
    commands.push("0.82 0.82 0.78 RG 0.45 w");
    commands.push(`${MARGIN} ${y + 6} ${CONTENT_WIDTH} 0 l S`);
    y -= 7;
  };

  newPage();

  commands.push("0.09 0.28 0.19 rg");
  text("ADMISSION APPLICATION", MARGIN, 18, true);
  y -= 16;
  text(`Admission Cycle: ${selectedAdmissionCycle}`, MARGIN, 10.5, false);
  y -= 18;
  commands.push("0.55 0.42 0.16 RG 0.8 w");
  commands.push(`${MARGIN} ${y} m ${PAGE_WIDTH - MARGIN} ${y} l S`);
  y -= 25;

  section("Student Information");
  row("Full Name", form.fullName);
  row("Date of Birth", form.dateOfBirth);
  row("Gender", form.gender);
  row("Nationality", form.nationality);
  row("Medium", form.medium);
  row("Class Applying For", form.applyingClass);
  row("Previous Institution", form.previousInstitution || "Not provided");

  section("Birth Registration Information");
  row("Birth Registration No.", form.birthRegistrationNo);
  row(
    "Birth Registration Certificate",
    certificate ? "Submitted with application" : "Not submitted",
  );

  section("Guardian Information - Father");
  row("Father's Name", form.fatherName);
  row("Father's NID Number", form.fatherNidNumber);
  row(
    "Father's Contact Number",
    fatherAlive ? form.fatherContactNumber : "Not applicable (deceased)",
  );
  row("Father's Occupation", form.fatherOccupation);
  row("Father's Nationality", form.fatherNationality);
  row("Father's Status", fatherAlive ? "Alive" : "Deceased");

  section("Guardian Information - Mother");
  row("Mother's Name", form.motherName);
  row("Mother's NID Number", form.motherNidNumber);
  row(
    "Mother's Contact Number",
    motherAlive ? form.motherContactNumber : "Not applicable (deceased)",
  );
  row("Mother's Occupation", form.motherOccupation);
  row("Mother's Nationality", form.motherNationality);
  row("Mother's Status", motherAlive ? "Alive" : "Deceased");

  if (guardians.length) {
    section("Additional Guardian Information");
    guardians.forEach((guardian, index) => {
      ensureSpace(30);
      text(`Guardian ${index + 1}`, MARGIN + 8, 10, true);
      y -= 16;
      row("Name", guardian.name);
      row("Relationship", guardian.relationship);
      row("NID Number", guardian.nidNumber);
      row(
        "Contact Number",
        guardian.isAlive ? guardian.contactNumber : "Not applicable (deceased)",
      );
      row("Occupation", guardian.occupation);
      row("Nationality", guardian.nationality);
      row("Status", guardian.isAlive ? "Alive" : "Deceased");
    });
  }

  section("Address Information");
  addressRow("Present Address", form.presentAddress);
  addressRow("Permanent Address", form.permanentAddress);

  section("Declaration & Confirmation");
  const declaration =
    "I hereby declare that all information provided in this application is true, complete, and accurate to the best of my knowledge. I confirm that the documents and certificates submitted with this application are genuine and have not been altered, falsified, or misrepresented. I understand that providing false information or fraudulent documents may result in cancellation of the application or admission and may lead to further action according to the institution's rules.";
  pdfWrap(declaration, 92).forEach((line) => {
    ensureSpace(16);
    text(line, MARGIN + 8, 9);
    y -= 13;
  });
  y -= 8;
  ensureSpace(35);
  commands.push("0.94 0.95 0.93 rg");
  commands.push(`${MARGIN} ${y - 8} ${CONTENT_WIDTH} 30 re f`);
  commands.push("0.09 0.28 0.19 rg");
  text("Declaration accepted: YES", MARGIN + 10, 9.5, true);
  y -= 40;

  ensureSpace(45);
  commands.push("0.55 0.42 0.16 RG 0.8 w");
  commands.push(`${MARGIN} ${y} m ${MARGIN + 190} ${y} l S`);
  y -= 12;
  text("Applicant / Parent / Guardian Signature", MARGIN, 8.5);
  y -= 18;
  text(`Admission Cycle: ${selectedAdmissionCycle}`, MARGIN, 8.5);

  const dateText = new Date().toLocaleDateString("en-US");

  pages.forEach((pageCommands, index) => {
    pageCommands.push("0.35 0.35 0.35 rg");
    pageCommands.push(
      `BT /F1 8 Tf ${MARGIN} 30 Td (K C Model School & College - Admission Application) Tj ET`,
    );
    pageCommands.push(
      `BT /F1 8 Tf ${PAGE_WIDTH - 90} 30 Td (Page ${index + 1}) Tj ET`,
    );
    pageCommands.push(
      `BT /F1 8 Tf ${PAGE_WIDTH - 190} 42 Td (${pdfSafe(dateText)}) Tj ET`,
    );
  });

  const objects: string[] = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";

  const pageIds: number[] = [];
  const contentIds: number[] = [];
  let nextId = 5;

  pages.forEach(() => {
    pageIds.push(nextId);
    contentIds.push(nextId + 1);
    nextId += 2;
  });

  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>";

  pages.forEach((pageCommands, index) => {
    const content = pageCommands.join("\n");
    const pageId = pageIds[index]!;
    const contentId = contentIds[index]!;
    objects[pageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects[contentId] =
      `<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}\nendstream`;
  });

  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets: number[] = [0];

  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = new TextEncoder().encode(pdf).length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefOffset = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += "0000000000 65535 f \n";
  for (let id = 1; id < objects.length; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const safeName = (form.fullName || "Applicant")
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  anchor.href = url;
  anchor.download = `${safeName || "Applicant"}-Admission-Application-${selectedAdmissionCycle.replace(/\s+/g, "-")}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function PhoneField({
  label,
  value,
  required = true,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold tracking-[-0.01em] text-[var(--kc-ink)]">
        {label}
        {required ? (
          <span className="ml-1 text-[var(--kc-brass)]">*</span>
        ) : null}
      </label>

      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required={required}
        value={value}
        placeholder={PHONE_PLACEHOLDER}
        onChange={(e) => onChange(formatBangladeshPhone(e.target.value))}
        onBlur={(e) => onChange(formatBangladeshPhone(e.target.value))}
        className="mt-2 h-12 w-full rounded-xl border border-[var(--kc-line)] bg-[var(--kc-paper)] px-4 text-[14px] text-[var(--kc-ink)] shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition duration-200 placeholder:text-[#a2aaa4] hover:border-[#c4ccc5] focus:border-[var(--kc-green)] focus:ring-4 focus:ring-[var(--kc-green)]/10"
      />
    </div>
  );
}

function Field({
  label,

  value,

  required = true,

  type = "text",

  onChange,

  placeholder,

  inputMode,

  maxLength,

  pattern,
}: {
  label: string;

  value: string;

  required?: boolean;

  type?: string;

  onChange: (value: string) => void;

  placeholder?: string;

  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];

  maxLength?: number;

  pattern?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold tracking-[-0.01em] text-[var(--kc-ink)]">
        {label}

        {required ? (
          <span className="ml-1 text-[var(--kc-brass)]">*</span>
        ) : null}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        pattern={pattern}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full rounded-xl border border-[var(--kc-line)] bg-[var(--kc-paper)] px-4 text-[14px] text-[var(--kc-ink)] shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition duration-200 placeholder:text-[#a2aaa4] hover:border-[#c4ccc5] focus:border-[var(--kc-green)] focus:ring-4 focus:ring-[var(--kc-green)]/10"
      />
    </div>
  );
}

/*

 * KCMSC searchable select.

 *

 * Only ONE dropdown can be open at a time.

 */

function SelectField({
  label,

  value,

  onChange,

  options,

  placeholder = "Select",
}: {
  label: string;

  value: string;

  onChange: (value: string) => void;

  options: string[];

  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const selectId = useId();

  useEffect(() => {
    const handleAnotherSelectOpened = (event: Event) => {
      const customEvent = event as CustomEvent<string>;

      if (customEvent.detail !== selectId) {
        setOpen(false);

        setSearch("");
      }
    };

    document.addEventListener("kcmsc-select-open", handleAnotherSelectOpened);

    return () => {
      document.removeEventListener(
        "kcmsc-select-open",

        handleAnotherSelectOpened,
      );
    };
  }, [selectId]);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return options;

    return options.filter((option) => option.toLowerCase().includes(query));
  }, [options, search]);

  const selectedLabel = value || placeholder;

  const toggleDropdown = () => {
    if (open) {
      setOpen(false);

      setSearch("");

      return;
    }

    document.dispatchEvent(
      new CustomEvent("kcmsc-select-open", {
        detail: selectId,
      }),
    );

    setSearch("");

    setOpen(true);
  };

  return (
    <div className="relative">
      <label className="block text-[12px] font-semibold tracking-[-0.01em] text-[var(--kc-ink)]">
        {label}

        <span className="ml-1 text-[var(--kc-brass)]">*</span>
      </label>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleDropdown}
        className={`mt-2 flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left text-[14px] shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition duration-200 ${
          open
            ? "border-[var(--kc-green)] ring-1 ring-[var(--kc-green)]/20"
            : "border-[var(--kc-line)] hover:border-[var(--kc-green)]"
        }`}
      >
        <span className={value ? "text-[var(--kc-ink)]" : "text-[#9b9f99]"}>
          {selectedLabel}
        </span>

        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 text-[var(--kc-muted)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border border-[var(--kc-line)] bg-[var(--kc-paper)] shadow-[0_14px_40px_rgba(25,45,34,0.12)]">
          <div className="border-b border-[var(--kc-line)] bg-[var(--kc-soft)] p-2">
            <div className="relative">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--kc-muted)]"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

                <path
                  d="M16 16l4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>

              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="h-10 w-full rounded-none rounded-xl border border-[var(--kc-line)] bg-[var(--kc-paper)] pl-9 pr-3 text-sm text-[var(--kc-ink)] outline-none placeholder:text-[#9b9f99] focus:border-[var(--kc-green)] focus:ring-1 focus:ring-[var(--kc-green)]/20"
              />
            </div>
          </div>

          <div
            role="listbox"
            className="max-h-64 overflow-y-auto overscroll-contain"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const selected = option === value;

                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(option);

                      setOpen(false);

                      setSearch("");
                    }}
                    className={`flex min-h-10 w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition ${
                      selected
                        ? "bg-[var(--kc-green)] text-white"
                        : "text-[var(--kc-ink)] hover:bg-[var(--kc-soft)] hover:text-[var(--kc-green-dark)]"
                    }`}
                  >
                    <span>{option}</span>

                    {selected ? (
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="ml-3 shrink-0"
                      >
                        <path
                          d="M5 12.5l4.2 4L19 7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-xs text-[var(--kc-muted)]">
                No matches found.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/*

 * KCMSC Date of Birth selector.

 *

 * Stored in FormState as:

 *

 * YYYY-MM-DD

 */

function DateOfBirthField({
  value,

  onChange,
}: {
  value: string;

  onChange: (value: string) => void;
}) {
  const [selectedDay, setSelectedDay] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("");

  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    if (!value) {
      return;
    }

    const parts = value.split("-");

    const year = parts[0] ?? "";

    const month = parts[1] ?? "";

    const day = parts[2] ?? "";

    setSelectedYear(year);

    setSelectedMonth(month);

    setSelectedDay(day);
  }, [value]);

  const availableDays = useMemo(() => {
    if (!selectedYear || !selectedMonth) {
      return days;
    }

    const daysInMonth = new Date(
      Number(selectedYear),

      Number(selectedMonth),

      0,
    ).getDate();

    return Array.from({ length: daysInMonth }, (_, i) =>
      String(i + 1).padStart(2, "0"),
    );
  }, [selectedYear, selectedMonth]);

  const commitDate = (year: string, month: string, day: string) => {
    if (!year || !month || !day) {
      onChange("");

      return;
    }

    const daysInMonth = new Date(Number(year), Number(month), 0).getDate();

    const safeDay = Math.min(Number(day), daysInMonth);

    const formattedDay = String(safeDay).padStart(2, "0");

    onChange(`${year}-${month}-${formattedDay}`);
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day);

    commitDate(selectedYear, selectedMonth, day);
  };

  const handleMonthChange = (monthName: string) => {
    const monthIndex = months.indexOf(monthName);

    if (monthIndex < 0) {
      return;
    }

    const monthValue = String(monthIndex + 1).padStart(2, "0");

    let nextDay = selectedDay;

    if (selectedYear && nextDay) {
      const daysInMonth = new Date(
        Number(selectedYear),

        Number(monthValue),

        0,
      ).getDate();

      if (Number(nextDay) > daysInMonth) {
        nextDay = String(daysInMonth).padStart(2, "0");

        setSelectedDay(nextDay);
      }
    }

    setSelectedMonth(monthValue);

    commitDate(selectedYear, monthValue, nextDay);
  };

  const handleYearChange = (year: string) => {
    let nextDay = selectedDay;

    if (selectedMonth && nextDay) {
      const daysInMonth = new Date(
        Number(year),

        Number(selectedMonth),

        0,
      ).getDate();

      if (Number(nextDay) > daysInMonth) {
        nextDay = String(daysInMonth).padStart(2, "0");

        setSelectedDay(nextDay);
      }
    }

    setSelectedYear(year);

    commitDate(year, selectedMonth, nextDay);
  };

  const selectedMonthLabel = selectedMonth
    ? (months[Number(selectedMonth) - 1] ?? "")
    : "";

  return (
    <div>
      <label className="block text-[12px] font-semibold tracking-[-0.01em] text-[var(--kc-ink)]">
        Date of Birth
        <span className="ml-1 text-[var(--kc-brass)]">*</span>
      </label>

      <div className="mt-2 grid gap-3 sm:grid-cols-[0.75fr_1.45fr_1fr]">
        <SelectField
          label="Day"
          value={selectedDay}
          onChange={handleDayChange}
          options={availableDays}
          placeholder="Day"
        />

        <SelectField
          label="Month"
          value={selectedMonthLabel}
          onChange={handleMonthChange}
          options={months}
          placeholder="Month"
        />

        <SelectField
          label="Year"
          value={selectedYear}
          onChange={handleYearChange}
          options={years}
          placeholder="Year"
        />
      </div>

      <p className="mt-2 text-xs text-[var(--kc-muted)]">
        Select the date exactly as shown on the birth registration certificate.
      </p>
    </div>
  );
}

export function ApplicationForm({
  action,

  sections,

  fields: _fields,

  submitLabel,

  submittingLabel,
}: {
  action: (formData: FormData) => Promise<void | { ok: false; message: string }>;

  sections: Record<string, string>;

  fields: Record<string, unknown>;

  submitLabel: string;

  submittingLabel: string;
}) {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState<FormState>(initialState);

  const [fatherAlive, setFatherAlive] = useState(true);

  const [motherAlive, setMotherAlive] = useState(true);

  const [guardians, setGuardians] = useState<Guardian[]>([]);

  const [certificate, setCertificate] = useState<File | null>(null);

  const [error, setError] = useState("");

  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const [sameAddress, setSameAddress] = useState(false);

  const [pending, startTransition] = useTransition();

  /*

   * Automatically return to the top whenever

   * the user moves between application steps.

   */

  useEffect(() => {
    requestAnimationFrame(() => {
      const progressSection = document.getElementById("application-progress");

      if (progressSection) {
        progressSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  }, [step]);

  useEffect(() => {
    if (!error) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("application-error")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [error]);

  /*

   * Automatically calculate student's age.

   */

  const age = useMemo(() => {
    if (!form.dateOfBirth) {
      return "";
    }

    const [year, month, day] = form.dateOfBirth.split("-").map(Number);

    if (!year || !month || !day) {
      return "";
    }

    const today = new Date();

    let a = today.getFullYear() - year;

    const birthdayPassed =
      today.getMonth() + 1 > month ||
      (today.getMonth() + 1 === month && today.getDate() >= day);

    if (!birthdayPassed) {
      a--;
    }

    return a >= 0 ? String(a) : "";
  }, [form.dateOfBirth]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({
      ...current,

      [key]: value,
    }));
  };

  const steps = [
    {
      title: sections.student,
      short: "Student",
      number: "01",
    },
    {
      title: "Guardian Information",
      short: "Guardian",
      number: "02",
    },
    {
      title: sections.address,
      short: "Address",
      number: "03",
    },
    {
      title: "Declaration & Confirmation",
      short: "Confirm",
      number: "04",
    },
  ];

  const stepValid = () => {
    setError("");

    if (step === 0) {
      const missing: string[] = [];

      if (!form.fullName.trim()) missing.push("Full Name");
      if (!form.dateOfBirth) missing.push("Date of Birth");
      if (!form.gender) missing.push("Gender");
      if (!form.nationality) missing.push("Nationality");
      if (!form.medium) missing.push("Medium");
      if (!form.applyingClass) missing.push("Class Applying For");
      if (!form.birthRegistrationNo) {
        missing.push("Birth Registration No.");
      } else if (!/^\d{17}$/.test(form.birthRegistrationNo)) {
        setError("Birth Registration No. must contain exactly 17 digits.");
        return false;
      }
      if (!certificate) missing.push("Birth Registration Certificate");

      if (missing.length) {
        setError(`Please complete: ${missing.join(", ")}.`);
        return false;
      }
    }

    if (step === 1) {
      const fatherContact = formatBangladeshPhone(form.fatherContactNumber);
      const motherContact = formatBangladeshPhone(form.motherContactNumber);

      if (fatherContact !== form.fatherContactNumber) {
        set("fatherContactNumber", fatherContact);
      }

      if (motherContact !== form.motherContactNumber) {
        set("motherContactNumber", motherContact);
      }

      const missing: string[] = [];
      const invalid: string[] = [];

      if (!form.fatherName.trim()) missing.push("Father's Name");
      if (!form.fatherNidNumber.trim()) missing.push("Father's NID Number");
      if (fatherAlive && !fatherContact) missing.push("Father's Contact Number");
      else if (fatherAlive && !isValidBangladeshPhone(fatherContact)) invalid.push("Father's Contact Number");
      if (!form.fatherOccupation.trim()) missing.push("Father's Occupation");
      if (!form.fatherNationality.trim()) missing.push("Father's Nationality");

      if (!form.motherName.trim()) missing.push("Mother's Name");
      if (!form.motherNidNumber.trim()) missing.push("Mother's NID Number");
      if (motherAlive && !motherContact) missing.push("Mother's Contact Number");
      else if (motherAlive && !isValidBangladeshPhone(motherContact)) invalid.push("Mother's Contact Number");
      if (!form.motherOccupation.trim()) missing.push("Mother's Occupation");
      if (!form.motherNationality.trim()) missing.push("Mother's Nationality");

      guardians.forEach((guardian, index) => {
        const contact = formatBangladeshPhone(guardian.contactNumber);
        const prefix = `Additional Guardian ${index + 1}`;

        if (!guardian.name.trim()) missing.push(`${prefix} Name`);
        if (!guardian.relationship.trim()) missing.push(`${prefix} Relationship`);
        if (!guardian.nidNumber.trim()) missing.push(`${prefix} NID Number`);
        if (guardian.isAlive && !contact) missing.push(`${prefix} Contact Number`);
        else if (guardian.isAlive && !isValidBangladeshPhone(contact)) invalid.push(`${prefix} Contact Number`);
        if (!guardian.occupation.trim()) missing.push(`${prefix} Occupation`);
        if (!guardian.nationality.trim()) missing.push(`${prefix} Nationality`);
      });

      if (missing.length || invalid.length) {
        const messages: string[] = [];
        if (missing.length) messages.push(`Please complete: ${missing.join(", ")}.`);
        if (invalid.length) messages.push(`Please correct: ${invalid.join(", ")}.`);
        setError(messages.join(" "));
        return false;
      }
    }

    if (step === 2) {
      const missing: string[] = [];
      if (!form.presentAddress.trim()) missing.push("Present Address");
      if (!sameAddress && !form.permanentAddress.trim()) missing.push("Permanent Address");

      if (missing.length) {
        setError(
          `Please complete: ${missing.join(", ")}. If the permanent address is the same as the present address, select the same-address option.`,
        );
        return false;
      }
    }

    if (step === 3 && !declarationAccepted) {
      setError("Please confirm the Declaration & Confirmation checkbox before submitting the application.");
      return false;
    }

    return true;
  };

  const updateGuardian = (index: number, patch: Partial<Guardian>) => {
    setGuardians((items) =>
      items.map((item, i) =>
        i === index
          ? {
              ...item,

              ...patch,
            }
          : item,
      ),
    );
  };

  const removeGuardian = (index: number) => {
    setGuardians((items) => items.filter((_, i) => i !== index));
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stepValid()) {
      return;
    }

    if (!declarationAccepted) {
      setError(
        "Please confirm the declaration before submitting the application.",
      );

      return;
    }

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.set(key, String(value));
    });

    data.set("fatherIsAlive", fatherAlive ? "on" : "");

    data.set("motherIsAlive", motherAlive ? "on" : "");

    data.set("guardiansJson", JSON.stringify(guardians));

    data.set("declarationAccepted", declarationAccepted ? "on" : "");
    data.set("admissionCycle", selectedAdmissionCycle);
    data.set("age", age);

    if (certificate) {
      data.set("certificate", certificate);
    }

    setError("");
    startTransition(() => {
      void action(data)
        .then((result) => {
          if (result && result.ok === false) {
            setError(result.message);
          }
        })
        .catch((submitError: unknown) => {
          // The server action normally returns a structured error for expected
          // failures. This fallback covers unexpected transport/server errors
          // without clearing the values held in this client component.
          console.error("Admission application submission failed", submitError);
          setError(
            "We couldn't submit your application because of an unexpected server or connection problem. Your entries are still on this form. Please try again shortly."
          );
        });
    });
  };

  return (
    <form onSubmit={submit} className="w-full max-w-[1120px]">
      {/* PROGRESS */}
      <nav
        id="application-progress"
        aria-label="Application progress"
        className="mb-8 rounded-2xl border border-[var(--kc-line)] bg-white p-5 shadow-none sm:p-6"
      >
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--kc-green)]">
              Application Progress
            </p>
            <p className="mt-1 text-[15px] font-semibold tracking-[-0.01em] text-[var(--kc-ink)]">
              Step {step + 1} of {steps.length} · {steps[step]?.short}
            </p>
          </div>
          <span className="rounded-full bg-[#edf6f0] px-3 py-1.5 text-[12px] font-bold text-[var(--kc-green-dark)]">
            {Math.round(((step + 1) / steps.length) * 100)}%
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-[#e8ece8]"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-[var(--kc-green)] transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {steps.map((item, index) => (
            <li key={item.number}>
              <button
                type="button"
                onClick={() => {
                  if (index < step) {
                    setError("");
                    setStep(index);
                  }
                }}
                disabled={index > step}
                className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3.5 text-left transition duration-200 ${
                  index === step
                    ? "border-[var(--kc-green)] bg-[var(--kc-green)] text-white shadow-none"
                    : index < step
                      ? "border-[#dce3dd] bg-[#f8faf8] text-[var(--kc-green-dark)] hover:border-[var(--kc-green)] hover:bg-[#f1f7f2]"
                      : "border-[#e3e7e3] bg-[#fafbfa] text-[var(--kc-muted)]"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${index === step ? "bg-white/15 text-white" : index < step ? "bg-[#e7f1e9] text-[var(--kc-green)]" : "bg-[#eef1ee] text-[#89938c]"}`}
                >
                  {item.number}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[.08em]">
                  {item.short}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* ERROR */}

      {error ? (
        <p
          id="application-error"
          role="alert"
          tabIndex={-1}
          className="mb-6 flex items-start gap-3 rounded-xl border border-[#edc7c1] bg-[#fff8f6] px-4 py-3.5 text-sm leading-6 text-[#8c3c32] shadow-none"
        >
          {error}
        </p>
      ) : null}

      <fieldset className="overflow-hidden rounded-2xl border border-[var(--kc-line)] bg-[var(--kc-paper)] shadow-none">
        <div className="border-b border-[#e8ece8] bg-gradient-to-r from-[#f7faf7] to-white px-6 py-7 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--kc-green)] text-[11px] font-bold text-white shadow-none">
              {steps[step]?.number}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--kc-green)]">
                Step {step + 1} of {steps.length}
              </p>
              <h1 className="mt-1 font-heading text-[28px] leading-tight tracking-[-0.025em] text-[var(--kc-green-dark)] sm:text-[34px]">
                {steps[step]?.title ?? ""}
              </h1>
              <p className="mt-2 text-[13px] leading-6 text-[var(--kc-muted)]">
                Complete the information below. Fields marked with{" "}
                <span className="font-semibold text-[var(--kc-brass)]">*</span>{" "}
                are required.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-7 sm:px-8 sm:py-9">
          {/* ====================================================== */}

          {/* STUDENT INFORMATION + BIRTH REGISTRATION */}

          {/* ====================================================== */}

          {step === 0 ? (
            <div className="mt-8 space-y-8">
              {/* STUDENT INFORMATION */}

              <section className="rounded-2xl border border-[var(--kc-line)] bg-[var(--kc-paper)] p-5 shadow-none sm:p-6">
                <h2 className="font-heading text-[25px] font-medium tracking-[-0.02em] text-[var(--kc-green-dark)]">
                  Student Information
                </h2>

                <div className="mt-6 space-y-6">
                  <Field
                    label="Full Name"
                    value={form.fullName}
                    onChange={(v) => set("fullName", v)}
                  />

                  <div className="grid gap-6 sm:grid-cols-[1fr_180px]">
                    <DateOfBirthField
                      value={form.dateOfBirth}
                      onChange={(v) => set("dateOfBirth", v)}
                    />

                    <div>
                      <label className="block text-[12px] font-semibold text-[var(--kc-ink)]">
                        Age
                      </label>

                      <input
                        value={age ? `${age} years` : ""}
                        readOnly
                        aria-label="Calculated age"
                        placeholder="Auto Calculated"
                        className="mt-2 h-12 w-full rounded-xl border border-[var(--kc-line)] bg-[var(--kc-soft)] px-4 text-[14px] text-[var(--kc-muted)] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <SelectField
                      label="Gender"
                      value={form.gender}
                      onChange={(v) => set("gender", v)}
                      options={["Female", "Male", "Other"]}
                      placeholder="Select gender"
                    />

                    <SelectField
                      label="Nationality"
                      value={form.nationality}
                      onChange={(v) => set("nationality", v)}
                      options={nationalities}
                      placeholder="Select nationality"
                    />
                  </div>

                  {/* MEDIUM */}

                  <div>
                    <p className="block text-[12px] font-semibold text-[var(--kc-ink)]">
                      Medium
                      <span className="ml-1 text-[var(--kc-brass)]">*</span>
                    </p>

                    <div className="mt-3 flex flex-wrap gap-6">
                      {["Bangla Version", "English Version"].map((option) => (
                        <label
                          key={option}
                          className="flex cursor-pointer items-center gap-2 text-sm text-[var(--kc-ink)]"
                        >
                          <input
                            type="radio"
                            name="medium"
                            checked={form.medium === option}
                            onChange={() => set("medium", option)}
                            className="accent-[#176b45]"
                          />

                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <SelectField
                    label="Class Applying For"
                    value={form.applyingClass}
                    onChange={(v) => set("applyingClass", v)}
                    options={classes}
                    placeholder="Select class"
                  />

                  <Field
                    label="Previous Institution"
                    value={form.previousInstitution}
                    required={false}
                    onChange={(v) => set("previousInstitution", v)}
                  />
                </div>
              </section>

              {/* BIRTH REGISTRATION INFORMATION */}

              <section className="border-t border-[var(--kc-line)] pt-7">
                <h2 className="font-heading text-[25px] font-medium tracking-[-0.02em] text-[var(--kc-green-dark)]">
                  Birth Registration Information
                </h2>

                <div className="mt-6 space-y-6">
                  <Field
                    label="Birth Registration No."
                    value={form.birthRegistrationNo}
                    inputMode="numeric"
                    maxLength={17}
                    pattern="[0-9]{17}"
                    placeholder="17-digit birth registration number"
                    onChange={(v) =>
                      set(
                        "birthRegistrationNo",
                        v.replace(/\D/g, "").slice(0, 17),
                      )
                    }
                  />

                  <p className="-mt-3 text-xs text-slate-500">
                    Enter exactly 17 digits as shown on the birth registration
                    certificate.
                  </p>

                  <div>
                    <label className="block text-[12px] font-semibold text-[var(--kc-ink)]">
                      Birth Registration Certificate
                      <span className="ml-1 text-[var(--kc-brass)]">*</span>
                    </label>

                    <label className="mt-2 flex min-h-[88px] cursor-pointer items-center justify-between gap-5 border border-dashed border-[var(--kc-line)] bg-[var(--kc-paper)] px-5 py-4 transition hover:border-[var(--kc-green)] hover:bg-white">
                      <div>
                        <p className="text-sm text-[var(--kc-ink)]">
                          {certificate
                            ? certificate.name
                            : "Choose a certificate file"}
                        </p>

                        <p className="mt-1 text-xs text-[var(--kc-muted)]">
                          PDF, JPG or PNG · maximum 5 MB
                        </p>
                      </div>

                      <span className="kc-classic-button kc-classic-button-outline shrink-0">
                        Browse
                      </span>

                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        required={!certificate}
                        onChange={(e) =>
                          setCertificate(e.target.files?.[0] ?? null)
                        }
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </section>
            </div>
          ) : null}

          {/* ====================================================== */}
          {/* GUARDIAN INFORMATION */}
          {/* ====================================================== */}

          {step === 1 ? (
            <div className="mt-8 space-y-8">
              <div>
                <h2 className="font-heading text-[25px] font-medium tracking-[-0.02em] text-[var(--kc-green-dark)]">
                  Parent / Guardian Information
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--kc-muted)]">
                  Father's and mother's information is mandatory. You may add
                  another legal guardian only when necessary.
                </p>
              </div>

              <section className="rounded-2xl border border-[var(--kc-line)] bg-[var(--kc-paper)] p-5 shadow-none sm:p-6">
                <div className="flex items-start justify-between gap-4 border-b border-[var(--kc-line)] pb-4">
                  <div>
                    <p className="font-heading text-[20px] font-medium tracking-[-0.015em] text-[var(--kc-green-dark)]">
                      Father's Information
                    </p>
                    <p className="mt-1 text-xs text-[var(--kc-muted)]">
                      Mandatory parent information
                    </p>
                  </div>
                  <span className="border border-[var(--kc-green)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--kc-green-dark)]">
                    Mandatory
                  </span>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Father's Name"
                      value={form.fatherName}
                      onChange={(v) => set("fatherName", v)}
                    />
                    <Field
                      label="Father's NID Number"
                      value={form.fatherNidNumber}
                      onChange={(v) => set("fatherNidNumber", v)}
                    />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <PhoneField
                      label="Father's Contact Number"
                      value={form.fatherContactNumber}
                      required={fatherAlive}
                      onChange={(v) => set("fatherContactNumber", v)}
                    />
                    <Field
                      label="Father's Occupation"
                      value={form.fatherOccupation}
                      onChange={(v) => set("fatherOccupation", v)}
                    />
                  </div>
                  <SelectField
                    label="Father's Nationality"
                    value={form.fatherNationality}
                    onChange={(v) => set("fatherNationality", v)}
                    options={nationalities}
                    placeholder="Select nationality"
                  />
                  <label className="flex items-center gap-3 border-t border-[var(--kc-line)] pt-5 text-sm text-[var(--kc-ink)]">
                    <input
                      type="checkbox"
                      checked={fatherAlive}
                      onChange={(e) => setFatherAlive(e.target.checked)}
                      className="h-4 w-4 accent-[#176b45]"
                    />
                    Father is alive
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--kc-line)] bg-[var(--kc-paper)] p-5 shadow-none sm:p-6">
                <div className="flex items-start justify-between gap-4 border-b border-[var(--kc-line)] pb-4">
                  <div>
                    <p className="font-heading text-[20px] font-medium tracking-[-0.015em] text-[var(--kc-green-dark)]">
                      Mother's Information
                    </p>
                    <p className="mt-1 text-xs text-[var(--kc-muted)]">
                      Mandatory parent information
                    </p>
                  </div>
                  <span className="border border-[var(--kc-green)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--kc-green-dark)]">
                    Mandatory
                  </span>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field
                      label="Mother's Name"
                      value={form.motherName}
                      onChange={(v) => set("motherName", v)}
                    />
                    <Field
                      label="Mother's NID Number"
                      value={form.motherNidNumber}
                      onChange={(v) => set("motherNidNumber", v)}
                    />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <PhoneField
                      label="Mother's Contact Number"
                      value={form.motherContactNumber}
                      required={motherAlive}
                      onChange={(v) => set("motherContactNumber", v)}
                    />
                    <Field
                      label="Mother's Occupation"
                      value={form.motherOccupation}
                      onChange={(v) => set("motherOccupation", v)}
                    />
                  </div>
                  <SelectField
                    label="Mother's Nationality"
                    value={form.motherNationality}
                    onChange={(v) => set("motherNationality", v)}
                    options={nationalities}
                    placeholder="Select nationality"
                  />
                  <label className="flex items-center gap-3 border-t border-[var(--kc-line)] pt-5 text-sm text-[var(--kc-ink)]">
                    <input
                      type="checkbox"
                      checked={motherAlive}
                      onChange={(e) => setMotherAlive(e.target.checked)}
                      className="h-4 w-4 accent-[#176b45]"
                    />
                    Mother is alive
                  </label>
                </div>
              </section>

              <section className="border-t border-[var(--kc-line)] pt-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-[25px] font-medium tracking-[-0.02em] text-[var(--kc-green-dark)]">
                      Additional Guardians
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--kc-muted)]">
                      Add another guardian only when necessary. This section may
                      remain empty.
                    </p>
                  </div>
                  <span className="hidden text-xs text-[var(--kc-muted)] sm:block">
                    Optional
                  </span>
                </div>

                {guardians.length > 0 ? (
                  <div className="mt-6 space-y-6">
                    {guardians.map((guardian, index) => (
                      <section
                        key={index}
                        className="rounded-2xl border border-[var(--kc-line)] bg-[var(--kc-paper)] p-5 shadow-none sm:p-6"
                      >
                        <div className="flex items-center justify-between gap-4 border-b border-[var(--kc-line)] pb-4">
                          <div>
                            <p className="font-heading text-[20px] font-medium tracking-[-0.015em] text-[var(--kc-green-dark)]">
                              Guardian {index + 1}
                            </p>
                            <p className="mt-1 text-xs text-[var(--kc-muted)]">
                              Additional guardian information
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeGuardian(index)}
                            className="text-xs font-medium text-[#a7473b] transition hover:text-[#7d2f27]"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-6 space-y-6">
                          <div className="grid gap-6 sm:grid-cols-2">
                            <Field
                              label="Guardian's Name"
                              value={guardian.name}
                              onChange={(value) =>
                                updateGuardian(index, { name: value })
                              }
                            />
                            <SelectField
                              label="Relationship"
                              value={guardian.relationship}
                              onChange={(value) =>
                                updateGuardian(index, { relationship: value })
                              }
                              options={guardianRelationships}
                              placeholder="Select relationship"
                            />
                          </div>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <Field
                              label="NID Number"
                              value={guardian.nidNumber}
                              onChange={(value) =>
                                updateGuardian(index, { nidNumber: value })
                              }
                            />
                            <PhoneField
                              label="Contact Number"
                              value={guardian.contactNumber}
                              required={guardian.isAlive}
                              onChange={(value) =>
                                updateGuardian(index, { contactNumber: value })
                              }
                            />
                          </div>
                          <div className="grid gap-6 sm:grid-cols-2">
                            <Field
                              label="Occupation"
                              value={guardian.occupation}
                              onChange={(value) =>
                                updateGuardian(index, { occupation: value })
                              }
                            />
                            <SelectField
                              label="Nationality"
                              value={guardian.nationality}
                              onChange={(value) =>
                                updateGuardian(index, { nationality: value })
                              }
                              options={nationalities}
                              placeholder="Select nationality"
                            />
                          </div>
                          <label className="flex items-center gap-3 border-t border-[var(--kc-line)] pt-5 text-sm text-[var(--kc-ink)]">
                            <input
                              type="checkbox"
                              checked={guardian.isAlive}
                              onChange={(e) =>
                                updateGuardian(index, {
                                  isAlive: e.target.checked,
                                })
                              }
                              className="h-4 w-4 accent-[#176b45]"
                            />
                            Guardian is alive
                          </label>
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 border border-dashed border-[var(--kc-line)] bg-[var(--kc-soft)] px-5 py-8 text-center">
                    <p className="text-sm text-[var(--kc-muted)]">
                      No additional guardian has been added.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setGuardians((items) => [...items, emptyGuardian()])
                  }
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-[var(--kc-green)] bg-white px-5 text-[13px] font-semibold text-[var(--kc-green-dark)] shadow-none transition hover:bg-[#f0f7f2] hover:shadow-none"
                >
                  + Add another guardian
                </button>
              </section>
            </div>
          ) : null}

          {/* ====================================================== */}
          {/* ADDRESS INFORMATION */}
          {/* ====================================================== */}

          {step === 2 ? (
            <div className="mt-8 space-y-7">
              <div>
                <h2 className="font-heading text-[25px] font-medium tracking-[-0.02em] text-[var(--kc-green-dark)]">
                  Address Information
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--kc-muted)]">
                  Provide the student's current residential address and
                  permanent home address. Include house/holding, road, area,
                  city, and district where applicable.
                </p>
              </div>

              <section className="rounded-2xl border border-[var(--kc-line)] bg-[var(--kc-paper)] p-5 shadow-none sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--kc-line)] text-sm font-semibold text-[var(--kc-green-dark)]">
                    01
                  </div>
                  <div>
                    <h3 className="font-heading text-[20px] font-medium tracking-[-0.015em] text-[var(--kc-green-dark)]">
                      Present Residential Address
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[var(--kc-muted)]">
                      Where the student currently lives.
                    </p>
                  </div>
                </div>
                <textarea
                  required
                  value={form.presentAddress}
                  onChange={(e) => {
                    const value = e.target.value;
                    set("presentAddress", value);
                    if (sameAddress) set("permanentAddress", value);
                  }}
                  rows={6}
                  placeholder="House / Holding No., Road, Area, Thana, District, Division, Postal Code"
                  className="mt-6 w-full resize-y rounded-xl border border-[var(--kc-line)] bg-[var(--kc-paper)] px-4 py-3.5 text-[14px] leading-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] outline-none transition duration-200 placeholder:text-[#a2aaa4] hover:border-[#c4ccc5] focus:border-[var(--kc-green)] focus:ring-4 focus:ring-[var(--kc-green)]/10"
                />
                <p className="mt-2 text-xs text-[var(--kc-muted)]">
                  Please provide enough detail for official correspondence and
                  verification.
                </p>
              </section>

              <section className="rounded-2xl border border-[var(--kc-line)] bg-[var(--kc-paper)] p-5 shadow-none sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--kc-line)] text-sm font-semibold text-[var(--kc-green-dark)]">
                    02
                  </div>
                  <div>
                    <h3 className="font-heading text-[20px] font-medium tracking-[-0.015em] text-[var(--kc-green-dark)]">
                      Permanent / Home Address
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[var(--kc-muted)]">
                      The student's permanent family or home address.
                    </p>
                  </div>
                </div>

                <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm text-[var(--kc-ink)]">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSameAddress(checked);
                      if (checked) set("permanentAddress", form.presentAddress);
                    }}
                    className="h-4 w-4 accent-[#176b45]"
                  />
                  Permanent address is the same as the present address
                </label>

                <textarea
                  required
                  value={form.permanentAddress}
                  onChange={(e) => set("permanentAddress", e.target.value)}
                  disabled={sameAddress}
                  rows={6}
                  placeholder="House / Holding No., Road, Area, Thana, District, Division, Postal Code"
                  className="mt-5 w-full resize-y rounded-xl border border-[var(--kc-line)] bg-[var(--kc-paper)] px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[#9b9f99] focus:border-[var(--kc-green)] focus:ring-1 focus:ring-[var(--kc-green)]/20 disabled:cursor-not-allowed disabled:bg-[var(--kc-soft)] disabled:text-[var(--kc-muted)]"
                />
                <p className="mt-2 text-xs text-[var(--kc-muted)]">
                  Use the full address as it should appear on school records.
                </p>
              </section>
            </div>
          ) : null}

          {/* ====================================================== */}
          {/* DECLARATION & CONFIRMATION */}
          {/* ====================================================== */}

          {step === 3 ? (
            <div className="mt-8 space-y-7">
              <section className="rounded-xl border border-[var(--kc-line)] bg-[var(--kc-paper)] p-6 sm:p-8">
                <div className="flex items-start gap-4 border-b border-[var(--kc-line)] pb-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--kc-green)] text-sm font-semibold text-[var(--kc-green-dark)]">
                    04
                  </div>
                  <div>
                    <h2 className="font-heading text-[25px] font-medium tracking-[-0.02em] text-[var(--kc-green-dark)]">
                      Final Confirmation
                    </h2>
                    <p className="mt-1 text-sm text-[var(--kc-muted)]">
                      Review your information and confirm the declaration before
                      submitting.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="border border-[var(--kc-line)] bg-[var(--kc-soft)] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--kc-muted)]">
                      Student
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--kc-ink)]">
                      {form.fullName || "Not completed"}
                    </p>
                  </div>
                  <div className="border border-[var(--kc-line)] bg-[var(--kc-soft)] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--kc-muted)]">
                      Class
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--kc-ink)]">
                      {form.applyingClass || "Not selected"}
                    </p>
                  </div>
                  <div className="border border-[var(--kc-line)] bg-[var(--kc-soft)] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--kc-muted)]">
                      Admission Cycle
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--kc-ink)]">
                      {selectedAdmissionCycle}
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-[var(--kc-line)] bg-[var(--kc-paper)] shadow-none p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--kc-muted)]">
                    Declaration &amp; Confirmation
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--kc-ink)]">
                    I hereby declare that all information provided in this
                    application is true, complete, and accurate to the best of
                    my knowledge. I confirm that the documents and certificates
                    submitted with this application are genuine and have not
                    been altered, falsified, or misrepresented. I understand
                    that providing false information or fraudulent documents may
                    result in cancellation of the application or admission and
                    may lead to further action according to the
                    institution&apos;s rules.
                  </p>

                  <label className="mt-6 flex cursor-pointer items-start gap-3 border-t border-[var(--kc-line)] pt-5">
                    <input
                      type="checkbox"
                      required
                      checked={declarationAccepted}
                      onChange={(e) => {
                        setDeclarationAccepted(e.target.checked);
                        if (e.target.checked) setError("");
                      }}
                      className="mt-1 h-4 w-4 rounded border-slate-300 accent-[#176b45]"
                    />
                    <span className="text-sm font-medium leading-6 text-[var(--kc-ink)]">
                      I confirm that the information provided above is true and
                      that all documents submitted are genuine and accurate.
                      <span className="ml-1 text-[var(--kc-brass)]">*</span>
                    </span>
                  </label>
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </fieldset>

      {/* ====================================================== */}

      {/* NAVIGATION */}

      {/* ====================================================== */}

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#e8ece8] pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => {
              setError("");

              setStep((current) => current - 1);
            }}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d7ddd7] bg-white px-5 text-[13px] font-semibold text-[var(--kc-ink)] shadow-none transition hover:border-[#bcc5bd] hover:bg-[#f8faf8]"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              if (stepValid()) {
                setError("");
                setStep((current) => current + 1);
              }
            }}
            className="inline-flex h-11 min-w-[130px] items-center justify-center rounded-xl bg-[var(--kc-green)] px-6 text-[13px] font-semibold text-white shadow-none transition hover:bg-[var(--kc-green-dark)]"
          >
            Continue{" "}
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending || !declarationAccepted}
            className="inline-flex h-11 min-w-[150px] items-center justify-center rounded-xl bg-[var(--kc-green)] px-6 text-[13px] font-semibold text-white shadow-none transition hover:bg-[var(--kc-green-dark)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {pending ? submittingLabel : submitLabel}{" "}
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </button>
        )}
      </div>
    </form>
  );
}
