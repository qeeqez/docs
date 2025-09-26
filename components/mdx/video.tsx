"use client";

import dynamic from "next/dynamic";
import type {HTMLProps} from "react";

const RixlVideo = dynamic(
  () => import("@rixl/videosdk-react")
    .then((mod) => mod.Video),
  {ssr: true})

declare type VideoTheme = "default" | "minimal" | "hideUI";

declare interface VideoProps extends HTMLProps<HTMLVideoElement> {
  id?: string;
  progressBar?: boolean;
  allowPlayPause?: boolean;
  allowFullscreen?: boolean;
  allowPictureInPicture?: boolean;
  volume?: number;
  theme?: VideoTheme;
}

export const Video = (props: VideoProps) => {
  return <div className="flex overflow-hidden w-full h-[500px] rounded-0.25 drop-shadow-xl max-w-fd-container">
    <RixlVideo {...props} />
  </div>;
};
