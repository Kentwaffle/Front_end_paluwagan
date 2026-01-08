import React from "react";
import PaluwaganMain from "../LandingPage/paluwaganMain";
import { Link } from "react-router-dom";
import Error_image from "../assets/images/404_image_removeBg.png";
import PaluwaganLogo from "../assets/images/mainLogoPaluwagan.jpg";

function Eror404() {
  return (
    <div className="w-screen p-5 pt-20 flex flex-col gap-3 items-center justify-center">
      <div
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
        style={{
          backgroundImage: `url(${PaluwaganLogo})`,
          backgroundSize: "40%",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          opacity: "0.05",
        }}
      ></div>
      <div>
        <img
          src={Error_image}
          alt="Error illustration"
          className="w-full max-w-xl h-auto mt-10"
        />
      </div>
      <h1 className="text-3xl font-extrabold text-neutral-700 ">
        Page not found
      </h1>
      <p className="text-lg flex flex-col text-sky-300 text-center ">
        It seems this page has flown off track!
        <span>Let's get you back on track!</span>
      </p>
      <Link to="/" className="mt-2">
        <button className="btn btn-soft px-8 py-3 not-[]:text-neutral-700 bg-sky-300 font-semibold rounded-md shadow-sm hover:bg-sky-500 transition duration-300">
          Redirect to homepage
        </button>
      </Link>
    </div>
  );
}

export default Eror404;
