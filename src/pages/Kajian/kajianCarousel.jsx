import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import axios from "axios";

function Card( children ) {
  return <div className="shadow-xl rounded-lg p-4">{children}</div>;
}

function CardContent( children, className ) {
  return <div className={` ${className}`}>{children}</div>;
}

function Carousel( children, className ) {
  return (
    <div className={`relative overflow-hidden ${className}`}>{children}</div>
  );
}

function CarouselContent(children, style ) {
  return (
    <div
      className="flex transition-transform duration-700 ease-in-out "
      style={style}
    >
      {children}
    </div>
  );
}

function CarouselItem( children ) {
  return <div className="flex-shrink-0 w-full">{children}</div>;
}

function CarouselPrevious( onClick ) {
  return (
    <button onClick={onClick} className="text-main-bg">
      <BsArrowLeftCircle size={40} />
    </button>
  );
}

function CarouselNext( onClick ) {
  return (
    <button onClick={onClick} className="text-main-bg">
      <BsArrowRightCircle size={40} />
    </button>
  );
}

export function KajianCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [kajian, setKajian] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalSlides = kajian.length;

  useEffect(() => {
    fetchKajian();
  }, [currentPage]);

  const fetchKajian = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/kajian?page=${currentPage}&perPage=3`
      );
      const data = response.data.data;
      setKajian(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrevious = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [totalSlides]);

  return (
    <div className="flex flex-col items-center">
      <Carousel className="w-full ">
        <CarouselContent
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {kajian.map((kajianItem, index) => (
            <CarouselItem key={index}>
              <div className="">
                <Card>
                  <CardContent className="flex gap-10">
                    <div
                      key={index}
                      className="flex md:flex-row flex-col justify-start md:justify-center w-full h-[500px] md:h-[400px] bg-main-bg shadow-xl"
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
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div
        className={`flex justify-center gap-4 p-5 ${
          kajian.length > 1 ? "block" : "hidden"
        }`}
      >
        <CarouselPrevious onClick={handlePrevious} />
        <CarouselNext onClick={handleNext} />
      </div>
    </div>
  );
}
