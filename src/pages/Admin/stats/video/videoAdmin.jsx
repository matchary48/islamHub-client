import axios from "axios";
import SideBarAdmin from "../../../../components/atoms/sideBarAdmin/sideBarAdmin";
import { useEffect } from "react";

const VideoAdmin = () => {
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/video`);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <SideBarAdmin />
      <div>Video Page</div>
    </div>
  );
};

export default VideoAdmin;
