import { useEffect, useState } from "react";
import { FaImage, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../../components/atoms/backButton/backButton";
import { storage } from "../../../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 } from "uuid";
import Cookies from "js-cookie";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const CreateKajian = () => {
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [userKajianId, setUserKajianId] = useState("");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const userCookie = Cookies.get("userData");

    if (userCookie) {
      const userDataObj = JSON.parse(userCookie);
      setUserKajianId(userDataObj.user_id);
    }
  }, []);

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

    const imageRef = ref(storage, `images/kajian/${file.name + v4()}`);
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
          setProgress(100);
        } catch (error) {
          console.error("Error getting download URL:", error);
        }
      }
    );
  };

  const handleCreate = async () => {
    if (progress < 100) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/v1/kajian", {
        title,
        description,
        user_kajian_id: userKajianId,
        image: imageUrl,
        date,
        lokasi,
        time
      });

      if (response.data.status_code === 200) {
        navigate("/admin/dashboard/kajian");
        toast({
          title: "Berhasil Upload Kajian",
          status: "success",
          position: "top",
          isClosable: true,
        });
      } else {
        console.log("Gagal membuat video");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Error lainnya:", error.message);
      }
    }
  };

  return (
    <div className="flex items-center bg-main-gradient justify-center pt-[75px] ">
      <div className="min-h-screen w-full flex flex-col justify-center p-8 rounded  gap-10">
        <div className="flex items-center justify-center flex-col gap-2">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="w-[450px] h-[250px]  mt-3 border-black object-cover "
            />
          ) : (
            <div className="relative w-full h-[250px]  object-cover mt-3 border-black rounded-full flex justify-center items-center">
              <FaImage size={150} className="absolute" />
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
            placeholder="Judul kajian"
            className="border-2 border-third-bg rounded-xl p-4 mb-4 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            name="description"
            className="border-2 border-third-bg rounded-xl p-4 mb-4 w-full"
            placeholder="Deskripsi Kajian"
            id=""
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <input
            type="date"
            placeholder="Tanggal kajian"
            className="border-2 border-third-bg rounded-xl p-4 mb-4 w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            placeholder="Tanggal kajian"
            className="border-2 border-third-bg rounded-xl p-4 mb-4 w-full"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <input
            type="lokasi"
            placeholder="Lokasi kajian"
            className="border-2 border-third-bg rounded-xl p-4 mb-4 w-full"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
          />

          <div className="flex gap-4">
            <BackButton path="/admin/dashboard/kajian" />
            <button
              onClick={handleCreate}
              disabled={progress < 100}
              className={`p-4 rounded-xl mb-4 flex justify-center items-center gap-2 text-white ${
                progress < 100
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-third-bg hover:bg-third-hover transition-colors duration-300"
              }`}
            >
              <FaSave />
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateKajian;
