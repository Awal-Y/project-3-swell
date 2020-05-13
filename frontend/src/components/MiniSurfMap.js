import React, { useState, useEffect } from 'react'
import ReactMapGL, { Marker, Popup, GeolocateControl, FlyToInterpolator, LinearInterpolator } from 'react-map-gl'

const initialViewport = {
  width: 500,
  height: 500,
  latitude: 44.84044,
  longitude: -0.5805,
  zoom: 3
}
const errorInitialState = {
  errors: ''
}
const MiniSurfMap = ({ lat, lon }) => {
  const [showPopup, setShowPopup] = useState(null)
  const [spotdata, setSpotdata] = useState([])
  const [viewport, setViewport] = useState(initialViewport)
  const [error, setError] = useState(errorInitialState)


  useEffect(() => {
    spotLongLat(lat, lon)
  }, [lat, lon])

  ///------------------------------------------------///
  ///  how do you update only parts of the object... ///
  ///------------------------------------------------///
  function spotLongLat(lat, lon) {
    setViewport({
      width: 300,
      height: 300,
      latitude: Number(lat),
      longitude: Number(lon),
      zoom: 10,
      transitionDuration: 3000,
      transitionInterpolator: new FlyToInterpolator()
    })
  }
  // spotLongLat()
  ///------------------------------------------------///
  /// fix  moving the map moves the surfer           ///
  ///------------------------------------------------///
  return (
    <React.Fragment>
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken='pk.eyJ1IjoiYXdhbC15IiwiYSI6ImNrM3lqbnh0czA1YTQzZ3J1ZDRwaW15ZW8ifQ.48aoOHJL0iRF-Uf69S9tLQ'
        onViewportChange={(viewport) => setViewport(viewport)}
      >
        <Marker
          latitude={Number(lat)}
          longitude={Number(lon)}
        >
          <div>🏄🏽‍</div>
        </Marker>
      </ReactMapGL>
    </React.Fragment>
  )
}

export default MiniSurfMap