"use client"

import {Video} from "@rixl/videosdk-react";

interface Props {
  id: string;
}

export const VideoMDX = ({id}: Props) => {
  return <Video
    id={id}
    className="w-fit h-fit bg-transparent" // Using w-fit and h-fit to respect video's aspect ratio
    muted={false}
    progressBar={true}
    loop={false}
    autoPlay={false}
    allowPlayPause={true}
    allowFullscreen={true}
    allowPictureInPicture={true}
    theme="default"
    volume={1.0}
  />;
};