import {Box} from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import Recipes from './pages/Recipes';
import About from './pages/About';
import Navbar from './components/Navbar';

function App() {
  return (
    <Box minH="100vh">
          <Navbar />
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes" element={<Recipes />} /> 
              <Route path="/about" element={<About />} />
          </Routes>
    </Box>
  );
}
 

export default App;
