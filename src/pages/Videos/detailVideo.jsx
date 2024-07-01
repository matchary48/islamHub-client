import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaUser } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";
import { storage } from "../../firebase";
import { ref, deleteObject } from "firebase/storage";
import Cookies from "js-cookie";
import CommentSection from "../../components/atoms/commentSection/commentSection";
import { useToast } from "@chakra-ui/react";
import VideoList from "./videoList";

const DetailVideo = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [userVideoId, setUserVideoId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState();
  const [name, setName] = useState();
  const toast = useToast();

  useEffect(() => {
    const userCookie = Cookies.get("userData");
    if (userCookie) {
      const userDataObj = JSON.parse(userCookie);
      setUser(userDataObj);
    }
  }, []);

  useEffect(() => {
    const fetchVideoById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/video/${id}`
        );
        const videoData = response.data.data;
        setVideo(videoData.video);
        setUserVideoId(videoData.user_video_id);
        setTitle(videoData.title);
        setDescription(videoData.description);
        setCreatedAt(videoData.createdAt);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
    fetchVideoById();
  }, [id]);

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/${userVideoId}`
        );
        const userData = response.data.data;
        setName(userData.name);
        setImage(userData.image);
      } catch (error) {
        console.log(error);
      }
    };
    if (userVideoId) {
      getUserDetail();
    }
  }, [userVideoId]);

  const handleDelete = async () => {
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const videoRef = ref(storage, video);
      await deleteObject(videoRef);
      const response = await axios.delete(
        `http://localhost:3000/api/v1/video/${id}`
      );
      if (response.status === 200) {
        navigate("/video");
        toast({
          title: "Delete video berhasil",
          status: "success",
          position: "top",
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("Request error:", error.message);
    } finally {
      setShowModal(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen pt-[70px] md:pt-[100px] mb-20 bg-main-gradient flex flex-col md:p-2">
      <div className="md:px-8 px-0 py-4 flex flex-col gap-3">
        <div className="flex  md:flex-row flex-col gap-2 justify-evenly">
          <div className="w-full md:w-[823px] h-full">
            {video ? (
              <video
                key={video}
                className="w-full md:w-[823px] h-full md:h-[463px] object-fill rounded border-gray-400 shadow-md border-[2px]"
                controls
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>Loading video...</p>
            )}
            <div className="md:px-0 px-4">
              <div>
                <div className="md:text-3xl text-2xl font-bold">{title}</div>
                <div>
                  {createdAt ? (
                    <p>{formatDistanceToNow(parseISO(createdAt))} ago</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="text-md">
                {showFullDescription
                  ? description
                  : description.length > 50
                  ? `${description.slice(0, 20)}...`
                  : description}
                {description.length > 50 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-500 ml-2 "
                  >
                    {showFullDescription
                      ? "tampilkan lebih sedikit"
                      : "Lainnya"}
                  </button>
                )}
              </div>
              <Link
                to={`/profile/${userVideoId}`}
                className="flex gap-3 mb-3 items-center py-2 w-full"
              >
                <div className="flex gap-5 mb-3 rounded-full w-full p-2 bg-main-bg items-center">
                  <div className="rounded-full border-black border-[1px]">
                    {image ? (
                      <img
                        src={image}
                        alt="user image"
                        className="rounded-full w-[50px] h-[50px] object-cover"
                      />
                    ) : (
                      <FaUser className="text-black rounded-full w-[50px] h-[50px] object-cover" />
                    )}
                  </div>
                  <div className="text-lg font-bold">{name}</div>
                </div>
              </Link>
              <div className="pb-10">
                <CommentSection />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-96 bg-main-bg">
            <VideoList />
          </div>
        </div>
      </div>
      {(user && user.user_id !== userVideoId) || !user ? null : (
        <div className="flex justify-center items-center gap-4 p-4">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300 flex gap-2 items-center"
          >
            <FaTrash />
            Delete
          </button>
          {/* <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300 flex gap-2 items-center">
            <FaEdit />
            Update
          </button> */}
        </div>
      )}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>Are you sure you want to delete this video?</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600 transition-colors duration-300"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailVideo;
