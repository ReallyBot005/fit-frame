import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { PlanDetail } from './pages/PlanDetail';
import { LogWorkout } from './pages/LogWorkout';
import { Progress } from './pages/Progress';
import { Contact } from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan/:id" element={<PlanDetail />} />
          <Route path="/log" element={<LogWorkout />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
