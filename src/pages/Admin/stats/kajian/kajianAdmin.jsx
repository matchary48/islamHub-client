import { FaPlus } from "react-icons/fa";
import SideBarAdmin from "../../../../components/atoms/sideBarAdmin/sideBarAdmin";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../../../components/molecules/Pagination/pagination";

const KajianAdmin = () => {
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

  const KajianList = () => (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      {kajian.map((kajianItem, index) => (
        <div
          key={index}
          className="flex justify-center w-full h-60 bg-main-bg shadow-xl"
        >
          <div className="w-1/2 h-full">
            <img
              src={kajianItem.image}
              alt="Kajian"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col w-1/2 px-4 justify-evenly">
            <div>
              <h1 className="text-black font-bold text-xl">
                {kajianItem.title.length > 20
                  ? kajianItem.title.slice(0, 20) + "..."
                  : kajianItem.title}
              </h1>
              <p className="text-black text-sm">
                {kajianItem.date}, {kajianItem.time} WIB - {kajianItem.lokasi}
              </p>
            </div>
            <div>
              <p className="text-black">
                {kajianItem.description.length > 100
                  ? kajianItem.description.slice(0, 100) + "..."
                  : kajianItem.description}
              </p>
            </div>
            <div>
              <Link
                to={`/admin/dashboard/kajian/detail-kajian/${kajianItem.kajian_id}`}
                className="border-2 border-black p-2 rounded-full text-sm"
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
    <div className="flex flex-col min-h-screen">
      <SideBarAdmin />
      <div className="flex flex-col px-12 py-8 w-full gap-4">
        <div className="text-4xl font-bold mb-4">
          <h1>LIST KAJIAN</h1>
        </div>
        <div className="flex justify-end mb-4">
          <Link to="/admin/dashboard/kajian/create-kajian">
            <button className="flex items-center gap-2 bg-third-bg p-3 text-white rounded-xl">
              <FaPlus />
              Tambah Kajian
            </button>
          </Link>
        </div>
        {Array.isArray(kajian) && kajian.length > 0 ? (
          <KajianList />
        ) : (
          <div className="min-h-screen flex justify-center">
            <h1>Tidak ada Kajian</h1>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default KajianAdmin;
