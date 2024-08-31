import React, { useState } from 'react';

import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import Filter from './components/Filter/Filter';
import Search from './components/Search/Search';

const App = () => {
  
  const [currentSelection, setCurrentSelection] = useState('flights');

  const handleSelectionChange = (selection) => {
    setCurrentSelection(selection);
  };

  return (
    <div className="app-container">
      <Navbar onSelectionChange={handleSelectionChange} />
      {currentSelection === 'flights' && <Filter />}
      {currentSelection === 'airports' && <Search />}
      {/* <Footer /> */}
    </div>
  );
};

export default App;
