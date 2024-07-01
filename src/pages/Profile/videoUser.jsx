import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import Cookies from "js-cookie";

const VideoUser = () => {
  const [videoData, setVideoData] = useState([]);
  const [user, setUser] = useState();
  const [name, setName] = useState();
  const [image, setImage] = useState();
  const { id } = useParams();
  const videoRefs = useRef([]);

  useEffect(() => {
    const userCookie = Cookies.get("userData");

    if (userCookie) {
      const userDataObj = JSON.parse(userCookie);
      setUser(userDataObj);
    }
  }, []);

  useEffect(() => {
    getUserDetail();
  }, [id]);

  const getUserDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/user/${id}`
      );
      setName(response.data.data.name);
      setImage(response.data.data.image);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVideoByUserId();
  }, []);

  const getVideoByUserId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/video/${id}/${id}`
      );
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

  const VideoList = () => (
    <>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-3 text-black justify-center">
        {videoData.map((video, index) => {
          return (
            <Link
              to={`/video/${video.video_id}`}
              key={index}
              className="cursor-pointer p-4  "
            >
              <div className="flex flex-col items-start rounded-xl max-h-auto hover:bg-main-bg transition-all">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  className="h-[200px] w-full object-cover rounded-xl "
                  controls
                  onPlay={() => handlePlay(index)}
                >
                  <source src={video.video} type="video/mp4" /> Your browser
                  does not support the video tag.
                </video>
                <hr className="mt-3" />

                <div className="flex gap-2 items-start justify-start">
                  <div className="rounded-full  border-black border-[1px]">
                    {video.user_image !== null ? (
                      <img
                        src={video.user_image}
                        alt="user image"
                        className="rounded-full w-[40px] h-[40px] object-cover "
                      />
                    ) : (
                      <FaUser className="text-black rounded-full w-[50px] h-[50px] object-cover" />
                    )}
                  </div>
                  <div className="flex flex-col justify-start">
                    <h1 className="text-2xl font-bold overflow-hidden truncate w-[300px]">
                      {video.title.length > 25
                        ? `${video.title.substring(0, 25)}...`
                        : video.title}
                    </h1>
                    <div className="flex gap-2 items-center">
                      <Link
                        to={`/profile/${video.user_video_id}`}
                        className="text-[20px]"
                      >
                        {video.name}
                      </Link>
                      <p>-</p>
                      <p className="text-[18px]">
                        {formatDistanceToNow(parseISO(video.createdAt))} ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      <div className="">
        <div>
          {Array.isArray(videoData) && videoData.length > 0 ? (
            <VideoList />
          ) : (
            <div className="min-h-screen flex justify-center">
              <h1>Belum ada Video</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoUser;
