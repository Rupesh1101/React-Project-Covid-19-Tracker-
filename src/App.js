import { FormControl, MenuItem, Select, Card, CardContent} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import Map from './Map';
import InfoBox from './InfoBox';
import Table from './Table';
import LineGraph from './LineGraph';
import { prettyPrintStat, sortData } from './util';
import 'leaflet/dist/leaflet.css';

// https://disease.sh/v3/covid-19/countries

function App() {
  const [countries,setCountries] = useState([]);
  const[country,setCountry] = useState("worldwide");
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796,
  });
  // console.log(mapCenter);
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([]);
  const[caseType, setCaseType] = useState("cases");
  

  useEffect(() =>{
    fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => {
          setCountryInfo(data)
        })
  },[])

    useEffect(() => {
      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,//name of the country
              value: country.countryInfo.iso2, // UK,USA,IN
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
      };
      getCountriesData();
    },[]);

    const onCountryChange = async (event) =>{
      const countryCode = event.target.value;
      setCountry(countryCode);

      const url = countryCode === "worldwide"
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`

      await fetch(url)
      .then(response => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        countryCode === "worldwide"
        ? setMapCenter([34.80746, -40.4796])
        : setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
        setMapZoom(4);
      });
      
    }

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER </h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country} >
            <MenuItem value="worldwide">worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          {/* InfoBoxes title="Coronavirus Cases"*/}
          {/* InfoBoxes title="Coronavirus Recovery"*/}
          {/* InfoBoxes title="Coronavirus Death"*/}
          <InfoBox
            isRed
            active = {caseType === "cases"}
            onClick = {(e) => setCaseType("cases")} 
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}    
          />
          <InfoBox
            active = {caseType === "recovered"}
            onClick = {(e) => setCaseType("recovered")} 
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isGray
            active = {caseType === "deaths"}
            onClick = {(e) => setCaseType("deaths")}
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        

        {/* Map */}
        
        <Map
          caseType={caseType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
        
      </div>
      
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* Table */}
          <Table countries={tableData}/>
          <h3>Worldwide new {caseType}</h3>
          {/* Graph */}
          <LineGraph className="app_graph" caseType={caseType}/>
        </CardContent> 
      </Card>
              

    </div>
  );
}

export default App;
