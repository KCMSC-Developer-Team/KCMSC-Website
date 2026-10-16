"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

type Teacher = {
  id: string;
  staffId: string;
  name: string;
  designation: string;
  wing: string;
  subjects: string[];
  photoUrl: string | null;
  highestDegree: string | null;
  university: string | null;
  qualifications: string | null;
  quote: string | null;
  biography: string | null;
  studentMessage: string | null;
  isPublished: boolean;
  isActive: boolean;
};

type ImportField =
  | "ignore"
  | "staffId"
  | "name"
  | "designation"
  | "wing"
  | "subjects"
  | "highestDegree"
  | "university";
type ImportPreview = { headers: string[]; rows: string[][]; fileName: string };

type ImportRow = {
  staffId: string;
  name: string;
  designation: string;
  wing: string;
  subjects: string[];
  highestDegree?: string;
  university?: string;
};

type TeacherForm = {
  staffId: string;
  name: string;
  designation: string;
  wing: string;
  subjects: string;
  highestDegree: string;
  university: string;
  photoUrl: string;
  qualifications: string;
  quote: string;
  biography: string;
  studentMessage: string;
  isPublished: boolean;
};

type TextFieldKey = Exclude<keyof TeacherForm, "isPublished">;

const inputClass =
  "w-full rounded-lg border border-[#d9d8cf] bg-white px-3 py-2.5 text-sm text-[#242824] outline-none focus:border-[#176b45]";
const labelClass = "mb-1.5 block text-xs font-medium text-[#59615b]";

const initialForm: TeacherForm = {
  staffId: "",
  name: "",
  designation: "Teacher",
  wing: "Senior Wing",
  subjects: "",
  highestDegree: "",
  university: "",
  photoUrl: "",
  qualifications: "",
  quote: "",
  biography: "",
  studentMessage: "",
  isPublished: false,
};

const basicFields = [
  { title: "Employee ID", key: "staffId" },
  { title: "Full name", key: "name" },
  { title: "Designation", key: "designation" },
  { title: "Subjects (comma separated)", key: "subjects" },
  { title: "Highest degree", key: "highestDegree" },
  { title: "University", key: "university" },
  { title: "Profile photo URL", key: "photoUrl" },
] as const satisfies ReadonlyArray<{ title: string; key: TextFieldKey }>;

const profileFields = [
  { title: "Academic qualifications (one per line)", key: "qualifications" },
  { title: "Favourite quote", key: "quote" },
  { title: "About the teacher", key: "biography" },
  { title: "Message to students", key: "studentMessage" },
] as const satisfies ReadonlyArray<{ title: string; key: TextFieldKey }>;

const wings = [
  "Junior Wing",
  "Senior Wing",
  "College Wing",
  "Primary Wing",
  "Administration",
  "Unassigned",
];

export default function TeachersAdmin({
  initialTeachers,
}: {
  initialTeachers: Teacher[];
}) {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [tab, setTab] = useState<"manual" | "import">("manual");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TeacherForm>({ ...initialForm });
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(
    null,
  );
  const [columnMapping, setColumnMapping] = useState<
    Record<string, ImportField>
  >({});
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [importProgress, setImportProgress] = useState<{
    total: number;
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    status: string;
  } | null>(null);

  function resetForm() {
    setEditId(null);
    setForm({ ...initialForm });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subjects: form.subjects
            .split(",")
            .map((subject) => subject.trim())
            .filter(Boolean),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save teacher");
      }

      setTeachers((current) => [
        data.teacher as Teacher,
        ...current.filter((teacher) => teacher.id !== data.teacher.id),
      ]);
      setMessage(
        `${editId ? "Updated" : "Saved"} ${data.teacher.name}. Initial password is the Employee ID; the teacher must change it at first login.`,
      );
      resetForm();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setBusy(false);
    }
  }

  const importFields: { value: ImportField; label: string }[] = [
    { value: "ignore", label: "Ignore this column" },
    { value: "staffId", label: "Employee ID / ID No. (required)" },
    { value: "name", label: "Teacher name (required)" },
    { value: "designation", label: "Designation" },
    { value: "wing", label: "Wing" },
    { value: "subjects", label: "Subjects" },
    { value: "highestDegree", label: "Highest degree" },
    { value: "university", label: "University" },
  ];

  function guessField(header: string): ImportField {
    const normalized = header
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    if (
      ["id", "idno", "staffid", "idnumber", "employeeid", "teacherid"].includes(
        normalized,
      )
    )
      return "staffId";
    if (
      ["name", "teachername", "fullname", "staffname", "employeename"].includes(
        normalized,
      )
    )
      return "name";
    if (["designation", "position", "title", "jobtitle"].includes(normalized))
      return "designation";
    if (["wing", "section", "schoolwing", "campus"].includes(normalized))
      return "wing";
    if (
      ["subject", "subjects", "teachingsubject", "teachingsubjects"].includes(
        normalized,
      )
    )
      return "subjects";
    if (
      ["degree", "highestdegree", "qualification", "academicdegree"].includes(
        normalized,
      )
    )
      return "highestDegree";
    if (
      [
        "university",
        "graduateduniversity",
        "institution",
        "universityname",
      ].includes(normalized)
    )
      return "university";
    return "ignore";
  }

  async function importFile(file: File) {
    setBusy(true);
    setMessage("");
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: false });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName)
        throw new Error("The workbook contains no worksheets.");
      const worksheet = workbook.Sheets[firstSheetName];
      if (!worksheet) throw new Error("Could not read the first worksheet.");
      const matrix = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
        header: 1,
        defval: "",
        raw: false,
      });
      const headerIndex = matrix.findIndex((row) =>
        row.some((cell) => String(cell ?? "").trim() !== ""),
      );
      if (headerIndex < 0) throw new Error("The selected worksheet is empty.");
      const headers = (matrix[headerIndex] || []).map(
        (cell, index) => String(cell ?? "").trim() || `Column ${index + 1}`,
      );
      const rows = matrix
        .slice(headerIndex + 1)
        .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
        .map((row) =>
          headers.map((_, index) => String(row[index] ?? "").trim()),
        );
      if (headers.length === 0 || rows.length === 0)
        throw new Error("No data rows were found below the header row.");
      const initialMapping: Record<string, ImportField> = {};
      headers.forEach((header, index) => {
        initialMapping[`${index}:${header}`] = guessField(header);
      });
      setImportPreview({ headers, rows, fileName: file.name });
      setColumnMapping(initialMapping);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not read workbook.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function confirmImport() {
    if (!importPreview) return;
    const selected = importPreview.headers
      .map((header, index) => ({
        header,
        field: columnMapping[`${index}:${header}`] || "ignore",
        index,
      }))
      .filter((item) => item.field !== "ignore");
    const mappedFields = selected.map((item) => item.field);
    if (!mappedFields.includes("staffId") || !mappedFields.includes("name")) {
      setMessage(
        "Map one column to Employee ID / ID No. and another to Teacher name before importing.",
      );
      return;
    }
    const duplicateTargets = mappedFields.filter(
      (field, index) => mappedFields.indexOf(field) !== index,
    );
    if (duplicateTargets.length) {
      setMessage(
        "Each target field can be mapped to only one source column. Fix the duplicate mappings first.",
      );
      return;
    }
    const rows: ImportRow[] = importPreview.rows.map((cells) => {
      const value = (field: ImportField) => {
        const item = selected.find((column) => column.field === field);
        return item ? String(cells[item.index] ?? "").trim() : "";
      };
      return {
        staffId: value("staffId"),
        name: value("name"),
        designation: value("designation") || "Teacher",
        wing: value("wing") || "Unassigned",
        subjects: value("subjects")
          .split(/[,;|]/)
          .map((subject) => subject.trim())
          .filter(Boolean),
        highestDegree: value("highestDegree") || undefined,
        university: value("university") || undefined,
      };
    });
    const validRows = rows.filter((row) => row.staffId && row.name);
    if (validRows.length === 0) {
      setMessage(
        "No valid rows found. Check that the mapped Employee ID and Teacher name columns contain values.",
      );
      return;
    }
    setBusy(true);
    setMessage("");
    const batchSize = 5;
    const total = validRows.length;
    let processed = 0;
    let created = 0;
    let updated = 0;
    let skipped = rows.length - validRows.length;
    const importErrors: string[] = [];
    setImportProgress({
      total,
      processed: 0,
      created: 0,
      updated: 0,
      skipped,
      status: "Preparing import…",
    });
    try {
      for (let start = 0; start < total; start += batchSize) {
        const batch = validRows.slice(start, start + batchSize);
        setImportProgress({
          total,
          processed,
          created,
          updated,
          skipped,
          status: `Importing rows ${start + 1}–${Math.min(start + batch.length, total)} of ${total}…`,
        });
        const response = await fetch("/api/admin/teachers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rows: batch }),
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || `Import failed at row ${start + 1}.`);
        created += Number(data.created || 0);
        updated += Number(data.updated || 0);
        skipped += Number(data.skipped || 0);
        if (Array.isArray(data.errors))
          importErrors.push(...data.errors.map(String));
        processed += batch.length;
        setImportProgress({
          total,
          processed,
          created,
          updated,
          skipped,
          status:
            processed >= total
              ? "Finishing up…"
              : `Processed ${processed} of ${total} rows`,
        });
        if (Array.isArray(data.teachers))
          setTeachers(data.teachers as Teacher[]);
      }
      setMessage(
        `Import finished: ${created} created, ${updated} updated, ${skipped} skipped. ${rows.length - validRows.length} rows missing Employee ID or name were excluded.${importErrors.length ? ` Issues: ${importErrors.slice(0, 5).join("; ")}` : ""}`,
      );
      setImportPreview(null);
      setColumnMapping({});
    } catch (error) {
      setMessage(
        `${error instanceof Error ? error.message : "Import failed."} ${processed} of ${total} valid rows were processed before the error.`,
      );
    } finally {
      setBusy(false);
      setImportProgress(null);
    }
  }

  async function toggle(teacher: Teacher, field: "isPublished" | "isActive") {
    try {
      const response = await fetch("/api/admin/teachers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: teacher.id, [field]: !teacher[field] }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Update failed");
        return;
      }

      setTeachers((current) =>
        current.map((item) =>
          item.id === teacher.id ? { ...item, [field]: !item[field] } : item,
        ),
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update teacher.",
      );
    }
  }

  function toggleSelectedTeacher(id: string) {
    setSelectedTeacherIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function toggleSelectAllTeachers() {
    setSelectedTeacherIds((current) =>
      current.length === teachers.length
        ? []
        : teachers.map((teacher) => teacher.id),
    );
  }

  async function setSelectedPublished(isPublished: boolean) {
    if (!selectedTeacherIds.length || publishing) return;
    const selected = teachers.filter((teacher) =>
      selectedTeacherIds.includes(teacher.id),
    );
    const eligible = selected.filter(
      (teacher) => teacher.isPublished !== isPublished,
    );
    if (!eligible.length) {
      setMessage(
        isPublished
          ? "All selected teachers are already published."
          : "All selected teachers are already unpublished.",
      );
      return;
    }
    const action = isPublished ? "publish" : "unpublish";
    if (
      !window.confirm(
        `${action.charAt(0).toUpperCase() + action.slice(1)} ${eligible.length} selected teacher profile(s)?`,
      )
    )
      return;
    setPublishing(true);
    setMessage("");
    try {
      const ids = eligible.map((teacher) => teacher.id);
      const response = await fetch("/api/admin/teachers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, isPublished }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || `Could not ${action} selected teachers.`);
      const changed = new Set<string>(ids);
      setTeachers((current) =>
        current.map((teacher) =>
          changed.has(teacher.id) ? { ...teacher, isPublished } : teacher,
        ),
      );
      setMessage(
        `${action.charAt(0).toUpperCase() + action.slice(1)} ${data.updated ?? ids.length} teacher profile(s).`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : `Bulk ${action} failed.`,
      );
    } finally {
      setPublishing(false);
    }
  }

  async function deleteSelectedTeachers() {
    if (!selectedTeacherIds.length || deleting) return;
    const selected = teachers.filter((teacher) =>
      selectedTeacherIds.includes(teacher.id),
    );
    const confirmed = window.confirm(
      `Permanently delete ${selected.length} selected teacher record(s) and their login accounts? This cannot be undone.`,
    );
    if (!confirmed) return;
    setDeleting(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/teachers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedTeacherIds }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Could not delete selected teachers.");
      const deletedIds = new Set<string>(data.deletedIds || selectedTeacherIds);
      setTeachers((current) =>
        current.filter((teacher) => !deletedIds.has(teacher.id)),
      );
      setSelectedTeacherIds([]);
      if (editId && deletedIds.has(editId)) resetForm();
      setMessage(
        `Deleted ${deletedIds.size} teacher record(s) and their login accounts.`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Bulk delete failed.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function editTeacher(teacher: Teacher) {
    setTab("manual");
    setEditId(teacher.id);
    setForm({
      staffId: teacher.staffId,
      name: teacher.name,
      designation: teacher.designation,
      wing: teacher.wing,
      subjects: teacher.subjects.join(", "),
      highestDegree: teacher.highestDegree || "",
      university: teacher.university || "",
      photoUrl: teacher.photoUrl || "",
      qualifications: teacher.qualifications || "",
      quote: teacher.quote || "",
      biography: teacher.biography || "",
      studentMessage: teacher.studentMessage || "",
      isPublished: teacher.isPublished,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="max-w-[1280px]">
      <header className="flex flex-col gap-3 border-b border-[#d9d8cf] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-[.2em] text-[#176b45]">
            People management
          </p>
          <h1 className="mt-2 font-heading text-3xl text-[#124c36]">
            Teachers &amp; faculty
          </h1>
          <p className="mt-2 text-sm text-[#69716b]">
            Manage staff records, subject assignments, accounts and public
            profiles.
          </p>
        </div>
        <span className="rounded-full bg-[#efeee7] px-3 py-1.5 text-xs text-[#176b45]">
          {teachers.length} records
        </span>
      </header>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("manual")}
          className={`rounded-lg px-4 py-2 text-sm ${tab === "manual" ? "bg-[#176b45] text-white" : "border border-[#d9d8cf] bg-white text-[#59615b]"}`}
        >
          Add manually
        </button>
        <button
          type="button"
          onClick={() => setTab("import")}
          className={`rounded-lg px-4 py-2 text-sm ${tab === "import" ? "bg-[#176b45] text-white" : "border border-[#d9d8cf] bg-white text-[#59615b]"}`}
        >
          Bulk import Excel/CSV
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-lg border border-[#d9d8cf] bg-[#fffdf8] p-3 text-sm text-[#354b3d]">
          {message}
        </div>
      )}

      {tab === "manual" ? (
        <form
          onSubmit={submit}
          className="mt-5 rounded-xl border border-[#d9d8cf] bg-[#fffdf8] p-5 sm:p-7"
        >
          <h2 className="font-heading text-xl text-[#124c36]">
            {editId ? "Edit teacher" : "New teacher account"}
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#69716b]">
            Account is created automatically. Initial password equals the
            Employee ID and must be changed after first login.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {basicFields.map(({ title, key }) => (
              <label key={key}>
                <span className={labelClass}>{title}</span>
                <input
                  required={
                    key === "staffId" || key === "name" || key === "designation"
                  }
                  disabled={Boolean(editId) && key === "staffId"}
                  className={inputClass}
                  value={form[key]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}

            <label>
              <span className={labelClass}>Wing</span>
              <select
                className={inputClass}
                value={form.wing}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    wing: event.target.value,
                  }))
                }
              >
                {wings.map((wing) => (
                  <option key={wing} value={wing}>
                    {wing}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {profileFields.map(({ title, key }) => (
              <label key={key}>
                <span className={labelClass}>{title}</span>
                <textarea
                  rows={key === "quote" ? 2 : 4}
                  className={inputClass}
                  value={form[key]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-[#59615b]">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  isPublished: event.target.checked,
                }))
              }
            />
            Publish profile publicly
          </label>

          <button
            type="submit"
            disabled={busy}
            className="mt-5 rounded-lg bg-[#176b45] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? "Saving…" : editId ? "Save changes" : "Create teacher"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-3 rounded-lg border border-[#d9d8cf] px-4 py-3 text-sm"
            >
              Cancel edit
            </button>
          )}
        </form>
      ) : (
        <div className="mt-5 rounded-xl border border-[#d9d8cf] bg-[#fffdf8] p-5 sm:p-7">
          <h2 className="font-heading text-xl text-[#124c36]">
            Import teacher spreadsheet
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#69716b]">
            Upload the existing workbook. The importer recognises ID No., Name
            and Designation. Wing and subject columns are optional; missing
            values remain unassigned. Existing Employee IDs are updated instead
            of duplicated.
          </p>
          <label className="mt-5 block max-w-xl">
            <span className={labelClass}>Excel workbook or CSV</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              disabled={busy}
              className="block w-full text-sm"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importFile(file);
                event.currentTarget.value = "";
              }}
            />
          </label>
          {busy && (
            <p className="mt-4 text-sm text-[#176b45]">Reading workbook…</p>
          )}
          <p className="mt-4 text-xs leading-5 text-[#69716b]">
            Imported accounts use each Employee ID as the initial password. They
            will be required to change it at first login. Newly imported
            profiles remain unpublished until you publish them.
          </p>
        </div>
      )}

      <section className="mt-8 overflow-hidden rounded-xl border border-[#d9d8cf] bg-[#fffdf8]">
        <div className="flex flex-col gap-3 border-b border-[#d9d8cf] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-xl text-[#124c36]">
              Teacher records
            </h2>
            <p className="mt-1 text-xs text-[#69716b]">
              Publish controls what appears in the public directory. Inactive
              accounts cannot log in.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void setSelectedPublished(true)}
              disabled={!selectedTeacherIds.length || publishing || deleting}
              className="rounded-lg bg-[#176b45] px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {publishing
                ? "Updating…"
                : `Publish selected (${selectedTeacherIds.length})`}
            </button>
            <button
              type="button"
              onClick={() => void setSelectedPublished(false)}
              disabled={!selectedTeacherIds.length || publishing || deleting}
              className="rounded-lg border border-[#d9d8cf] bg-white px-4 py-2.5 text-sm font-medium text-[#425047] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Unpublish selected
            </button>
            <button
              type="button"
              onClick={() => void deleteSelectedTeachers()}
              disabled={!selectedTeacherIds.length || deleting || publishing}
              className="rounded-lg border border-[#b84436] bg-white px-4 py-2.5 text-sm font-medium text-[#a43f32] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {deleting
                ? "Deleting…"
                : `Delete selected (${selectedTeacherIds.length})`}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-[#efeee7] text-[10px] uppercase tracking-wider text-[#69716b]">
              <tr>
                <th className="px-4 py-3">
                  <input
                    aria-label="Select all teachers"
                    type="checkbox"
                    checked={
                      teachers.length > 0 &&
                      selectedTeacherIds.length === teachers.length
                    }
                    onChange={toggleSelectAllTeachers}
                  />
                </th>
                {[
                  "Teacher",
                  "Employee ID",
                  "Wing / subjects",
                  "Designation",
                  "Account",
                  "Public profile",
                  "Edit",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e2d9]">
              {teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className={
                    selectedTeacherIds.includes(teacher.id)
                      ? "bg-[#fff5f2]"
                      : ""
                  }
                >
                  <td className="px-4 py-3">
                    <input
                      aria-label={`Select ${teacher.name}`}
                      type="checkbox"
                      checked={selectedTeacherIds.includes(teacher.id)}
                      onChange={() => toggleSelectedTeacher(teacher.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#242824]">{teacher.name}</p>
                    <p className="mt-1 text-xs text-[#69716b]">
                      {teacher.highestDegree || "Qualification not added"}
                      {teacher.university ? ` · ${teacher.university}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {teacher.staffId}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {teacher.wing}
                    <p className="mt-1 text-[#69716b]">
                      {teacher.subjects.join(", ") || "No subject assigned"}
                    </p>
                  </td>
                  <td className="px-4 py-3">{teacher.designation}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void toggle(teacher, "isActive")}
                      className={`rounded-full px-2.5 py-1 text-xs ${teacher.isActive ? "bg-[#e1efe5] text-[#176b45]" : "bg-[#f6e7e3] text-[#8d3b2e]"}`}
                    >
                      {teacher.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void toggle(teacher, "isPublished")}
                      className={`rounded-full px-2.5 py-1 text-xs ${teacher.isPublished ? "bg-[#e1efe5] text-[#176b45]" : "bg-[#efeee7] text-[#69716b]"}`}
                    >
                      {teacher.isPublished ? "Published" : "Unpublished"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => editTeacher(teacher)}
                      className="text-xs font-medium text-[#176b45] hover:underline"
                    >
                      Edit record
                    </button>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-[#69716b]"
                  >
                    No teacher records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {importPreview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17251e]/60 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="column-mapping-title"
        >
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#d9d8cf] bg-[#fffdf8] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#e4e2d9] px-5 py-4 sm:px-7">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#176b45]">
                  Step 1 of 2 · Configure import
                </p>
                <h2
                  id="column-mapping-title"
                  className="mt-1 font-heading text-2xl text-[#124c36]"
                >
                  Match spreadsheet columns
                </h2>
                <p className="mt-1 text-sm text-[#69716b]">
                  {importPreview.fileName} · {importPreview.rows.length} data
                  rows detected. Review the automatic matches before importing.
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setImportPreview(null);
                  setColumnMapping({});
                }}
                className="rounded-lg border border-[#d9d8cf] px-3 py-2 text-sm text-[#59615b] disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            <div className="overflow-auto px-5 py-4 sm:px-7">
              {busy && importProgress && (
                <section
                  className="mb-4 rounded-xl border border-[#b8d8c4] bg-[#f0f8f2] p-4"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#124c36]">
                        Importing teachers
                      </p>
                      <p className="mt-1 text-xs text-[#596b60]">
                        {importProgress.status}
                      </p>
                    </div>
                    <span className="shrink-0 text-lg font-semibold tabular-nums text-[#176b45]">
                      {Math.round(
                        (importProgress.processed /
                          Math.max(importProgress.total, 1)) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <div
                    className="h-3 w-full overflow-hidden rounded-full bg-[#dce8df]"
                    role="progressbar"
                    aria-label="Teacher import progress"
                    aria-valuemin={0}
                    aria-valuemax={importProgress.total}
                    aria-valuenow={importProgress.processed}
                  >
                    <div
                      className="h-full rounded-full bg-[#176b45] transition-all duration-300 ease-out"
                      style={{
                        width: `${Math.min(100, (importProgress.processed / Math.max(importProgress.total, 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#596b60]">
                    <span>
                      <strong className="text-[#242824]">
                        {importProgress.processed}
                      </strong>{" "}
                      / {importProgress.total} processed
                    </span>
                    <span>
                      <strong className="text-[#176b45]">
                        {importProgress.created}
                      </strong>{" "}
                      created
                    </span>
                    <span>
                      <strong className="text-[#176b45]">
                        {importProgress.updated}
                      </strong>{" "}
                      updated
                    </span>
                    <span>
                      <strong className="text-[#a43f32]">
                        {importProgress.skipped}
                      </strong>{" "}
                      skipped
                    </span>
                  </div>
                </section>
              )}
              <div className="mb-4 rounded-lg border border-[#e6d9ad] bg-[#fff8e4] p-3 text-sm text-[#6e5a24]">
                Required: map a source column to{" "}
                <strong>Employee ID / ID No.</strong> and another to{" "}
                <strong>Teacher name</strong>. Columns you don't need can be
                ignored.
              </div>
              <div className="overflow-x-auto rounded-lg border border-[#e4e2d9]">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-[#efeee7] text-[10px] uppercase tracking-wider text-[#69716b]">
                    <tr>
                      <th className="px-4 py-3">Source column in your file</th>
                      <th className="px-4 py-3">Assign this column to</th>
                      <th className="px-4 py-3">Sample values</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e4e2d9]">
                    {importPreview.headers.map((header, index) => {
                      const key = `${index}:${header}`;
                      const samples = importPreview.rows
                        .slice(0, 3)
                        .map((row) => row[index])
                        .filter(Boolean);
                      return (
                        <tr key={key}>
                          <td className="px-4 py-3 font-medium text-[#242824]">
                            {header}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              className={`${inputClass} min-w-[250px]`}
                              value={columnMapping[key] || "ignore"}
                              onChange={(event) =>
                                setColumnMapping((current) => ({
                                  ...current,
                                  [key]: event.target.value as ImportField,
                                }))
                              }
                            >
                              {importFields.map((field) => (
                                <option key={field.value} value={field.value}>
                                  {field.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="max-w-[300px] px-4 py-3 text-xs text-[#69716b]">
                            {samples.length ? (
                              samples.join(" · ")
                            ) : (
                              <span className="italic">No sample values</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-[#124c36]">
                  Preview · first 5 rows after mapping
                </h3>
                <div className="mt-2 overflow-x-auto rounded-lg border border-[#e4e2d9]">
                  <table className="w-full min-w-[700px] text-left text-xs">
                    <thead className="bg-[#f5f4ed] text-[#69716b]">
                      <tr>
                        {[
                          "Employee ID",
                          "Name",
                          "Designation",
                          "Wing",
                          "Subjects",
                        ].map((heading) => (
                          <th key={heading} className="px-3 py-2">
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4e2d9]">
                      {importPreview.rows.slice(0, 5).map((cells, rowIndex) => {
                        const val = (field: ImportField) => {
                          const columnIndex = importPreview.headers.findIndex(
                            (header, index) =>
                              columnMapping[`${index}:${header}`] === field,
                          );
                          return columnIndex >= 0
                            ? cells[columnIndex] || ""
                            : "";
                        };
                        return (
                          <tr key={rowIndex}>
                            <td className="px-3 py-2">
                              {val("staffId") || (
                                <span className="text-[#a43f32]">Missing</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {val("name") || (
                                <span className="text-[#a43f32]">Missing</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {val("designation") || "Teacher (default)"}
                            </td>
                            <td className="px-3 py-2">
                              {val("wing") || "Unassigned"}
                            </td>
                            <td className="px-3 py-2">
                              {val("subjects") || "Unassigned"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-[#e4e2d9] bg-[#f8f7f1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p className="text-xs text-[#69716b]">
                Existing Employee IDs will be updated, not duplicated. New
                profiles remain unpublished.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setImportPreview(null);
                    setColumnMapping({});
                  }}
                  className="rounded-lg border border-[#d9d8cf] bg-white px-4 py-2.5 text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void confirmImport()}
                  className="rounded-lg bg-[#176b45] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {busy
                    ? "Importing…"
                    : `Confirm mapping & import ${importPreview.rows.length} rows`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
