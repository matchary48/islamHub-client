import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/atoms/backButton/backButton";

const DetailKajianUser = () => {
  const { id } = useParams();
  const [image, setImage] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [date, setDate] = useState();
  const [lokasi, setLokasi] = useState();
  const [time, setTime] = useState();

  useEffect(() => {
    fetchKajian();
  }, []);
  const fetchKajian = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/kajian/${id}`
      );
      const kajianData = response.data.data;
      setImage(kajianData.image);
      setTitle(kajianData.title);
      setDescription(kajianData.description);
      setDate(kajianData.date);
      setTime(kajianData.time);
      setLokasi(kajianData.lokasi);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="flex flex-col p-2">
        <div className="flex px-4">
          <BackButton path="/kajian" />
        </div>
        <div className="px-4">
          <img
            className="h-[420px] w-full object-cover border-[1px] border-black rounded"
            src={image}
            alt="kajian image"
          />
          <h1 className="md:text-3xl text-xl font-bold">{title}</h1>
          <div className="flex gap-3 mb-3 items-center py-2 w-max">
            <div className="flex gap-3 mb-3 items-center">
              <p>
                {date}, {time} WIB
              </p>
              <p>-</p>
              <p>{lokasi}</p>
            </div>
          </div>{" "}
          <p className="text-md">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailKajianUser;
