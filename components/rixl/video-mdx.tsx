"use client";

import {Video} from "@rixl/videosdk-react";

interface Props {
  id: string;
}

export const VideoMDX = ({id}: Props) => {
  return (
    <div className="flex overflow-hidden w-full h-full rounded-0.25 drop-shadow-xl max-w-fd-container">
      <Video
        id={id}
        // className="w-full h-fit"
        muted={false}
        progressBar={true}
        loop={false}
        autoPlay={false}
        allowPlayPause={true}
        allowFullscreen={true}
        allowPictureInPicture={true}
        theme="default"
        volume={1.0}
      />
    </div>
  );
};
