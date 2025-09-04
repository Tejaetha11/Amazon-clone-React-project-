import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages";
import {LoginPage} from "../pages";
import {SignupPage} from "../pages";

export const AllRoutes = () => {
  return (
    <main>
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/signup" element={<SignupPage/>} />
    </Routes>
    </main>
  );
}
 