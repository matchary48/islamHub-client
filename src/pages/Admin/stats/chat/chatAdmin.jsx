import { useEffect } from "react";
import SideBarAdmin from "../../../../components/atoms/sideBarAdmin/sideBarAdmin";
import axios from "axios";

const ChatAdmin = () => {
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/chat`);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex min-h-screen">
      <SideBarAdmin />
      <div>Chat Page</div>
    </div>
  );
};

export default ChatAdmin;
