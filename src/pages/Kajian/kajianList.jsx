import { Link } from "react-router-dom";
import BackButton from "../../components/atoms/backButton/backButton";
import { useEffect, useState } from "react";
import Pagination from "../../components/molecules/Pagination/pagination";
import axios from "axios";

const KajianList = () => {
  const [kajian, setKajian] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchKajian();
  }, [currentPage]);

  const fetchKajian = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/kajian?page=${currentPage}&perPage=12`
      );
      const data = response.data.data;

      setKajian(data);
      setTotalPages(response.data.total_page);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const search = async (q) => {
    try {
      if (q.length > 0) {
        const response = await axios.get(
          `http://localhost:3000/api/v1/kajian/search`,
          {
            params: {
              query: q,
            },
          }
        );
        setKajian(response.data.data);
        setTotalPages(1);
      } else if (q.length === 0) {
        fetchKajian();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const KajianList = () => (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      {kajian.map((kajianItem, index) => (
        <div
          key={index}
          className="flex md:flex-row flex-col justify-center w-full h-auto bg-main-bg shadow-xl"
        >
          <div className="w-full md:w-1/2 h-60 md:h-full p-2">
            <img
              src={kajianItem.image}
              alt="Kajian"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col w-full md:w-1/2 px-4 py-4 justify-evenly">
            <div>
              <h1 className="text-black font-bold text-xl">
                {kajianItem.title.length > 20
                  ? kajianItem.title.slice(0, 20) + "..."
                  : kajianItem.title}
              </h1>
              <p className="text-black text-sm">
                {kajianItem.date} - {kajianItem.lokasi}
              </p>
            </div>
            <div>
              <p className="text-black mt-2">
                {kajianItem.description.length > 100
                  ? kajianItem.description.slice(0, 100) + "..."
                  : kajianItem.description}
              </p>
            </div>
            <div className="mt-4 flex md:justify-start justify-center">
              <Link
                to={`/kajian/detail-kajian/${kajianItem.kajian_id}`}
                className="border-2 border-black p-2 rounded-full text-sm inline-block"
              >
                Lihat Selengkapnya
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="pt-[60px] px-5 min-h-screen">
      <div className="flex flex-col p-8 w-full gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row font-bold mb-4 md:w-2/3 items-center md:gap-4">
            <div className="flex items-center w-full justify-start">
              <BackButton path="/" />
            </div>
            <div className="flex  justify-end">
              <h1 className="md:text-4xl text-2xl whitespace-nowrap w-full justify-center">
                List Semua Kajian
              </h1>
            </div>
          </div>
          <div className="border-[1px]  border-third-bg rounded-full text-black">
            <input
              type="text"
              placeholder="Cari Kajian..."
              className="border-none py-4 pl-4 bg-main-bg w-full focus:outline-none  rounded-full"
              onChange={({ target }) => search(target.value)}
            />
          </div>
          <div>
            {Array.isArray(kajian) && kajian.length > 0 ? (
              <KajianList />
            ) : (
              <div className="min-h-screen flex justify-center">
                <h1>Kajian Tidak Ditemukan</h1>
              </div>
            )}
          </div>
        </div>

        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default KajianList;
