import React from 'react'
import {MapContainer, TileLayer, useMap} from 'react-leaflet';
import './App.css';
import { showDataOnMap } from './util';

function Map({countries, caseType, center, zoom}) {

    const ChangeView = ({center, zoom}) =>{

        const map = useMap();
        map.setView(center, zoom);
        return null;
    }
    
    return (
        <div className="map">
            <MapContainer caseType={caseType} center={center} zoom={zoom} scrollWheelZoom={false}>
                <ChangeView center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showDataOnMap(countries, caseType)}
            </MapContainer>
        </div>
    )
}

export default Map;
