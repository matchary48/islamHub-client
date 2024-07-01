import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import quranImg from "../../assets/quran.png";
import { useToast } from "@chakra-ui/react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState();
  const toast = useToast();

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        {
          email,
          name,
          password,
        }
      );
      if (response.data.status_code === 200) {
        navigate("/login");

        toast({
          title: "Register berhasil",
          status: "success",
          position: "top",
          isClosable: true,
        });
      } else {
        console.log("login gagal");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        console.log("No response received from server:", error.request);
      } else {
        console.log("Request error:", error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-main-gradient flex flex-col md:flex-row items-center justify-center md:justify-between md:p-8 md:px-32 gap-5">
      <div className="font-poppins gap-2 md:gap-14 flex flex-col items-center md:items-start text-center md:text-left p-2">
        <div className="font-bold text-[24px]">IslamHub</div>
        <div className=" border-third-bg border-2  w-full md:h-auto md:w-[556px] flex flex-col justify-center p-10 rounded-xl md:shadow-lg gap-10">
          {error && <p className="text-red-500">{error}</p>}
          <div className=" flex flex-col gap-2 ">
            <div>
              <label htmlFor="" className="font-bold ">
                Masukkan Nama
              </label>
              <input
                type="text"
                className="border-[1px] border-third-bg bg-transparent rounded-xl p-4 mb-4 w-full mt-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="" className="font-bold">
                Email
              </label>
              <input
                type="email"
                className="border-[1px] border-third-bg bg-transparent rounded-xl p-4 mb-4 w-full mt-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="" className="font-bold">
                Password
              </label>
              <input
                type="password"
                className="border-[1px] border-third-bg bg-transparent rounded-xl p-4 mb-4 w-full mt-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex md:flex-row md:items-start flex-col items-center justify-between">
              <div className="text-black ">
                Sudah punya akun?{" "}
                <Link className="text-third-bg underline" to="/login">
                  Masuk
                </Link>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleRegister}
                  className="bg-third-bg text-white font-bold px-4 py-2 w-[192px] h-[60px] rounded-xl transition-colors duration-300"
                >
                  Daftar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden justify-center md:flex md:justify-end">
        <img
          className="w-60 h-60 md:w-96 md:h-96"
          src={quranImg}
          alt="IslamHub Logo"
        />
      </div>
    </div>
  );
};

export default Register;
