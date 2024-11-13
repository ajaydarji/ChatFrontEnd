import React from "react";
import Lottie from "lottie-react"; // Ensure you have lottie-react installed
import { animationDefaultOptions } from "@/lib/utils"; // Adjust the import path as necessary

function EmptyChatContainer() {
  return (
    <div className="flex-1 md:border-l-2 md:bg-zinc-800 md:flex flex-col justify-center items-center transition-all duration-1000">
      <Lottie
        animationData={animationDefaultOptions.animationData} // Accessing the animation data directly
        loop={animationDefaultOptions.loop} // Looping property
        autoplay={animationDefaultOptions.autoplay} // Autoplaying property
        height={200}
        width={200}
      />
      <div className="text-opacity-80 flex flex-col gap-5 items-center lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="poppins-semibold">
          Hi <span className="text-purple-500">!</span> Welcome to
          <span className="text-purple-500">Syncronus</span> Chat App
          <span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  );
}

export default EmptyChatContainer;
