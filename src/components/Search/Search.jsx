import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Adjust path
import { Button } from '../ui/button';

// Fetch airport data
const fetchAirportData = async (code) => {
  try {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const targetUrl = `https://api.aviationapi.com/v1/airports?apt=${code}`;

    const { data } = await axios.get(`${proxyUrl}${encodeURIComponent(targetUrl)}`);
    const airportData = JSON.parse(data.contents);
    //console.log('API Response:', airportData);

    // Extract the data based on the first key of the response object
    const key = Object.keys(airportData)[0];
    return airportData[key];
  } catch (error) {
    console.error('Error fetching airport details:', error);
    return null;
  }
};

const Search = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [airportData, setAirportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setAirportData(null);

    if (!data.code.trim()) {
      setError('Code is required');
      setLoading(false);
      return;
    }

    try {
      const result = await fetchAirportData(data.code);
      if (result && result.length > 0) {
        setAirportData(result[0]);
      } else {
        setError('No data found for the provided code.');
      }
    } catch (err) {
      setError('Failed to fetch airport data.');
    }
    setLoading(false);
  };

  return (
    <div className="search-container p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="search-form">
        <input
          type="text"
          {...register('code', { required: 'Code is required' })}
          placeholder="Enter FAA or ICAO code"
          className="search-input"
        />
        <Button type="submit" className="search-button">Search</Button>
        
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {airportData && airportData.facility_name && (
        <Card className="airport-card">
          <CardHeader>
            <CardTitle>{airportData.facility_name}</CardTitle>
            <CardDescription>{airportData.city}, {airportData.state_full}</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>FAA Code:</strong> {airportData.faa_ident}</p>
            <p><strong>ICAO Code:</strong> {airportData.icao_ident}</p>
            <p><strong>City:</strong> {airportData.city}</p>
            <p><strong>State:</strong> {airportData.state_full}</p>
            <p><strong>Elevation:</strong> {airportData.elevation} ft</p>
            <p><strong>Control Tower:</strong> {airportData.control_tower === 'Y' ? 'Yes' : 'No'}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Search;
