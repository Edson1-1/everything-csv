import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { CsvViewer } from './components/CsvViewer';
import { Footer } from './components/Footer';
import { Attributions } from './components/Attributions';
import csv_icon from './assets/csv_icon.png';
import { LuInfo } from "react-icons/lu";


function LandingPage() {

  return (
    <main className="flex-1">
    <div className="mx-auto pt-4">
      <div className="flex justify-between mb-2 cursor-pointer px-8">

        <div className="flex items-center gap-x-2 border-b border-gray-200 py-2 text-3xl font-bold">
          <img src={csv_icon} alt="CSV Icon" className="inline-block w-8 h-8" />
          Everything CSV
        </div> 

        <div className="flex items-center justify-between gap-x-2 text-xs text-gray-300">
          <LuInfo className="text-sm"/>
          Your data does not leave the browser
        </div>

      </div>
      <CsvViewer />
    </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-teal-900 text-white">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage />
            } 
          />
          <Route path="/attributions" element={<Attributions />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
