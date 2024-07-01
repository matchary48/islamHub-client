import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import quranImg from "../../assets/quran.png";
import axios from "axios";
import { BsChevronDoubleDown } from "react-icons/bs";
import KajianHome from "./kajianHome";

const Home = () => {
  const [user, setUser] = useState();
  const location = useLocation();
  const [name, setName] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    const userCookie = Cookies.get("userData");

    if (userCookie) {
      const userDataObj = JSON.parse(userCookie);
      setUser(userDataObj);
      setUserId(userDataObj.user_id);
    }
  }, []);

  useEffect(() => {
    getUserDetail();
  }, [userId]);

  const getUserDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/user/${userId}`
      );
      setName(response.data.data.name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div id="home" className="flex flex-col ">
      <div className="min-h-screen flex flex-col md:flex-row bg-main-bg p-8 md:px-32 pt-28   items-center justify-between gap-5">
        <div className=" gap-6 md:gap-14 flex flex-col  justify-center items-center md:items-start text-center md:text-left">
          <div className="gap-4 flex flex-col">
            <div className="text-[20px] text-third-bg font-light flex md:justify-start justify-center items-center gap-3 ">
              Selamat datang{" "}
              <span className="font-bold">{user ? `${name}` : "sobat"}</span>
            </div>
            <div className="text-[32px] md:text-[48px] font-semibold flex flex-col text-black">
              <span>
                Mari Belajar{" "}
                <span className="rounded-xl p-2 bg-third-bg font-bold text-main-bg text-border border-[1px]">
                  Agama
                </span>
                ,
              </span>
              <span>Insyaallah Berkah</span>
              <span>di Setiap Langkah</span>
            </div>
            <div className="flex flex-col font-light text-[20px] md:text-[18px]">
              <span>
                Temukan keberkahan dalam setiap langkah perjalanan spiritual
                anda
              </span>
              {user ? (
                <span>Ayo jelajahi sekarang!</span>
              ) : (
                <span>Ayo bergabung sekarang!</span>
              )}
            </div>
            {user ? (
              <div className="flex items-start md:justify-start justify-center">
                <Link
                  to="#kajian"
                  className="flex flex-col gap-2 pt-8 items-center justify-start md:justify-center font-bold "
                >
                  <div className="flex p-4 border-[2px]  bg-third-bg text-white rounded-full shadow-xl">
                    Lihat Informasi Kajian Terbaru
                  </div>
                  <div className="flex items-center">
                    <BsChevronDoubleDown size={20} />
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex gap-4 md:gap-9 pt-8  items-center font-bold md:justify-start justify-center flex-row">
                <Link
                  className="bg-third-bg text-white rounded-xl px-10 py-3"
                  to="/register"
                >
                  Daftar
                </Link>
                <Link
                  className="bg-transparent border-third-bg border-[2px] text-third-bg rounded-xl px-10 py-3"
                  to="/login"
                >
                  Masuk
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <img
            className="w-60 h-60 md:w-96 md:h-96"
            src={quranImg}
            alt="IslamHub Logo"
          />
        </div>
      </div>
      <div>{user ? <KajianHome id="kajian" /> : null}</div>
    </div>
  );
};

export default Home;
