import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const DropdownMenu = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center">
        {user && user.name && <p className="mr-2">{user.name}</p>}
        {user ? (
          <button onClick={toggleDropdown}>
            {/* <img
              src={`http://localhost:3000/${user.image}`}
              alt="user image"
              className="h-[40px] w-[40px] object-cover rounded-full bg-gray-200"
            /> */}
          </button>
        ) : (
          <button
            onClick={toggleDropdown}
            className="cursor-pointer p-3 bg-gray-200 rounded-full"
          >
            <FaUser className="text-black " />
          </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute text-sm top-full left-0 mt-2 bg-white border border-gray-300 shadow-lg">
          {user ? (
            <div>
              <Link
                to={`/profile/${user.user_id}`}
                className="block w-full text-left py-2 px-4 text-gray-800 hover:bg-gray-200 rounded"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 text-gray-800 hover:bg-gray-200 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="block w-full text-left text-sm py-2 px-4 text-gray-800 hover:bg-gray-200 rounded"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
