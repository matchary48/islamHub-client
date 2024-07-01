import { useEffect } from "react";
import SideBarAdmin from "../../../../components/atoms/sideBarAdmin/sideBarAdmin";
import axios from "axios";

const UserAdmin = () => {
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/user`);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex min-h-screen">
      <SideBarAdmin />
      <div>Total User Page</div>
    </div>
  );
};

export default UserAdmin;
