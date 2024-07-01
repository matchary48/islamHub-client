import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowRight, FaTrash } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const CommentSection = () => {
  const [comment, setComment] = useState("");
  const [user_id, setUser_id] = useState("");
  const [user, setUser] = useState("");
  const [video_id, setVideo_id] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [dataComment, setDataComment] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [idCommentToDelete, setIdCommentToDelete] = useState();

  useEffect(() => {
    const userCookie = Cookies.get("userData");

    if (userCookie) {
      const userDataObj = JSON.parse(userCookie);
      setUser(userDataObj);
      setUser_id(userDataObj.user_id);
      setName(userDataObj.name);
    }
  }, []);

  const { id } = useParams();

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/comment",
        {
          user_id,
          video_id,
          comment,
          name,
        }
      );

      if (response.data.status_code === 200) {
        window.location.reload();
      } else {
        console.log("create comment gagal");
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        console.log("No response received from server:", error.request);
      } else {
        console.log("Request error:", error.message);
      }
    }
  };

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/comment/${id}`
        );
        setDataComment(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    setVideo_id(id);
    fetchComment();
  }, [id]);

  const handleDelete = async (commentId) => {
    setIdCommentToDelete(commentId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    console.log(idCommentToDelete);

    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/comment/${idCommentToDelete}`
      );
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log("Request error:", error);
    } finally {
      setShowModal(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="rounded-sm flex flex-col gap-3">
      <h3 className="text-2xl">Komentar</h3>
      <div className="py-2 flex flex-col h-[250px] overflow-y-auto border-2 rounded">
        {dataComment && dataComment.length > 0 ? (
          dataComment.map((comment, index) => (
            <div className="p-2" key={index}>
              <div className="p-4 bg-main-bg rounded-xl flex justify-between items-center">
                <div>
                  <h1 className="font-bold">{comment.name}</h1>
                  <p>{comment.comment}</p>
                </div>
                <div>
                  {user_id === comment.user_id ? (
                    <button onClick={() => handleDelete(comment.comment_id)}>
                      <FaTrash />
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center">
            <h1>Belum ada komentar</h1>
          </div>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {user ? (
        <div className="flex gap-3">
          <input
            type="text"
            className="w-full p-4 rounded-full bg-main-bg"
            placeholder="Comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className=" py-2 px-6 rounded-full" onClick={handleCreate}>
            <FaArrowRight size={40} />
          </button>
        </div>
      ) : (
        <div className="flex justify-center gap-5 items-center">
          <h4>You Should Login For Comment</h4>
          <Link to="/login" className=" px-3 py-2 rounded">
            Login
          </Link>
        </div>
      )}

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>Are you sure you want to delete this comment?</p>
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
  );
};

export default CommentSection;
