import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-third-bg py-8 text-white">
      <div className="container mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold">IslamHub</h1>
            <p className="text-sm mt-1">
              &copy; {new Date().getFullYear()} IslamHub. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
            <Link to="" className="text-sm md:text-base hover:underline">
              About Us
            </Link>
            <Link to="" className="text-sm md:text-base hover:underline">
              Contact
            </Link>
            <Link to="" className="text-sm md:text-base hover:underline">
              Privacy Policy
            </Link>
            <Link to="" className="text-sm md:text-base hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 border-t border-gray-700 pt-4">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">Follow us on:</p>
            <div className="flex space-x-4 mt-2">
              <Link to="" className="text-sm md:text-base hover:underline">
                Facebook
              </Link>
              <Link to="" className="text-sm md:text-base hover:underline">
                Twitter
              </Link>
              <Link to="" className="text-sm md:text-base hover:underline">
                Instagram
              </Link>
              <Link to="" className="text-sm md:text-base hover:underline">
                LinkedIn
              </Link>
            </div>
          </div>
          <div className="text-sm md:text-base">
            <p>
              Contact us:{" "}
              <Link to="" className="hover:underline">
                info@islamhub.com
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
