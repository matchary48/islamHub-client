import { Link } from "react-router-dom";
import { KajianCarousel } from "../Kajian/kajianCarousel";

const KajianHome = (id) => {
  return (
    <div
      id={id}
      className="min-h-screen font-poppins bg-third-bg w-full flex pt-12 md:pt-8 flex-col gap-8 p-8 md:px-32 font-semibold"
    >
      <div className="flex flex-col md:flex-row md:justify-between justify-center  items-center text-white  md:pt-20 pt-10 ">
        <div className="text-4xl w-full">Informasi Kajian Terbaru</div>
        <div className="flex justify-end w-full">
          <Link
            to="/kajian"
            className="md:px-4 px-2 md:py-2 py-1 bg-white rounded-full text-black text-sm"
          >
            Lihat Semua
          </Link>
        </div>
      </div>
      <KajianCarousel />
    </div>
  );
};

export default KajianHome;
