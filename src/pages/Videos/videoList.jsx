import axios from "axios";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

const VideoList = () => {
  const [videoData, setVideoData] = useState([]);
  const videoRefs = useRef([]);

  const { id } = useParams();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/video`);
      setVideoData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlay = (index) => {
    videoRefs.current.forEach((video, idx) => {
      if (index !== idx && video) {
        video.pause();
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="font-bold text-2xl px-4">Video Lainnya</div>
      <div className="flex flex-col w-full gap-2 text-black justify-center">
        {videoData
          .filter((video) => video.video_id !== id)
          .map((video, index) => (
            <Link
              to={`/video/${video.video_id}`}
              key={index}
              className="cursor-pointer p-2 flex gap-2 items-start rounded-xl max-h-auto transition-all"
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="h-[104px] w-[178px] object-cover rounded-xl"
                controls
                onPlay={() => handlePlay(index)}
              >
                <source src={video.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="flex gap-2 items-start justify-start">
                <div>
                  <div>
                    <h1 className="text-2xl font-semibold ">
                      {video.title.length > 20
                        ? `${video.title.substring(0, 20)}...`
                        : video.title}
                    </h1>
                  </div>
                  <div className="flex flex-col items-start">
                    <Link to={`/profile/${video.user_video_id}`}>
                      {video.name}
                    </Link>
                    <p className="text-sm">
                      {formatDistanceToNow(parseISO(video.createdAt))} ago
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default VideoList;
