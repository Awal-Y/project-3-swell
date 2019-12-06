import React from 'react'
import { Link } from 'react-router-dom'

const SpotCard = ({ spot }) => (
  <div className="column is-one-quarter-desktop is-one-third-tablet is-half-mobile">
    <div className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={spot.image} alt="Placeholder image"/>
        </figure>
      </div>
      <div className="card-content">
        <Link className="subtitle" to={`/spots/${spot._id}`}>{spot.spotName}</Link>
        <p className="has-text-grey-darker">{spot.country}</p>
      </div>
    </div>
  </div>
)

export default SpotCard