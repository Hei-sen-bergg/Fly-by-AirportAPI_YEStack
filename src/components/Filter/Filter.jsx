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


// const fetchRoutes = async () => {
//   try {
//     const url = 'https://api.aviationapi.com/v1/preferred-routes';

//     const response = await axios.get(url);

//     const routes = response.data;

//     const limitedRoutes = routes.slice(0, 50);

//     return limitedRoutes;
//   } catch (error) {
//     console.error('Error fetching routes:', error);
//     return [];
//   }
// };



// fetching routes per specfified criteria


const fetchFilteredRoutes = async (filters) => {
  try {
    const params = new URLSearchParams();

    if (filters.origin && filters.origin !== 'All') {
      params.append('origin', filters.origin);
    }
    if (filters.destination && filters.destination !== 'All') {
      params.append('dest', filters.destination);
    }
    if (filters.altitude && filters.altitude !== 'All') {
      params.append('alt', filters.altitude);
    }

    const apiUrl = `https://api.aviationapi.com/v1/preferred-routes/search?${params.toString()}`;
    console.log('Constructed API URL:', apiUrl); 
    
    const encodedUrl = encodeURIComponent(apiUrl);
    const { data } = await axios.get(`https://api.allorigins.win/get?url=${encodedUrl}`);
    
    const routes = JSON.parse(data.contents);
    console.log('Fetched Routes:', routes); 
    
    return routes;
  } catch (error) {
    console.error('Error fetching filtered routes:', error);
    return [];
  }
};



// const fetchFilteredRoutes = async (filters) => {
//   try {
//     const queryParams = new URLSearchParams(filters).toString();
//     const encodedUrl = encodeURIComponent(`https://api.aviationapi.com/v1/preferred-routes/search?${queryParams}`);
//     const { data } = await axios.get(`https://api.allorigins.win/get?url=${encodedUrl}`);
    
//     // Parse the data returned from the proxy
//     const routes = JSON.parse(data.contents);
//     return routes;
//   } catch (error) {
//     console.error('Error fetching filtered routes:', error);
//     return [];
//   }
// };


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
      console.log('Current filters:', { origin, destination, altitude });
      if (origin !== 'All' || destination !== 'All' || altitude !== 'All') {
        try {
          const allRoutes = await fetchFilteredRoutes({ origin, destination, altitude });
          console.log('Fetched filtered routes:', allRoutes);
          const limitedFilteredRoutes = allRoutes.slice(0, 50); // Limit to 50 filtered items
          setFilteredRoutes(limitedFilteredRoutes);
        } catch (err) {
          console.error('Error fetching filtered routes:', err);
        }
      } else {
        console.log('No filters applied, using all routes');
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
    <div className="filter-container p-4 flex flex-col items-center">
      <div className="filter-dropdowns flex space-x-4 items-center justify-center">
      <h1 style={{ fontSize: '1.5rem' }} className="text-center font-bold mt-6">Filter by :</h1>

        <div className="flex flex-col items-center">
      <label htmlFor="origin" className="mb-2">Origin</label>
      <DropdownMenu>
        <DropdownMenuTrigger id="origin" className="bg-gray-200 p-2 rounded text-center">{origin}</DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white p-2 rounded shadow-md">
          {uniqueValues('origin').map((value) => (
            <DropdownMenuItem
              key={value}
              onClick={() => setOrigin(value)}
              className="hover:bg-gray-100 p-2 cursor-pointer text-center"
            >
              {value}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {/* Destination Filter */}
    <div className="flex flex-col items-center">
      <label htmlFor="destination" className="mb-2 ">Destination</label>
      <DropdownMenu>
        <DropdownMenuTrigger id="destination" className="bg-gray-200 p-2 rounded text-center">{destination}</DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white p-2 rounded shadow-md">
          {uniqueValues('destination').map((value) => (
            <DropdownMenuItem
              key={value}
              onClick={() => setDestination(value)}
              className="hover:bg-gray-100 p-2 cursor-pointer text-center"
            >
              {value}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {/* Altitude Filter */}
    <div className="flex flex-col items-center">
      <label htmlFor="altitude" className="mb-2 ">Altitude</label>
      <DropdownMenu>
        <DropdownMenuTrigger id="altitude" className="bg-gray-200 p-2 rounded text-center">{altitude}</DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white p-2 rounded shadow-md">
          {uniqueValues('altitude').map((value) => (
            <DropdownMenuItem
              key={value}
              onClick={() => setAltitude(value)}
              className="hover:bg-gray-100 p-2 cursor-pointer text-center"
            >
              {value}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
      </div>

      <div className="results mt-4 flex flex-wrap justify-center">
        {filteredRoutes.length === 0 && !isLoading && !isError && <p>No results found.</p>}
        {filteredRoutes.map((route, index) => {
          const cardKey = `${route.origin}-${route.destination}-${route.altitude}-${index}`;
          return (
            <Card key={cardKey} className="result-card w-1/2 p-4 bg-white shadow-md rounded-md bg-opacity-85 text-center m-4">
              <CardHeader>
                <CardTitle>{route.route}</CardTitle>
                <CardDescription>
                  <p>
                    <strong>Origin:</strong> {route.origin}
                  </p>
                  <p>
                    <strong>Destination:</strong> {route.destination}
                  </p>
                  <p>
                    <strong>Altitude:</strong> {route.altitude}
                  </p>
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