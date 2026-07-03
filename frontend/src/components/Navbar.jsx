import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {

  const [isOpen, setIsOpen] = useState(false);

  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (

    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-10">

      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-pink-600"
        >
          Lost & Found
        </Link>



        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 items-center">

          <Link
            to="/"
            className="hover:text-pink-600 font-medium"
          >
            Home
          </Link>


          {/* ✅ Chats button */}
          {authUser && (
            <Link
              to="/chats"
              className="hover:text-pink-600 font-medium"
            >
              Chats
            </Link>
          )}


          {!authUser ? (
            <>
              <Link
                to="/login"
                className="hover:text-pink-600 font-medium"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="hover:text-pink-600 font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:text-pink-600 font-medium"
            >
              Logout
            </button>
          )}

        </div>



        {/* Mobile icon */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

      </div>



      {/* Mobile menu */}
      {isOpen && (

        <div className="md:hidden bg-white w-full shadow-md flex flex-col text-center py-2 space-y-2">

          <Link
            to="/"
            className="py-1 hover:text-pink-600"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>


          {/* ✅ Chats mobile */}
          {authUser && (
            <Link
              to="/chats"
              className="py-1 hover:text-pink-600"
              onClick={() => setIsOpen(false)}
            >
              Chats
            </Link>
          )}


          {!authUser ? (
            <>
              <Link
                to="/login"
                className="py-1 hover:text-pink-600"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="py-1 hover:text-pink-600"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="py-1 hover:text-pink-600"
            >
              Logout
            </button>
          )}

        </div>

      )}

    </nav>

  );

}