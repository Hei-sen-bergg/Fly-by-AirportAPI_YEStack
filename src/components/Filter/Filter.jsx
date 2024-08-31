import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


// Fetch all routes

const fetchRoutes = async () => {
  try {
    const baseUrl = "https://api.aviationapi.com/v1/preferred-routes";
    const { data } = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(baseUrl)}`);
    const routes = JSON.parse(data.contents);
    return routes; // Return all routes
  } catch (error) {
    console.error("Error fetching routes:", error);
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

    if (filters.origin && filters.origin !== "All") {
      params.append("origin", filters.origin);
    }
    if (filters.destination && filters.destination !== "All") {
      params.append("dest", filters.destination);
    }
    if (filters.altitude && filters.altitude !== "All") {
      params.append("alt", filters.altitude);
    }

    const apiUrl = `https://api.aviationapi.com/v1/preferred-routes/search?${params.toString()}`;
    console.log("Constructed API URL:", apiUrl);

    const encodedUrl = encodeURIComponent(apiUrl);
    const { data } = await axios.get(
      `https://api.allorigins.win/get?url=${encodedUrl}`
    );

    const routes = JSON.parse(data.contents);
    console.log("Fetched Routes:", routes);

    return routes;
  } catch (error) {
    console.error("Error fetching filtered routes:", error);
    return [];
  }
};


const Filter = () => {
  // Fetch all routes
  const {
    data: allRoutes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["routes"],
    queryFn: fetchRoutes,
    onSuccess: (data) => console.log("Query Success: Routes fetched", data),
    onError: (error) => console.error("Query Error:", error),
  });

  const [origin, setOrigin] = useState("All");
  const [destination, setDestination] = useState("All");
  const [altitude, setAltitude] = useState("All");
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const fetchFiltered = async () => {
      setIsFiltering(true); // Start the loading state
      console.log("Current filters:", { origin, destination, altitude });
  
      try {
        if (origin !== "All" || destination !== "All" || altitude !== "All") {
          const filteredRoutes = await fetchFilteredRoutes({ origin, destination, altitude });
          console.log("Fetched filtered routes:", filteredRoutes);
          setFilteredRoutes(filteredRoutes);
        } else {
          // Using only first 50 routes for display
          setFilteredRoutes(allRoutes ? allRoutes.slice(0, 50) : []);
        }
      } catch (err) {
        console.error("Error fetching filtered routes:", err);
      } finally {
        setIsFiltering(false); // Stop the loading state
      }
    };
  
    fetchFiltered();
  }, [origin, destination, altitude, allRoutes]);

  // Function to get unique values for dropdowns
  const uniqueValues = (key) => {
    if (!allRoutes) return [];
    const values = allRoutes.map((route) => route[key]);
    return ["All", ...new Set(values)];
  };

  if (isLoading) return <p>Loading... Please wait...</p>;
  if (isError) return <p className="text-red-700">Oops !! Error fetching data: {error.message}</p>;

  return (
    <div className="filter-container p-4 flex flex-col items-center">
      <div className="filter-dropdowns flex space-x-4 items-center justify-center">
        <h1 className="text-center font-bold mt-6" style={{ fontSize: "1.5rem" }}>
          Filter by:
        </h1>

        {/* Origin Dropdown */}
        <div className="flex flex-col items-center">
          <label htmlFor="origin" className="mb-2">
            Origin
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger id="origin" className="bg-gray-200 p-2 rounded text-center">
              {origin}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white p-2 rounded shadow-md max-h-60 overflow-y-auto">
              {uniqueValues("origin").map((value) => (
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

        {/* Destination Dropdown */}
        <div className="flex flex-col items-center">
          <label htmlFor="destination" className="mb-2">
            Destination
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger id="destination" className="bg-gray-200 p-2 rounded text-center">
              {destination}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white p-2 rounded shadow-md max-h-60 overflow-y-auto">
              {uniqueValues("destination").map((value) => (
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

        {/* Altitude Dropdown */}
        <div className="flex flex-col items-center">
          <label htmlFor="altitude" className="mb-2">
            Altitude
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger id="altitude" className="bg-gray-200 p-2 rounded text-center">
              {altitude}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white p-2 rounded shadow-md max-h-60 overflow-y-auto">
              {uniqueValues("altitude").map((value) => (
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
        {isFiltering && (
          <div className="w-full flex justify-center items-center text-center">
            <p className="text-gray-700">Loading... Please wait...</p>
          </div>
        )}

        {filteredRoutes.length === 0 && !isFiltering && !isError && (
          <div className="w-full flex justify-center items-center text-center">
            <p className="text-red-700">No results found.</p>
          </div>
        )}

        {filteredRoutes.map((route, index) => {
          const cardKey = `${route.origin}-${route.destination}-${route.altitude}-${index}`;
          return (
            <Card
              key={cardKey}
              className="result-card w-1/2 p-4 bg-white shadow-md rounded-md bg-opacity-85 text-center m-4"
            >
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
