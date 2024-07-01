import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaUsers, FaVideo } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const Header = () => {
  const [user, setUser] = useState();
  const [userImage, setUserImage] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [clicked, setClicked] = useState(false);
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const handleClick = () => {
    setClicked(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const userCookie = Cookies.get("userData");

    if (userCookie) {
      const userDataObj = JSON.parse(userCookie);
      setUser(userDataObj);
      setUserId(userDataObj.user_id);
    }
  }, []);

  const id = localStorage.getItem("userId");

  useEffect(() => {
    getUserDetail();
  }, [id]);

  const getUserDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/user/${id}`
      );
      setUserImage(response.data.data.image);
      setName(response.data.data.name);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
    toast({
      title: "Logout berhasil",
      status: "success",
      position: "top",
      isClosable: true,
    });
  };

  const confirmLogout = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const isHome = location.pathname === "/";

  return (
    <>
      <header
        className={`fixed font-poppins bg-main-bg top-0 left-0 right-0 z-50 flex justify-between items-center py-4 md:py-4 px-5 md:px-10 text-black shadow-lg transition-colors duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="font-poppins text-[24px] text-third-bg">
          <div className="font-bold">IslamHub</div>
        </div>
        <div className="text-lg text-black hidden gap-12 font-semibold md:flex">
          <Link
            to={isHome ? "#home" : "/"}
            className="text-third-bg transition-all hover:scale-110 flex flex-col items-center justify-center"
            onClick={handleClick}
          >
            <h1>Home</h1>
            <span
              className={`h-1 rounded-full bg-third-bg transition-all ${
                location.pathname === "/" && clicked ? "w-full" : "w-0"
              }`}
            ></span>
          </Link>
          <Link
            to="/video"
            className="text-third-bg transition-all hover:scale-110 flex flex-col items-center justify-center"
            onClick={handleClick}
          >
            <h1>Video</h1>
            <span
              className={`h-1 rounded-full bg-third-bg transition-all ${
                location.pathname === "/video" && clicked ? "w-full" : "w-0"
              }`}
            ></span>
          </Link>
          <Link
            to="/community"
            className="text-third-bg transition-all hover:scale-110 flex flex-col items-center justify-center"
            onClick={handleClick}
          >
            <h1>Komunitas</h1>
            <span
              className={`h-1 rounded-full bg-third-bg transition-all ${
                location.pathname === "/community" && clicked ? "w-full" : "w-0"
              }`}
            ></span>
          </Link>
        </div>
        <div className="flex gap-16 items-center text-[24px]">
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2">
              {user && userImage !== null ? (
                <button onClick={toggleDropdown}>
                  <img
                    src={userImage}
                    alt="user image"
                    className="h-[50px] w-[50px] object-cover rounded-full bg-gray-200"
                  />
                </button>
              ) : (
                <button
                  onClick={toggleDropdown}
                  className="cursor-pointer p-3 bg-gray-200 rounded-full"
                >
                  <FaUser className="text-black" />
                </button>
              )}
            </div>
            {isOpen && (
              <div className="absolute top-full text-lg right-0 mt-2 bg-white border   rounded-xl shadow-xl">
                {user ? (
                  <div className="flex flex-col text-sm justify-center items-start">
                    <div className="px-8 py-3 block w-full text-left text-black ">
                      {user && name && (
                        <p className="text-black font-bold ">{name}</p>
                      )}
                    </div>
                    <Link
                      to={`/profile/${user.user_id}`}
                      className="px-8 py-3 block w-full text-left text-black "
                    >
                      Profile
                    </Link>
                    <button
                      onClick={confirmLogout}
                      className="px-8 py-3 block w-full text-left text-black "
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col text-lg ">
                    <Link
                      to="/login"
                      className="block w-full text-left px-8 py-2 text-black "
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal for logout confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Logout
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed z-50 md:hidden  bottom-0 left-0 right-0 bg-white shadow-xl p-3">
        <div className="flex  justify-between px-8 items-center text-black">
          <Link
            to={isHome ? "#home" : "/"}
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/" ? "opacity-100" : "opacity-50"
            }`}
          >
            <FaHome size={25} />
            <div className="text-sm">Home</div>
          </Link>

          <Link
            to="/video"
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/video" ? "opacity-100" : "opacity-50"
            }`}
          >
            <FaVideo size={25} />
            <div className="text-sm">Video</div>
          </Link>

          <Link
            to="/community"
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/community" ? "opacity-100" : "opacity-50"
            }`}
          >
            <FaUsers size={25} />
            <div className="text-sm">Komunitas</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
