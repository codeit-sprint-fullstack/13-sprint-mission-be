import { Routes, Route } from "react-router-dom";

import Gnb from "./components/Gnb";
import LandingPage from "./pages/LandingPage";
import ItemsPage from "./pages/ItemsPage";
import RegistrationPage from "./pages/RegistrationPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";

export default function App() {
  return (
    <>
      <Gnb />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/community" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
      </Routes>
    </>
  );
}
