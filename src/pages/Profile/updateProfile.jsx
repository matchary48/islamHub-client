import axios from "axios";
import { useEffect, useState } from "react";
import { FaSave, FaUser } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/atoms/backButton/backButton";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";
import Cookies from "js-cookie";
import { useToast } from "@chakra-ui/react";

const UpdateProfile = () => {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState("");
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const userCookie = Cookies.get("userData");

    if (userCookie) {
      const userDataObj = JSON.parse(userCookie);
      setUser(userDataObj);
    }
  }, []);

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/${id}`
        );
        if (response.status === 200) {
          const userData = response.data.data;

          setName(userData.name);
          setUserId(userData.user_id);
          setImage(userData.image);
          setEmail(userData.email);
          setBio(userData.bio);
          if (userData.image !== null) {
            setImagePreview(userData.image);
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user by id:", error);
        setError("Failed to fetch user data");
      }
    };

    getUserById();
  }, [id]);

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

    const imageRef = ref(storage, `images/profile/${file.name + v4()}`);
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
        user_id: userId,
        name: name || "",
        email: email || "",
        bio: bio || "",
        image: imageUrl,
      };
      const response = await axios.put(
        `http://localhost:3000/api/v1/user/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const user = response.data.data;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);

        // Cek apakah userData sudah ada di cookies
        const existingUserData = getCookie("userData");
        let updatedUserData;

        if (existingUserData) {
          const parsedUserData = JSON.parse(existingUserData);
          updatedUserData = { ...parsedUserData, ...user };
        } else {
          updatedUserData = user;
        }

        document.cookie = `userData=${JSON.stringify(
          updatedUserData
        )}; expires=${expirationDate.toUTCString()}`;

        navigate(`/profile/${id}`);

        toast({
          title: "Update Profile Berhasil",
          status: "success",
          position: "top",
          isClosable: true,
        });
      } else {
        setError("Failed to update user data");
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

  function getCookie(name) {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  }

  return (
    <div className="flex items-center bg-main-gradient justify-center pt-[75px] ">
      <div className="min-h-screen w-full flex flex-col justify-center p-8 rounded shadow-lg gap-10">
        <div className="flex items-center justify-center flex-col gap-2">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="w-[250px] h-[250px] bg-white shadow-lg object-cover mt-3 border-black rounded-full"
            />
          ) : (
            <div className="relative w-[250px] h-[250px] shadow-lg object-cover mt-3 border-black rounded-full flex justify-center items-center">
              <FaUser size={150} className="absolute" />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {progress > 0 && progress < 100 && (
            <div className="w-full bg-gray-200 rounded-full">
              <div
                className="bg-third-bg text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${progress}%` }}
              >
                {progress.toFixed(2)}%
              </div>
            </div>
          )}
          <input
            type="file"
            placeholder="Image"
            className="border-2 border-third-bg rounded-xl p-4 mb-4 w-full"
            onChange={handleImageChange}
          />
          <input
            type="text"
            placeholder="Name"
            className="border-2 border-third-bg rounded-xl p-4 mb-4 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border-2 border-third-bg rounded-xl p-4 mb-4 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Bio"
            className="border-2 border-third-bg rounded-xl p-4 mb-4 w-full"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <div className="flex gap-4">
            <BackButton path={`/profile/${id}`} />
            <button
              onClick={handleUpdate}
              className="bg-third-bg text-white p-4 rounded-xl mb-4 flex justify-center items-center gap-2"
            >
              <FaSave />
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
