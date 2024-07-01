import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "../../components/molecules/Header/Header";
import { useAuthContext } from "../context/useAuthContext";
import { useAdminAuthContext } from "../context/useAdminAuthContext";
import Login from "../../pages/Login/login";
import Register from "../../pages/Register/register";
import Home from "../../pages/Home/home";
import Profile from "../../pages/Profile/profile";
import UpdateProfile from "../../pages/Profile/updateProfile";
import ResetPassword from "../../pages/ResetPassword/resetPassword";
import Footer from "../../components/molecules/Footer/footer";
import DetailCommunity from "../../pages/Communities/detailCommunity";
import Chat from "../../pages/Communities/community";
import Video from "../../pages/Videos/video";
import DetailVideo from "../../pages/Videos/detailVideo";
import CreateVideo from "../../pages/Videos/createVideo";
import AdminDashboard from "../../pages/Admin/adminDashboard";
import AdminLogin from "../../pages/Admin/adminLogin";
import NotFound from "../../pages/notFound/notFound";
import KajianList from "../../pages/Kajian/kajianList";
import ChatAdmin from "../../pages/Admin/stats/chat/chatAdmin";
import KajianAdmin from "../../pages/Admin/stats/kajian/kajianAdmin";
import CreateKajian from "../../pages/Admin/stats/kajian/createKajian";
import DetailKajian from "../../pages/Admin/stats/kajian/detailKajian";
import UpdateKajian from "../../pages/Admin/stats/kajian/updateKajian";
import DetailKajianUser from "../../pages/Kajian/detailKajianUser";
import UserAdmin from "../../pages/Admin/stats/user/userAdmin";
import VideoAdmin from "../../pages/Admin/stats/video/videoAdmin";
import CommunityAdmin from "../../pages/Admin/stats/community/communityAdmin";

const RouteData = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/profile/:id",
    element: <Profile />,
  },
  {
    path: "/community",
    element: <Chat />,
  },
  {
    path: "/community/:id",
    element: <DetailCommunity />,
  },
  {
    path: "/video",
    element: <Video />,
  },
  {
    path: "/video/:id",
    element: <DetailVideo />,
  },
  {
    path: "/kajian",
    element: <KajianList />,
  },
];

const AdminRouteData = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/dashboard/user",
    element: <UserAdmin />,
  },
  {
    path: "/admin/dashboard/kajian",
    element: <KajianAdmin />,
  },
  {
    path: "/admin/dashboard/kajian/create-kajian",
    element: <CreateKajian />,
  },
  {
    path: "/admin/dashboard/kajian/detail-kajian/:id",
    element: <DetailKajian />,
  },
  {
    path: "/admin/dashboard/kajian/update-kajian/:id",
    element: <UpdateKajian />,
  },
  {
    path: "/admin/dashboard/video",
    element: <VideoAdmin />,
  },
  {
    path: "/admin/dashboard/community",
    element: <CommunityAdmin />,
  },
  {
    path: "/admin/dashboard/chat",
    element: <ChatAdmin />,
  },
];

const Routing = () => {
  const { token } = useAuthContext();
  const { adminToken, role } = useAdminAuthContext();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* User Authenticated Routes */}

        <Route
          path="/video/create"
          element={
            token ? (
              <>
                <Header />
                <CreateVideo />
                <Footer />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile/update/:id"
          element={
            token ? (
              <>
                <Header />
                <UpdateProfile />
                <Footer />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile/update/:id"
          element={
            token ? (
              <>
                <Header />
                <UpdateProfile />
                <Footer />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/kajian/detail-kajian/:id"
          element={
            token ? (
              <>
                <Header />
                <DetailKajianUser />
                <Footer />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/not-found" element={<NotFound />} />

        {/* Admin Authenticated Routes */}
        {AdminRouteData.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              adminToken && role === "admin" ? (
                <>{route.element}</>
              ) : (
                <Navigate to="/not-found" />
              )
            }
          />
        ))}

        {/* Public Routes */}
        {RouteData.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <>
                <Header />
                {route.element}
                <Footer />
              </>
            }
          />
        ))}
      </Routes>
    </Router>
  );
};

export default Routing;
