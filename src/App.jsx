import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaDiceFive } from "react-icons/fa"; // Import dice icon

const App = () => {
  const [advice, setAdvice] = useState("Click the button to get advice!");
  const [adviceId, setAdviceId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.adviceslip.com/advice");
      console.log(response);
      setAdvice(response.data.slip.advice);
      setAdviceId(response.data.slip.id);
    } catch (error) {
      setAdvice("Failed to fetch advice. Try again!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E293B] text-white px-4">
      <div className="bg-[#2C3E50] p-6 rounded-xl shadow-lg text-center max-w-md w-full relative">
        <p className="text-green-400 text-sm tracking-wider">ADVICE #{adviceId}</p>
        <h1 className="text-xl font-bold my-4">"{loading ? "Loading..." : advice}"</h1>
        <div className="w-full h-px bg-gray-500 my-4"></div>
        <button
          onClick={fetchAdvice}
          className="bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-400 transition absolute -bottom-6 left-1/2 transform -translate-x-1/2"
          disabled={loading}
        >
          <FaDiceFive size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;
