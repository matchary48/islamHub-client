import { useEffect, useState } from "react";
import { FaBars, FaSignOutAlt, FaTimes, FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useToast } from "@chakra-ui/react";

const SideBarAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = (useState < any) | (null > null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    const userCookie = Cookies.get("userData");

    if (userCookie) {
      const userDataObj = JSON.parse(userCookie);
      setUser(userDataObj);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("userData");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    toast({
      title: "Logout berhasil",
      status: "success",
      position: "top",
      isClosable: true,
    });
    navigate("/admin/login");
  };

  const confirmLogout = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="fixed z-50 min-h-screen">
      <div
        className={`overflow-y-auto ${
          isSidebarOpen
            ? "bg-main-bg w-[300px] border-black border-[1px] p-2"
            : "bg-blue-200 w-0 p-0 border-0"
        } relative transition-all duration-300`}
      >
        {isSidebarOpen && (
          <>
            <div className="flex items-center justify-between p-4 bg-main-bg">
              <div
                onClick={toggleSidebar}
                className="cursor-pointer flex items-start justify-start"
              >
                <FaTimes size={20} />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="font-bold text-xl flex flex-col justify-center items-center gap-2 ">
                {user && user.image !== null ? (
                  <div>
                    <img
                      src={`http://localhost:3000/${user.image}`}
                      alt="profile picture"
                      className=" flex items-center justify-center w-[80px] h-[100px] bg-white shadow-lg object-cover mt-3 border-black rounded-full"
                    />
                  </div>
                ) : (
                  <div className="relative w-[100px] h-[100px] bg-white  shadow-lg object-cover mt-3 border-black rounded-full flex justify-center items-center">
                    <FaUser
                      size={50}
                      className="absolute md:relative w-[50px] h-[50px]"
                    />
                  </div>
                )}
                <div>{user && user.name}</div>
              </div>
              <div className="overflow-y-auto h-screen border-black border-t-2 ">
                <div className="grid grid-cols-3 md:grid-cols-1">
                  <Link
                    to="/admin/dashboard"
                    className={`flex p-3 rounded-xl transition-all mt-1 hover:bg-white ${
                      location.pathname === "/admin/dashboard" ? "bg-white" : ""
                    }`}
                  >
                    <h1>Dashboard</h1>
                  </Link>
                  <Link
                    to="/admin/dashboard/user"
                    className={`flex p-3 rounded-xl transition-all mt-1 hover:bg-white ${
                      location.pathname === "/admin/dashboard/user"
                        ? "bg-white"
                        : ""
                    }`}
                  >
                    <h1>User</h1>
                  </Link>
                  <Link
                    to="/admin/dashboard/community"
                    className={`flex p-3 rounded-xl transition-all mt-1 hover:bg-white ${
                      location.pathname === "/admin/dashboard/community"
                        ? "bg-white"
                        : ""
                    }`}
                  >
                    <h1>Komunitas</h1>
                  </Link>
                  <Link
                    to="/admin/dashboard/video"
                    className={`flex p-3 rounded-xl transition-all mt-1 hover:bg-white ${
                      location.pathname === "/admin/dashboard/video"
                        ? "bg-white"
                        : ""
                    }`}
                  >
                    <h1>Video</h1>
                  </Link>
                  <Link
                    to="/admin/dashboard/chat"
                    className={`flex p-3 rounded-xl transition-all mt-1 hover:bg-white ${
                      location.pathname === "/admin/dashboard/chat"
                        ? "bg-white"
                        : ""
                    }`}
                  >
                    <h1>Chat</h1>
                  </Link>
                  <Link
                    to="/admin/dashboard/kajian"
                    className={`flex p-3 rounded-xl transition-all mt-1 hover:bg-white ${
                      location.pathname === "/admin/dashboard/kajian"
                        ? "bg-white"
                        : ""
                    }`}
                  >
                    <h1>Kajian</h1>
                  </Link>
                </div>
                <button
                  onClick={confirmLogout}
                  className="w-full flex items-center justify-between px-4 py-2 mt-8 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  <span>Logout</span>
                  <FaSignOutAlt />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="top-20 fixed left-0 bg-third-bg text-white p-4  rounded-r-full z-50 transition-all duration-300"
        >
          <FaBars />
        </button>
      )}

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
    </div>
  );
};

export default SideBarAdmin;
