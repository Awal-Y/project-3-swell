import React, { useState, useEffect } from 'react'
import ReactMapGL, { LinearInterpolator, FlyToInterpolator, Marker, Popup, GeolocateControl } from 'react-map-gl'
import axios from 'axios'
import { Link } from 'react-router-dom'
import 'mapbox-gl/dist/mapbox-gl.css'

const initialViewport = {
  width: 1000,
  height: 700,
  latitude: 44.84044,
  longitude: -0.5805,
  zoom: 3
}

const errorInitialState = {
  errors: ''
}

const SurfMap = () => {
  const [showPopup, setShowPopup] = useState(null)
  const [spotdata, setSpotdata] = useState([])
  const [viewport, setViewport] = useState(initialViewport)
  const [error, setError] = useState(errorInitialState)

  useEffect(() => {
    const spotsArray = spotdata
    axios.get('/api/spots')
      .then((response) => {
        response.data.map((spots) => spotsArray.push({
          id: spots._id, name: spots.spotName, country: spots.country, region: spots.region, lat: spots.lat, long: spots.long, image: spots.image
        }))
        setSpotdata(filterSurfData(spotsArray))
        // console.log(spotsArray)
      })
      .catch(err => setError({ errors: err.response.status }))
  }, [])

  function filterSurfData(goodspots) {
    return goodspots.filter(spots => {
      return spots.lat !== undefined || spots.long !== undefined
    })
  }

  function loadSurfMarkers() {
    // console.log(spotdata)
    return spotdata.map((spot, i) => {
      return (
        <Marker
          key={'marker' + i}
          latitude={Number(spot.lat)}
          longitude={Number(spot.long)}
        >
          <button
            className="marker-btn" value={spot.id}
            onClick={e => {
              e.preventDefault()
              console.log(showPopup)
              console.log(spot)
              setShowPopup(spot.id)
            }}
          >
            <div>🏄🏽‍</div>
          </button>
          {showPopup === spot.id ? (
            <div className="popup">
              <button
                className="popup-close-btn"
                onClick={e => {
                  e.preventDefault()
                  setShowPopup(null)
                }}
              >x</button>
              <Link to={`/spots/${spot.id}`}>
                <h2> {spot.name}
                </h2>
              </Link>
              <p>{spot.region}, {spot.country}</p>
            </div>) : null}
        </Marker>
      )
    })
  }
  return (
    <React.Fragment>
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxApiAccessToken='pk.eyJ1IjoiYXdhbC15IiwiYSI6ImNrM3lqbnh0czA1YTQzZ3J1ZDRwaW15ZW8ifQ.48aoOHJL0iRF-Uf69S9tLQ'
        onViewportChange={(viewport) => setViewport(viewport)}
        className="big-surf-map"
      >
        {loadSurfMarkers()}
      </ReactMapGL>
    </React.Fragment>
  )
}
export default SurfMap
