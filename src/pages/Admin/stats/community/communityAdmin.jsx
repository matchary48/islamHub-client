import { useEffect } from "react";
import SideBarAdmin from "../../../../components/atoms/sideBarAdmin/sideBarAdmin";
import axios from "axios";

const CommunityAdmin = () => {
  useEffect(() => {
    fetchCommuities();
  }, []);

  const fetchCommuities = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/community`
      );
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex min-h-screen">
      <SideBarAdmin />
      <div>Community Page</div>
    </div>
  );
};

export default CommunityAdmin;
