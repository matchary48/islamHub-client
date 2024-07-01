import { useNavigate, useParams } from "react-router-dom";
import SideBarAdmin from "../../../../components/atoms/sideBarAdmin/sideBarAdmin";
import BackButton from "../../../../components/atoms/backButton/backButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPen, FaTrash } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";

const DetailKajian = () => {
  const { id } = useParams();
  const [image, setImage] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [date, setDate] = useState();
  const [lokasi, setLokasi] = useState();
  const [time, setTime] = useState();
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    fetchKajian();
  }, []);
  const fetchKajian = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/kajian/${id}`
      );
      const kajianData = response.data.data;
      setImage(kajianData.image);
      setTitle(kajianData.title);
      setDescription(kajianData.description);
      setDate(kajianData.date);
      setTime(kajianData.time);
      setLokasi(kajianData.lokasi);
    } catch (error) {
      console.log(error);
    }
  };

  const curentDate = new Date();
  const day = curentDate.getDate();
  const dataDay = parseInt(date?.slice(8, 10));
  console.log(`kajian kurang ${dataDay - day} hari lagi `);

  const handleDelete = async () => {
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/kajian/${id}`
      );
      if (response.status === 200) {
        navigate("/admin/dashboard/kajian");
        toast({
          title: "Berhasil Hapus Kajian",
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
    <div className="min-h-screen">
      <div>
        <SideBarAdmin />
      </div>
      <div className="flex flex-col p-2">
        <div className="flex px-4">
          <BackButton path="/admin/dashboard/kajian" />
        </div>
        <div className="px-4">
          <img
            className="h-[420px] w-full object-cover border-[1px] border-black rounded"
            src={image}
            alt="blog image"
          />
          <h1 className="md:text-3xl text-xl font-bold">{title}</h1>
          <div className="flex gap-3 mb-3 items-center py-2 w-max">
            <div className="flex gap-3 mb-3 items-center">
              <p>
                {date}, {time} WIB
              </p>
              <p>-</p>
              <p>{lokasi}</p>
            </div>
          </div>{" "}
          <p className="text-md">{description}</p>
        </div>
        <div className="flex justify-center items-center gap-4 p-4">
          <Link
            to=""
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300 flex gap-2 items-center"
          >
            <FaTrash />
            Delete
          </Link>
          <Link
            to={`/admin/dashboard/kajian/update-kajian/${id}`}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300 flex gap-2 items-center"
          >
            <FaPen />
            Update
          </Link>
        </div>

        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p>Are you sure you want to delete this Kajian?</p>
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
    </div>
  );
};

export default DetailKajian;
