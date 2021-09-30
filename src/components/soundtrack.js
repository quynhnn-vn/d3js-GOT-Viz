import React from "react";
import "./soundtrack.scss";
import Sound from "react-sound";
import soundtrack from "../assets/soundtrack.mp3";
import { IoPlayCircleOutline, IoPauseCircleOutline } from "react-icons/io5";

export const Soundtrack = (handleLoading, handlePlaying, handleFinish) => {
  const [isPlaying, setIsPlaying] = React.useState(true);
  return (
    <div className="soundtrack">
      <Sound
        url={soundtrack}
        playStatus={isPlaying ? Sound.status.STOPPED : Sound.status.PLAYING}
        playFromPosition={300}
        volume={50}
        onLoading={handleLoading}
        onPlaying={handlePlaying}
        onFinishedPlaying={handleFinish}
      />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <IoPlayCircleOutline /> : <IoPauseCircleOutline />}
      </button>
    </div>
  );
};
