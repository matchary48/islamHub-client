import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Cookies from "js-cookie";
import CommunityList from "./communityList";
import { useToast } from "@chakra-ui/react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";

const Chat = () => {
  const [communities, setCommunities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [user_id, setUser_id] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const toast = useToast();

  useEffect(() => {
    const userCookie = Cookies.get("userData");

    if (userCookie) {
      const userDataObj = JSON.parse(userCookie);
      setUser_id(userDataObj.user_id);
      setName(userDataObj.name);
    }
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, [currentPage]);

  const fetchCommunities = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/community?page=${currentPage}&perPage=12`
      );
      const data = response.data.data;
      setCommunities(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/community",
        {
          user_id,
          title,
          name,
          image: imageUrl,
        }
      );
      if (response.data.status_code === 200) {
        toast({
          title:
            "Create Komunitas berhasil, refresh untuk menampilkan komunitas",
          status: "success",
          position: "top",
          isClosable: true,
        });
        setShowModal(false);
      } else {
        console.log("create community failed");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        console.log("No response received from server:", error.request);
      } else {
        console.log("Request error:", error.message);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setError("No file selected");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));

    const validExtensions = ["image/jpg", "image/jpeg", "image/png"];

    if (!validExtensions.includes(file.type)) {
      setError(
        "Invalid file type. Please select a valid image file (JPG, JPEG, PNG)."
      );
      return;
    }

    setError("");

    const imageRef = ref(storage, `images/community/${file.name + v4()}`);
    const uploadTask = uploadBytesResumable(imageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload image gagal:", error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);
        } catch (error) {
          console.error("Error getting download URL:", error);
        }
      }
    );
  };

  return (
    <div className="flex bg-main-gradient  gap-8 min-h-screen">
      <div className="z-40 fixed bg-white">
        <CommunityList />
      </div>
      <div className="pt-[100px] flex flex-col gap-4 justify-start items-center w-full">
        <div className=" text-2xl font-semibold">Silahkan Pilih Komunitas</div>
        <div>
          <FaArrowLeft size={30} />
        </div>
      </div>
      {user_id ? (
        <button
          onClick={handleShowModal}
          className="fixed bg-third-bg text-white transition-all shadow-xl p-6 rounded-full bottom-20 md:bottom-12 right-4"
        >
          <FaPlus />
        </button>
      ) : null}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 flex flex-col gap-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-center text-xl">
              <p>Buat Komunitas Baru</p>
            </div>
            {user_id ? (
              <div className="flex items-center justify-center flex-col gap-2">
                <div className="text-red-500">{error}</div>
                <input
                  type="text"
                  placeholder="Community Name"
                  className="border-2 border-gray-300 rounded p-4 mb-4 w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="mb-4 max-w-[150px]"
                  />
                )}
                {progress > 0 && progress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full">
                    <div
                      className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                      style={{ width: `${progress}%` }}
                    >
                      {progress.toFixed(2)}%
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  placeholder="Image"
                  className="border-2 border-gray-300 rounded p-3 w-full"
                  onChange={handleImageChange}
                />
                <div className="flex gap-4 justify-center mt-4">
                  <button
                    onClick={closeModal}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-700 transition-colors duration-300"
                  >
                    Create
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center gap-5 items-center">
                <div>
                  <h4>Login untuk membuat komunitas</h4>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={closeModal}
                    className="bg-red-600 px-3 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <Link
                    to="/login"
                    className="bg-third-bg text-white px-3 py-2 rounded"
                  >
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
