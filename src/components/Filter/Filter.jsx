import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

 // fetch all fight routes
 const fetchRoutes = async (filters = {}) => {
  try {
    // Construct the base URL
    const baseUrl = 'https://api.aviationapi.com/v1/preferred-routes';

    const queryParams = Object.keys(filters).length ? `?${new URLSearchParams(filters).toString()}` : '';
    const encodedUrl = encodeURIComponent(`${baseUrl}${queryParams}`);
    const { data } = await axios.get(`https://api.allorigins.win/get?url=${encodedUrl}`);
    const routes = JSON.parse(data.contents);


    const limitedRoutes = routes.slice(0, 50);
    // console.log('Fetched and Limited Routes:', limitedRoutes); 

    return limitedRoutes;
  } catch (error) {
    console.error('Error fetching routes:', error);
    return [];
  }
};



// fetching routes per specfified criteria
const fetchFilteredRoutes = async (filters) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const encodedUrl = encodeURIComponent(`https://api.aviationapi.com/v1/preferred-routes/search?${queryParams}`);
    const { data } = await axios.get(`https://api.allorigins.win/get?url=${encodedUrl}`);
    
    // Parse the data returned from the proxy
    const routes = JSON.parse(data.contents);
    return routes;
  } catch (error) {
    console.error('Error fetching filtered routes:', error);
    return [];
  }
};


const Filter = () => {


  // Fetch all routes
  const { data: routes, isLoading, isError, error } = useQuery({
    queryKey: ['routes'],
    queryFn: fetchRoutes,
    onSuccess: (data) => console.log('Query Success: Routes fetched', data),
    onError: (error) => console.error('Query Error:', error),
  });
  

  
  const [origin, setOrigin] = useState('All');
  const [destination, setDestination] = useState('All');
  const [altitude, setAltitude] = useState('All');
  const [filteredRoutes, setFilteredRoutes] = useState([]);



  useEffect(() => {

    const fetchFiltered = async () => {
      if (origin !== 'All' || destination !== 'All' || altitude !== 'All') {
        try {
          const allRoutes = await fetchFilteredRoutes({ origin, destination, altitude });
          const limitedFilteredRoutes = allRoutes.slice(0, 50); // Limit to 50 filtered items
          setFilteredRoutes(limitedFilteredRoutes);
        } catch (err) {
          console.error('Error fetching filtered routes:', err);
        }
      } else {
        setFilteredRoutes(routes ? routes.slice(0, 50) : []); // Limit to 50 items if no filter
      }
    };
  
    fetchFiltered();
  }, [origin, destination, altitude, routes]);
  

  // Function to get unique values for dropdowns
  const uniqueValues = (key) => {
    if (!routes) return [];
    const values = routes.map(route => route[key]);
    return ['All', ...new Set(values)];
  };

  
  //console.log('Routes:', routes);
  //console.log('Filtered Routes:', filteredRoutes);


  // Loading and error states shown while rendering 
  if (isLoading) return <p> Loading... Please wait...</p>;
  if (isError) return <p>Oops !! Error fetching data: {error.message}</p>;

  return (
    <div className="filter-container p-4">
  <div className="filter-dropdowns flex space-x-4"> 
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-gray-200 p-2 rounded">{origin}</DropdownMenuTrigger> 
      <DropdownMenuContent className="bg-white p-2 rounded shadow-md"> 
        {uniqueValues('origin').map(value => (
          <DropdownMenuItem
            key={value}
            onClick={() => setOrigin(value)}
            className="hover:bg-gray-100 p-2 cursor-pointer"
          >
            {value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

    <DropdownMenu>
      <DropdownMenuTrigger className="bg-gray-200 p-2 rounded">{destination}</DropdownMenuTrigger> 
      <DropdownMenuContent className="bg-white p-2 rounded shadow-md"> 
        {uniqueValues('destination').map(value => (
          <DropdownMenuItem
            key={value}
            onClick={() => setDestination(value)}
            className="hover:bg-gray-100 p-2 cursor-pointer"
          >
            {value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

    <DropdownMenu>
      <DropdownMenuTrigger className="bg-gray-200 p-2 rounded">{altitude}</DropdownMenuTrigger> 
      <DropdownMenuContent className="bg-white p-2 rounded shadow-md"> 
        {uniqueValues('altitude').map(value => (
          <DropdownMenuItem
            key={value}
            onClick={() => setAltitude(value)}
            className="hover:bg-gray-100 p-2 cursor-pointer"
          >
            {value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

    <button
      onClick={() => setFilteredRoutes(routes || [])}
      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
    >
      Search
    </button>
  </div>

  <div className="results mt-4">
    {filteredRoutes.length === 0 && !isLoading && !isError && <p>No results found.</p>}
    {filteredRoutes.map((route, index) => {
      // Unique key for each card
      const cardKey = `${route.origin}-${route.destination}-${route.altitude}-${index}`;
      return (
        <Card key={cardKey} className="result-card text-center m-4"> 
          <CardHeader>
            <CardTitle>{route.route}</CardTitle>
            <CardDescription>
              <p><strong>Origin:</strong> {route.origin}</p>
              <p><strong>Destination:</strong> {route.destination}</p>
              <p><strong>Altitude:</strong> {route.altitude}</p>
            </CardDescription>
          </CardHeader>
        </Card>
      );
    })}
  </div>
</div>

  );
};

export default Filter;
