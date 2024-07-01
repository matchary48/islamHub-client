import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../components/molecules/Pagination/pagination";
import { FaUser } from "react-icons/fa";
import { formatDistanceToNow, parseISO } from "date-fns";

const Video = () => {
  const [videoData, setVideoData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const videoRefs = useRef([]);

  useEffect(() => {
    fetchVideos();
  }, [currentPage]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/video?page=${currentPage}&perPage=12`
      );
      setVideoData(response.data.data);
      setTotalPages(response.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };

  const search = async (q) => {
    try {
      if (q.length > 0) {
        const response = await axios.get(
          `http://localhost:3000/api/v1/video/search`,
          {
            params: {
              query: q,
            },
          }
        );
        setVideoData(response.data.data);
        setTotalPages(1);
      } else if (q.length === 0) {
        fetchVideos();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
              className="cursor-pointer  p-4 flex flex-col items-start rounded-xl max-h-auto hover:bg-main-bg transition-all"
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="h-[200px] w-full object-cover rounded-xl "
                controls
                onPlay={() => handlePlay(index)}
              >
                <source src={video.video} type="video/mp4" /> Your browser does
                not support the video tag.
              </video>
              <hr className="mt-3" />

              <div className="flex gap-2 items-start justify-start">
                <div className="rounded-full  border-black border-[1px]">
                  {video.user_image !== null ? (
                    <img
                      src={video.user_image}
                      alt="user image"
                      className="rounded-full w-[50px] h-[50px] object-cover "
                    />
                  ) : (
                    <FaUser className="text-black rounded-full w-[50px] h-[50px] object-cover" />
                  )}
                </div>
                <div className="">
                  <div>
                    <h1 className="text-2xl uppercase ">
                      {video.title.length > 25
                        ? `${video.title.substring(0, 25)}...`
                        : video.title}
                    </h1>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Link to={`/profile/${video.user_video_id}`}>
                      {video.name}
                    </Link>
                    <p>-</p>
                    <p>{formatDistanceToNow(parseISO(video.createdAt))} ago</p>
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
      <div className="px-4 py-20 flex pt-[100px]  flex-col gap-8 min-h-screen">
        <div className="border-[1px]  border-third-bg rounded-full text-black">
          <input
            type="text"
            placeholder="Cari video..."
            className="border-none py-4 pl-4 bg-main-bg w-full focus:outline-none  rounded-full"
            onChange={({ target }) => search(target.value)}
          />
        </div>
        <div>
          {Array.isArray(videoData) && videoData.length > 0 ? (
            <VideoList />
          ) : (
            <div className="min-h-screen flex justify-center">
              <h1>Video tidak ditemukan</h1>
            </div>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default Video;
