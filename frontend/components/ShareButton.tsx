import { buildWhatsAppShareUrl } from "@/lib/whatsapp";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.1 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35l-.13.05Zm-5.46 7.46h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.22-3.74.98.99-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.1 6.79 6.79 2.1 12.01 2.1c2.55 0 4.94.99 6.74 2.79a9.5 9.5 0 0 1 2.8 6.75c0 5.22-4.7 9.9-9.93 9.9l-.01.1Zm8.39-18.3A11.86 11.86 0 0 0 12.02 0C5.46 0 .12 5.34.1 11.92a11.9 11.9 0 0 0 1.6 5.97L0 24l6.27-1.64a11.95 11.95 0 0 0 5.7 1.45h.01c6.56 0 11.9-5.34 11.93-11.92a11.84 11.84 0 0 0-3.51-8.45Z" />
    </svg>
  );
}

export function ShareButton({ message }: { message: string }) {
  return (
    <a
      href={buildWhatsAppShareUrl(message)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-card bg-[#25D366] px-5 py-3 font-bold text-white transition-[background-color,transform] duration-150 ease-out hover:bg-[#1EBE57] active:scale-[0.97]"
    >
      <WhatsAppIcon />
      Share on WhatsApp
    </a>
  );
}
