import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaUser } from "react-icons/fa";
import { BsGear } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import VideoUser from "./videoUser";

const Profile = () => {
  const [userId, setUserId] = useState();
  const [name, setName] = useState();
  const [image, setImage] = useState();
  const [bio, setBio] = useState();
  const [user, setUser] = useState();
  const { id } = useParams();

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
      setUserId(response.data.data.user_id);
      setName(response.data.data.name);
      setImage(response.data.data.image);
      setBio(response.data.data.bio);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-3 md:gap-16 bg-main-gradient pt-[100px]  pb-8  text-color-primary min-h-screen text-2xl font-poppins">
      <div className="flex justify-center px-8 md:px-32  md:justify-between items-start">
        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="flex justify-center">
            {image !== null ? (
              <img
                src={image}
                alt="profile picture"
                className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-main-bg shadow-xl object-cover mt-3 border-black rounded-full"
              />
            ) : (
              <div className="relative w-[200px] h-[200px] md:w-[250px] md:h-[250px] shadow-xl object-cover mt-3 border-black rounded-full flex justify-center items-center">
                <FaUser
                  size={100}
                  className="absolute md:relative md:w-[150px] md:h-[150px]"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col md:justify-between justify-center pt-8">
            <div className="flex flex-col gap-3 md:gap-8 justify-center md:items-start items-center">
              <h5 className="text-[40px] md:text-[60px] font-bold">{name}</h5>
              <p className="text-[20px] md:text-[25px]">
                {bio !== "" ? bio : "Belum ada bio."}
              </p>
            </div>
            <div className="md:py-6 py-3 flex flex-wrap gap-4">
              {(user && user.user_id !== userId) || !user ? (
                ""
              ) : (
                <div className="flex gap-5">
                  <Link
                    to={`/profile/update/${userId}`}
                    className="flex gap-4 items-center bg-main-bg text-color-dark font-bold py-3 px-2 md:px-4 text-lg rounded-xl shadow-xl"
                  >
                    <FaEdit />
                    Edit Profile
                  </Link>
                  <Link
                    to="/video/create"
                    className="flex gap-4 items-center bg-main-bg text-color-dark font-bold py-3 px-2 md:px-4 text-lg rounded-xl shadow-xl"
                  >
                    <FaPlus />
                    Buat Video
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="cursor-pointer mt-4 md:mt-0 hidden md:flex ">
          {/* <BsGear size={40} /> */}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="px-8 md:px-32 underline font-bold flex justify-center md:justify-start ml-0 md:ml-16 text-[20px] md:text-[25px]  ">
          Videos
        </div>
        <div>
          <VideoUser />
        </div>
      </div>
    </div>
  );
};

export default Profile;
