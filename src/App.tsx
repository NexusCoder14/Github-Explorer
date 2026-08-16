import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { RepositoryPage } from "./pages/RepositoryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/repo/:owner/:name" element={<RepositoryPage />} />
    </Routes>
  );
}

export default App;
