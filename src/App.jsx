import React from "react";

import { FaDiceFive } from "react-icons/fa"; // Import dice icon
import { PuffLoader } from "react-spinners"; // Import the spinner

// import { useState, useEffect } from "react";
// import axios from "axios";
// // const App = () => {
//   const [advice, setAdvice] = useState("Click the button to get advice!");
//   const [adviceId, setAdviceId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchAdvice = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("https://api.adviceslip.com/advice");
//       setAdvice(response.data.slip.advice);
//       setAdviceId(response.data.slip.id);
//     } catch (error) {
//       console.error("Error fetching advice:", error);
//       setAdvice("Failed to fetch advice. Try again!");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchAdvice();
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E293B] text-white px-4">
//       <div className="bg-[#2C3E50] p-6 rounded-xl shadow-lg text-center max-w-md w-full relative">
//         <p className="text-green-400 text-sm tracking-wider">ADVICE #{adviceId}</p>
//         <h1 className="text-xl font-bold my-4 flex justify-center">
//         {loading ? <PuffLoader color="#22c55e" size={50} /> : `"${advice}"`}
//       </h1>        <div className="w-full h-px bg-gray-500 my-4"></div>
//         <button
//           onClick={fetchAdvice}
//           className="bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-400 transition absolute -bottom-6 left-1/2 transform -translate-x-1/2"
//           disabled={loading}
//         >
//           <FaDiceFive size={24} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default App;


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchAdvice = async () => {
  const response = await fetch("https://api.adviceslip.com/advice");
  if (!response.ok) throw new Error("Failed to fetch advice");
  return response.json();
};

const App = () => {
  const queryClient = useQueryClient();

  // Fetch initial advice
  const { data, isLoading, error } = useQuery({
    queryKey: ["advice"],
    queryFn: fetchAdvice,
    select: (data) => data.slip, // Extract slip object
    refetchOnWindowFocus: false, // Prevent auto-fetching on window focus
  });

  // Mutation for fetching new advice on button click
  const mutation = useMutation({
    mutationFn: fetchAdvice,
    onSuccess: () => {
      queryClient.invalidateQueries(["advice"]); // Forces refetch
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E293B] text-white px-4">
      <div className="bg-[#2C3E50] p-6 rounded-xl shadow-lg text-center max-w-md w-full relative">
        <p className="text-green-400 text-sm tracking-wider">
          ADVICE #{data?.id || "?"}
        </p>
        <h1 className="text-xl font-bold my-4 flex justify-center">
          {isLoading || mutation.isLoading ? (
            <PuffLoader color="#22c55e" size={50} />
          ) : error ? (
            "Failed to fetch advice. Try again!"
          ) : (
            `"${data?.advice}"`
          )}
        </h1>
        <div className="w-full h-px bg-gray-500 my-4"></div>
        <button
          onClick={() => mutation.mutate()}
          className="bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-400 transition absolute -bottom-6 left-1/2 transform -translate-x-1/2"
          disabled={mutation.isLoading}
        >
          <FaDiceFive size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;
