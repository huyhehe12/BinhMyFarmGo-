import { Headset, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import messengerIcon from "@/assets/icon-messenger.png.asset.json";
import phoneIcon from "@/assets/icon-phone.png.asset.json";
import zaloIcon from "@/assets/icon-zalo.png.asset.json";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { contactConfig } from "@/lib/contact-config";

type ContactAction = {
  label: string;
  href: string;
  iconUrl: string;
  external?: boolean;
};

const contactActions: ContactAction[] = [
  {
    label: "Gọi điện",
    href: contactConfig.phone ? `tel:${contactConfig.phone}` : "",
    iconUrl: phoneIcon.url,
  },
  {
    label: "Messenger",
    href: contactConfig.messengerUrl,
    iconUrl: messengerIcon.url,
    external: true,
  },
  {
    label: "Zalo",
    href: contactConfig.zaloUrl,
    iconUrl: zaloIcon.url,
    external: true,
  },
];


export function FloatingContactMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !containerRef.current?.contains(target)) setOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [open]);

  function handleContact(action: ContactAction) {
    if (!action.href) {
      toast.info("Thông tin liên hệ đang cập nhật");
      return;
    }

    if (action.external) {
      window.open(action.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = action.href;
    }
  }

  return (
    <TooltipProvider delayDuration={250}>
      <div
        ref={containerRef}
        className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6"
      >
        <div
          id="quick-contact-actions"
          aria-hidden={!open}
          className={`flex flex-col items-end gap-3 transition-all duration-200 motion-reduce:transition-none ${
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          {contactActions.map((action) => {
            return (
              <Tooltip key={action.label}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    tabIndex={open ? 0 : -1}
                    aria-label={action.label}
                    onClick={() => handleContact(action)}
                    className="h-12 w-12 overflow-hidden rounded-full border border-border bg-card p-0 shadow-lg hover:bg-card focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <img
                      src={action.iconUrl}
                      alt=""
                      aria-hidden="true"
                      className="h-8 w-8 object-contain"
                    />
                  </Button>
                </TooltipTrigger>

                <TooltipContent side="left" sideOffset={10}>
                  {action.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              aria-label={open ? "Đóng menu liên hệ" : "Mở menu liên hệ"}
              aria-expanded={open}
              aria-controls="quick-contact-actions"
              onClick={() => setOpen((value) => !value)}
              className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-primary/90 motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              {open ? (
                <X className="size-6" aria-hidden="true" />
              ) : (
                <Headset className="size-6" aria-hidden="true" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={10}>
            {open ? "Đóng" : "Liên hệ"}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}