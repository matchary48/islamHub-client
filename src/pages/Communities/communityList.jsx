import axios from "axios";
import { useEffect, useState } from "react";
import { FaBars, FaTimes, FaUsers } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);

  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    const currentCommunityId = location.pathname.split("/")[2];
    setSelectedCommunityId(currentCommunityId);
  }, [location]);

  const fetchCommunities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/community"
      );
      setCommunities(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const search = async (q) => {
    try {
      if (q.length > 0) {
        const response = await axios.get(
          `http://localhost:3000/api/v1/community/search`,
          {
            params: {
              query: q,
            },
          }
        );
        setCommunities(response.data.data);
      } else if (q.length === 0) {
        fetchCommunities();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const KomunitasList = () => (
    <>
      {communities.map((community) => {
        const isSelected = community.community_id === selectedCommunityId;
        return (
          <Link
            to={`/community/${community.community_id}`}
            key={community._id}
            className={`flex p-3 gap-2 mt-2 rounded-xl transition-all ${
              isSelected ? "bg-white" : "hover:bg-white"
            }`}
            onClick={() => setSelectedCommunityId(community.community_id)}
          >
            {community && community.image !== null ? (
              <div>
                <img
                  src={community.image}
                  alt="user image"
                  className="h-[40px] w-[40px] object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="cursor-pointer h-[40px] w-[40px] flex items-center p-3 text-main-bg bg-third-bg rounded-full">
                <FaUsers size={50} className="text-main-bg" />
              </div>
            )}
            <div className="flex items-start">{community.title}</div>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="relative ">
      <div
        className={`overflow-y-auto min-h-screen pt-[80px] ${
          isSidebarOpen ? " w-[300px]  p-2" : "bg-white w-0 p-0 border-0"
        } relative transition-all duration-300`}
      >
        {isSidebarOpen && (
          <div className="flex flex-col gap-4">
            <div className=" flex flex-col ">
              <div className="py-3 pl-2 flex items-center justify-between">
                <Link to="/community" className="font-semibold text-xl">
                  Komunitas
                </Link>
                <div
                  onClick={toggleSidebar}
                  className="cursor-pointer flex items-center justify-start"
                >
                  <FaTimes size={20} />
                </div>
              </div>
              <div className=" rounded-full text-black">
                <input
                  type="text"
                  placeholder="Cari Komunitas..."
                  className="border-none py-3 pl-4 bg-main-bg w-full focus:outline-none  rounded-full"
                  onChange={({ target }) => search(target.value)}
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[500px] p-2 rounded-xl bg-main-bg px ">
              {Array.isArray(communities) && communities.length > 0 ? (
                <KomunitasList />
              ) : (
                <div className="min-h-screen flex justify-center">
                  <h1>Komunitas tidak ditemukan</h1>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="top-24 fixed left-0 bg-third-bg shadow-xl text-white p-4  rounded-r-full z-50 transition-all duration-300"
        >
          <FaBars />
        </button>
      )}
    </div>
  );
};

export default CommunityList;
