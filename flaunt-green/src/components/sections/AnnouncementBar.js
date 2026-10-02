import { announcement } from "@/lib/content";

export default function AnnouncementBar() {
  return (
    <div className="bg-[#f4dcdd] text-xs py-2 overflow-hidden font-medium tracking-wide sm:tracking-widest text-[#5c584d] leading-relaxed">
      <div className="whitespace-nowrap animate-marquee inline-flex gap-16">
        <span>{announcement.text}</span>
        <span>{announcement.text}</span>
        <span>{announcement.text}</span>
        <span>{announcement.text}</span>
      </div>
    </div>
  );
}
