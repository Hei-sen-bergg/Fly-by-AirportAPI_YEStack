const Navbar = ({ onSelectionChange }) => (
  <nav className="bg-gray-800 p-4 flex justify-between items-center">
    <div className="text-white font-bold text-xl"><h1>Fly-by</h1></div>
    <div className="space-x-8">
      <button onClick={() => onSelectionChange('flights')} className="text-white">
        Search Flights
      </button>
      <button onClick={() => onSelectionChange('airports')} className="text-white">
        Search Airports
      </button>
    </div>
  </nav>
);

export default Navbar;
