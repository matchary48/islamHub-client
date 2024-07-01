import { useNavigate, useParams } from "react-router-dom";
import CommunityList from "./communityList";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEllipsisV, FaTimes, FaUsers } from "react-icons/fa";
import ChatSection from "../../components/atoms/chatSection/chatSection";
import Cookies from "js-cookie";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";
import { useToast } from "@chakra-ui/react";

const DetailCommunity = () => {
  const [image, setImage] = useState();
  const [communityTitle, setCommunityTitle] = useState("");
  const [admin, setAdmin] = useState();
  const [adminId, setAdminId] = useState();
  const [user_id, setUser_id] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showDeteleModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState();
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [dataImage, setDataImage] = useState();
  const toast = useToast();

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const userCookie = Cookies.get("userData");

    if (userCookie) {
      const userDataObj = JSON.parse(userCookie);
      setUser_id(userDataObj.user_id);
      setName(userDataObj.name);
    }
  }, []);

  useEffect(() => {
    const fetchCommunityById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/community/${id}`
        );
        setCommunityTitle(response.data.data.title);
        setAdmin(response.data.data.name);
        setAdminId(response.data.data.user_id);
        setDataImage(response.data.data.image);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCommunityById();
  }, [id]);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleDeleteModal = () => {
    setShowDeleteModal(true);
    setShowModal(false);
  };

  const handleUpdatModal = () => {
    setShowUpdateModal(true);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
    setShowUpdateModal(false);
  };

  const confirmDelete = async () => {
    try {
      if (dataImage) {
        const imageRef = ref(storage, dataImage);
        if (imageRef.fullPath !== "") {
          await deleteObject(imageRef);
        }
      }

      const response = await axios.delete(
        `http://localhost:3000/api/v1/community/${id}`
      );

      if (response.status === 200) {
        navigate("/community");
        toast({
          title: "Delete Komunitas berhasil",
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

  const handleUpdate = async () => {
    try {
      const data = {
        title: communityTitle,
        name: name,
        user_id: user_id,
        image: imageUrl,
      };

      const response = await axios.put(
        `http://localhost:3000/api/v1/community/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status_code === 200) {
        window.location.reload();
        toast({
          title: "Update Komunitas berhasil",
          status: "success",
          position: "top",
          isClosable: true,
        });
      } else {
        console.log("Update community gagal");
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

  return (
    <div className="flex  min-h-screen">
      <div className="z-40 fixed bg-white">
        <CommunityList />
      </div>
      <div className="flex flex-col w-full pt-[85px]">
        <nav className="bg-third-bg h-16 w-full border-black border-[1px]">
          <div className="flex px-10 items-center justify-between">
            <div className="flex items-center pl-2">
              {dataImage !== null ? (
                <button>
                  <img
                    src={dataImage}
                    alt="user image"
                    className="h-[40px] w-[40px] object-cover rounded-full bg-gray-200"
                  />
                </button>
              ) : (
                <button className="cursor-pointer h-[40px] w-[40px] flex items-center p-3 bg-gray-200 rounded-full">
                  <FaUsers size={40} className="text-black" />
                </button>
              )}
              <div className="p-4 text-white">{communityTitle}</div>
            </div>
            {adminId === user_id ? (
              <button
                onClick={handleShowModal}
                className="flex items-center justify-between pr-4"
              >
                <FaEllipsisV className="text-white" />
              </button>
            ) : (
              ""
            )}
          </div>
        </nav>
        <ChatSection admin={admin} />
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white flex p-4  shadow-lg">
            <div className="p-10 flex  rounded-lg">
              <div className="flex items-center justify-center flex-col gap-2">
                <div className="flex gap-4 justify-center mt-4">
                  <button
                    onClick={handleUpdatModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDeleteModal}
                    className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-700 transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div>
              <button onClick={closeModal}>
                <FaTimes size={25} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeteleModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p>Are you sure want to delete this community?</p>
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

      {showUpdateModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 flex flex-col gap-2 rounded-lg shadow-lg">
            <div className="flex items-center justify-center">
              <p>Update Community</p>
            </div>
            <div className="flex items-center justify-center flex-col gap-2">
              <div className="text-red-500">{error}</div>
              <input
                type="text"
                placeholder="Community Name"
                className="border-2 border-gray-300 rounded p-4 mb-4 w-full"
                value={communityTitle}
                onChange={(e) => setCommunityTitle(e.target.value)}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="mb-4 max-w-[150px]"
                />
              )}
              {!imagePreview && (
                <img
                  src={dataImage}
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
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-3 py-2 rounded mr-2 hover:bg-green-700 transition-colors duration-300"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailCommunity;
