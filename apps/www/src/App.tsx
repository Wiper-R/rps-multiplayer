import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Game from "./pages/Game";
import Signup from "./pages/Signup";

// function App() {
//   const socket = useSocket();
//   useEffect(() => {
//     if (!socket) return;
//     socket.on("connect", () => {
//       console.log("Connected to server");
//     });
//
//     return () => {
//       socket.off("connect");
//     };
//   }, [socket]);
//   useEffect(() => {
//     async function fetchData() {
//       const res = await httpClient.get("/");
//       console.log(res.data);
//     }
//     fetchData();
//   }, []);
//   return (
//     <div>
//       <div className="text-4xl text-red-500">Hello World</div>
//     </div>
//   );
// }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      ;
    </BrowserRouter>
  );
}

export default App;
