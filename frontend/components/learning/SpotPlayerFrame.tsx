"use client";

import { useEffect, useRef } from "react";
import { PlayCircle, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";

type SpotPlayerFrameProps = {
  videoId?: string | null;
  lessonId?: string;
};

type ProgressResponse = {
  lessonId: string;
  watchedSeconds: number;
  durationSeconds: number;
  lastPositionSeconds: number;
  progressPercent: number;
  courseProgress: number;
};

export default function SpotPlayerFrame({
  videoId,
  lessonId,
}: SpotPlayerFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const lastSavedTimeRef = useRef(0);

  const saveProgress = async (currentTime: number, duration: number) => {
    if (!lessonId) return;
    if (!duration || duration <= 0) return;
    if (!Number.isFinite(currentTime)) return;

    try {
      const result = await apiFetch<ProgressResponse>(
        `/LessonProgress/${lessonId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            watchedSeconds: currentTime,
            durationSeconds: duration,
            lastPositionSeconds: currentTime,
          }),
        },
      );

      console.log("Progress saved:", result);

      lastSavedTimeRef.current = currentTime;
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  useEffect(() => {
    /*
     * فعلاً اینجا eventهای واقعی SpotPlayer را
     * وصل نمی‌کنیم.
     *
     * بعد از مشخص شدن API رسمی SpotPlayer،
     * currentTime و duration را از همین iframe
     * دریافت خواهیم کرد.
     */

    return () => {
      // cleanup برای listenerهای SpotPlayer
    };
  }, [lessonId, videoId]);

  const src = process.env.NEXT_PUBLIC_SPOTPLAYER_URL;

  if (src && videoId) {
    const url = `${src}${
      src.includes("?") ? "&" : "?"
    }id=${encodeURIComponent(videoId)}`;

    return (
      <div className="relative aspect-video overflow-hidden rounded-[1.5rem] bg-black">
        <iframe
          ref={iframeRef}
          src={url}
          className="h-full w-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="SpotPlayer"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-[1.5rem] bg-[#211d1a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(183,139,114,.35),transparent_55%)]" />

      <div className="relative grid h-full place-items-center p-8 text-center">
        <div>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/20 bg-white/10">
            <PlayCircle className="h-8 w-8" />
          </div>

          <p className="mt-5 text-lg font-black">
            پخش‌کننده SpotPlayer آماده اتصال است
          </p>

          <p className="mt-2 text-sm leading-7 text-white/60">
            شناسه ویدئو: {videoId ?? "—"}
          </p>

          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white/75">
            <ShieldCheck className="h-4 w-4" />
            ویدئو فقط برای هنرجوی مجاز
          </p>
        </div>
      </div>
    </div>
  );
}
