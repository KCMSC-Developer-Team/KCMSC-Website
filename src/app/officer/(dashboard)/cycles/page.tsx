import Link from "next/link";

import { prisma } from "@/lib/db";
import { requireOfficer } from "@/lib/session";
import {
  createCycleAction,
  deleteCycleAction,
  updateCycleAction,
} from "@/app/admin/(dashboard)/admissions/actions";

import { SubmitButton } from "@/components/admin/SubmitButton";

const ERRORS: Record<string, string> = {
  invalid_cycle: "Fill in every cycle field.",
  invalid_dates:
    "The closing date and time must be after the opening date and time.",
  overlap:
    "This cycle overlaps another cycle. Keep admission windows separate.",
  cycle_has_applications:
    "This cycle cannot be deleted because it already has applications.",
  cycle_not_found: "The cycle could not be found.",
};

function inputDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((item) => item.type === type)?.value ?? "00";

  return `${get("year")}-${get("month")}-${get("day")}T${get(
    "hour",
  )}:${get("minute")}`;
}

function formatDhaka(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function cycleState(opensAt: Date, closesAt: Date) {
  const now = Date.now();

  if (now < opensAt.getTime()) {
    return "Upcoming";
  }

  if (now <= closesAt.getTime()) {
    return "Running";
  }

  return "Closed";
}

export default async function OfficerCyclesPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    edit?: string;
    deleted?: string;
  }>;
}) {
  await requireOfficer();

  const cycles = await prisma.admissionCycle.findMany({
    orderBy: {
      opensAt: "desc",
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  const editId = (await searchParams).edit;
  const editing = editId
    ? cycles.find((cycle: typeof cycles[number]) => cycle.id === editId)
    : null;
  const { error, deleted } = await searchParams;

  return (
    <div className="max-w-[1200px]">
      <header className="border-b border-[#d9d8cf] pb-7">
        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#176b45]">
          Admissions
        </p>

        <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-heading text-3xl font-normal text-[#124c36]">
              Admission cycles
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#69716b]">
              Create and manage the admission windows used by the school.
            </p>
          </div>

          <Link
            href="/officer/applications"
            className="kc-classic-button kc-classic-button-outline"
          >
            Applications
          </Link>
        </div>
      </header>

      {error ? (
        <div className="mt-5 rounded-[14px] border border-[#a64b3c]/20 bg-[#a64b3c]/5 p-4 text-sm text-[#a64b3c]">
          {ERRORS[error] ?? "Something went wrong."}
        </div>
      ) : null}

      {deleted ? (
        <div className="mt-5 rounded-[14px] border border-[#176b45]/20 bg-[#176b45]/5 p-4 text-sm text-[#176b45]">
          Admission cycle deleted successfully.
        </div>
      ) : null}

      <section className="mt-6 space-y-3">
        {cycles.map((cycle: typeof cycles[number]) => {
          const state = cycleState(cycle.opensAt, cycle.closesAt);

          const isEditing = editing?.id === cycle.id;

          return (
            <div
              key={cycle.id}
              className="rounded-[14px] border border-[#d9d8cf] bg-[#fffdf8] p-5"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading text-xl text-[#124c36]">
                      {cycle.nameEn}
                    </h2>

                    <span className="rounded-full bg-[#efeee7] px-2.5 py-1 text-[10px] font-medium text-[#176b45]">
                      {state}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-[#69716b]">{cycle.nameBn}</p>

                  <p className="mt-2 text-xs text-[#8a918b]">
                    {formatDhaka(cycle.opensAt)} → {formatDhaka(cycle.closesAt)}
                  </p>

                  <p className="mt-1 text-xs text-[#8a918b]">
                    {cycle._count.applications} application
                    {cycle._count.applications === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/officer/cycles?edit=${cycle.id}`}
                    className="kc-classic-button kc-classic-button-outline"
                  >
                    Edit
                  </Link>

                  {cycle._count.applications === 0 ? (
                    <form action={deleteCycleAction.bind(null, cycle.id)}>
                      <button
                        type="submit"
                        className="kc-classic-button border border-[#a64b3c]/30 text-[#a64b3c] hover:bg-[#a64b3c]/5"
                      >
                        Delete
                      </button>
                    </form>
                  ) : (
                    <span className="self-center text-xs text-[#9a9d99]">
                      Protected
                    </span>
                  )}
                </div>
              </div>

              {isEditing ? (
                <form
                  action={updateCycleAction.bind(null, cycle.id)}
                  className="mt-5 grid gap-3 border-t border-[#d9d8cf] pt-5 sm:grid-cols-2"
                >
                  <input
                    name="nameEn"
                    required
                    defaultValue={cycle.nameEn}
                    placeholder="Cycle name (English)"
                    className="rounded-md border border-[#d9d8cf] bg-white px-3 py-2 text-sm"
                  />

                  <input
                    name="nameBn"
                    required
                    defaultValue={cycle.nameBn}
                    placeholder="চক্রের নাম (বাংলা)"
                    className="rounded-md border border-[#d9d8cf] bg-white px-3 py-2 text-sm font-bangla"
                  />

                  <label className="text-xs text-[#69716b]">
                    Starts
                    <input
                      name="opensAt"
                      type="datetime-local"
                      required
                      defaultValue={inputDate(cycle.opensAt)}
                      className="mt-1 block w-full rounded-md border border-[#d9d8cf] bg-white px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="text-xs text-[#69716b]">
                    Ends
                    <input
                      name="closesAt"
                      type="datetime-local"
                      required
                      defaultValue={inputDate(cycle.closesAt)}
                      className="mt-1 block w-full rounded-md border border-[#d9d8cf] bg-white px-3 py-2 text-sm"
                    />
                  </label>

                  <div className="flex gap-3 sm:col-span-2">
                    <SubmitButton label="Save cycle" pendingLabel="Saving…" />

                    <Link
                      href="/officer/cycles"
                      className="kc-classic-button kc-classic-button-outline"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              ) : null}
            </div>
          );
        })}
      </section>

      <section className="mt-6 rounded-[14px] border border-[#d9d8cf] bg-[#fffdf8] p-5">
        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#176b45]">
          New window
        </p>

        <h2 className="mt-1 font-heading text-xl text-[#124c36]">
          Create an admission cycle
        </h2>

        <form
          action={createCycleAction}
          className="mt-5 grid gap-3 sm:grid-cols-2"
        >
          <input
            name="nameEn"
            required
            placeholder="Cycle name (English)"
            className="rounded-md border border-[#d9d8cf] bg-white px-3 py-2 text-sm"
          />

          <input
            name="nameBn"
            required
            placeholder="চক্রের নাম (বাংলা)"
            className="rounded-md border border-[#d9d8cf] bg-white px-3 py-2 text-sm font-bangla"
          />

          <label className="text-xs text-[#69716b]">
            Starts
            <input
              name="opensAt"
              type="datetime-local"
              required
              className="mt-1 block w-full rounded-md border border-[#d9d8cf] bg-white px-3 py-2 text-sm"
            />
          </label>

          <label className="text-xs text-[#69716b]">
            Ends
            <input
              name="closesAt"
              type="datetime-local"
              required
              className="mt-1 block w-full rounded-md border border-[#d9d8cf] bg-white px-3 py-2 text-sm"
            />
          </label>

          <div className="sm:col-span-2">
            <SubmitButton label="Create cycle" pendingLabel="Creating…" />
          </div>
        </form>
      </section>
    </div>
  );
}
