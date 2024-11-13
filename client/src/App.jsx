import {Box} from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import Recipes from './pages/Recipes';
import About from './pages/About';
import RecipeDetail from './components/RecipeDetail';
// import RecipeForm from './components/RecipeForm';
import Navbar from './components/Navbar';

function App() {
  return (
    <Box minH="100vh">
          <Navbar />
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes" element={<Recipes />} /> 
              <Route path="/about" element={<About />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              {/* <Route path="/add-recipe" element={<RecipeForm />} />
              <Route path="/edit-recipe/:id" element={<RecipeForm />} /> */}
          </Routes>
    </Box>
  );
}
 

export default App;
