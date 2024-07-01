import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const backButton = ({ path }) => {
  return (
    <>
      <Link
        to={path}
        className=" p-2 rounded-xl mb-4 flex justify-center items-center gap-2 "
      >
        <FaArrowLeft size={30} />
      </Link>
    </>
  );
};

export default backButton;
