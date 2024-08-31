import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Adjust path
import { Button } from "../ui/button";

// Fetch airport data
const fetchAirportData = async (code) => {
  try {
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const targetUrl = `https://api.aviationapi.com/v1/airports?apt=${code}`;

    const { data } = await axios.get(
      `${proxyUrl}${encodeURIComponent(targetUrl)}`
    );
    const airportData = JSON.parse(data.contents);
    //console.log('API Response:', airportData);

    // Extract the data based on the first key of the response object
    const key = Object.keys(airportData)[0];
    return airportData[key];
  } catch (error) {
    console.error("Error fetching airport details:", error);
    return null;
  }
};

// const fetchAirportData = async (code) => {
//   try {
//     // Construct the target URL
//     const targetUrl = `https://api.aviationapi.com/v1/airports?apt=${code}`;

//     // Fetch data from the API
//     const { data } = await axios.get(targetUrl);

//     // Extract the data based on the first key of the response object
//     const key = Object.keys(data)[0];
//     return data[key];
//   } catch (error) {
//     console.error('Error fetching airport details:', error);
//     return null;
//   }
// };

const Search = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [airportData, setAirportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setAirportData(null);

    if (!data.code.trim()) {
      setError("Code is required");
      setLoading(false);
      return;
    }

    try {
      const result = await fetchAirportData(data.code);
      if (result && result.length > 0) {
        setAirportData(result[0]);
      } else {
        setError("No data found for the provided code.");
      }
    } catch (err) {
      setError("Failed to fetch airport data.");
    }
    setLoading(false);
  };

  return (
    <div className="search-container p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="search-form flex flex-col items-center space-y-4"
      >
        <input
          type="text"
          {...register("code", { required: "Code is required" })}
          placeholder="Enter FAA or ICAO code"
          className="search-input text-center p-2 border border-black rounded-md"
        />
        <Button type="submit">Search</Button>
      </form>

      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}

      {airportData && airportData.facility_name && (
        <div className="flex justify-center mt-4">
          <Card className="w-1/2 p-4 bg-white bg-opacity-85 shadow-md rounded-md">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold">
                {airportData.facility_name}
              </CardTitle>
              <CardDescription className="text-md">
                {airportData.city}, {airportData.state_full}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center mt-2">
              <p>
                <strong>FAA Code:</strong> {airportData.faa_ident}
              </p>
              <p>
                <strong>ICAO Code:</strong> {airportData.icao_ident}
              </p>
              <p>
                <strong>City:</strong> {airportData.city}
              </p>
              <p>
                <strong>State:</strong> {airportData.state_full}
              </p>
              <p>
                <strong>Elevation:</strong> {airportData.elevation} ft
              </p>
              <p>
                <strong>Control Tower:</strong>{" "}
                {airportData.control_tower === "Y" ? "Yes" : "No"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Search;
