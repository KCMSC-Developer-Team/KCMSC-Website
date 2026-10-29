import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_URL =
  "https://wa.me/8801793560466?text=Hello%20K%20C%20Model%20School%20%26%20College.%20I%20would%20like%20to%20enquire%20about%20admissions.";

export function FloatingWhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with KC Model School on WhatsApp"
      className="group fixed right-5 z-30 inline-flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#176b45] text-white shadow-[0_2px_10px_rgba(18,76,54,0.2)] transition-colors hover:bg-[#124c36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b59a4a] focus-visible:ring-offset-2"
      style={{ bottom: "calc(82px + env(safe-area-inset-bottom, 0px))" }}
    >
      <FaWhatsapp aria-hidden="true" className="h-6 w-6" />
      <span className="pointer-events-none absolute bottom-full right-0 mb-2 hidden whitespace-nowrap rounded-[2px] border border-[#d9d8cf] bg-[#fffdf8] px-3 py-2 text-[11px] font-medium text-[#124c36] shadow-[0_2px_8px_rgba(18,76,54,0.12)] md:block md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}
