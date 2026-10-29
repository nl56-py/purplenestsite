import type { SiteSettings } from "@/lib/types";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/lib/icons";

export function SocialLinks({
  settings,
  className = "",
  iconClass = "size-5",
}: {
  settings: SiteSettings;
  className?: string;
  iconClass?: string;
}) {
  const items = [
    { url: settings.facebook_url, label: "Facebook", Icon: FacebookIcon },
    { url: settings.instagram_url, label: "Instagram", Icon: InstagramIcon },
    { url: settings.tiktok_url, label: "TikTok", Icon: TiktokIcon },
    { url: settings.youtube_url, label: "YouTube", Icon: YoutubeIcon },
  ].filter((i) => i.url);
  if (!items.length) return null;
  return (
    <div className={`flex items-center ${className}`}>
      {items.map(({ url, label, Icon }) => (
        <a key={label} href={url!} target="_blank" rel="noopener noreferrer" aria-label={label} className="transition">
          <Icon className={iconClass} />
        </a>
      ))}
    </div>
  );
}
