
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Auth from '../lib/auth'
import ForecastChart from './ForecastCharts'
import MiniSurfMap from './MiniSurfMap'
import Comments from './CommentSection'

const SingleSpot = (props) => {

  window.scrollTo(0, 0)

  const [data, setData] = useState([])
  const [rating, setRate] = useState(0)
  const [nums, setNum] = useState([])
  const [people, setPeople] = useState(0)
  const [error, setError] = useState('')
  const [text, setText] = useState('Delete spot')
  const [name, setName] = useState('')

  useEffect(() => {
    fetch(`/api/spots/${props.match.params.id}`)
      .then(resp => resp.json())
      .then(resp =>
        setData(resp)
      )
      .then(createRating())
      .then(axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
        .then((resp) => {
          setName(resp.data.username)
        }))
    // .then(getForecast())
    return () => console.log('Unmounting component')
  }, [rating])
  // should run twice after first loading the spot

  let response = {}



  function updateComments(resp) {
    const newData = { ...data }
    newData.comments = resp.data.comments
    console.log(newData)
    setData(newData)
  }

  function createRating() {
    setNum([])
    fetch(`/api/spots/${props.match.params.id}`)
      .then(resp => resp.json())
      .then(resp => {
        response = resp
        setPeople(resp.rating.length)
        return resp.rating.forEach(e => {
          nums.push(e.rate)
          return nums
        })
      })
      .then(() => {
        if (nums.length > 0) {
          const added = nums.reduce((pre, i) => {
            return pre + i
          })
          return (added / (response.rating.length * 5))
        }
      })
      .then(resp => setRate(resp))
      .then(() => {
        if (rating === 0) {
          console.log('rating undefined')
        } else {
          waves()
        }
      })
    return () => console.log('updated')
  }

  // how the stars/waves are defined :
  // 1 = 0 - 20
  // 2 = 21 - 40
  // 3 = 41 - 60
  // 4 = 61 - 80
  // 5 = 81 - 100%

  const wave1 = document.querySelector('#wave1')
  const wave2 = document.querySelector('#wave2')
  const wave3 = document.querySelector('#wave3')
  const wave4 = document.querySelector('#wave4')
  const wave5 = document.querySelector('#wave5')

  const waveList = [wave1, wave2, wave3, wave4, wave5]

  const changeWave = (w) => {
    console.log(w)
    for (let i = 0; i < w; i++) {
      waveList[i].style.width = '100%'
    }
    for (let i = w; i < waveList.length; i++) {
      waveList[i].style.width = '0%'
    }
  }

  const waveCheck = (w) => {
    const newRating = rating.toFixed(2)
    console.log('sting 3', newRating.toString()[3])
    if (newRating.toString()[3] !== '0') {
      console.log(3)
      if (newRating.toString()[2] === '2' || newRating.toString()[2] === '4' || newRating.toString()[2] === '6' || newRating.toString()[2] === '8') {
        console.log(parseInt(newRating.toString()[3]) * 5 + '%')
        waveList[waveList.length - w].style.width = parseInt(newRating.toString()[3]) * 5 + '%'
      } else {
        console.log((parseInt(rating.toString()[3]) + 10) / 20 * 100 + '%')
        waveList[waveList.length - w].style.width = (parseInt(rating.toString()[3]) + 10) / 20 * 100 + '%'
      }
    } else if (newRating.toString()[2] !== '0') {
      console.log(2)
      if (newRating === '0.20' || newRating === '0.40' || newRating === '0.60' || newRating === '0.80') {
        waveList[waveList.length - w].style.width = '100%'
      } else {
        waveList[waveList.length - w].style.width = '50%'
      }
    } else {
      console.log(1)
      waveList[waveList.length - w].style.width = newRating.toString()[0] * 100 + '%'
    }
  }

  const waves = () => {
    if (rating === undefined) {
      return
    } else if (rating.toFixed(2) < 0.21) {
      changeWave(1)
      waveCheck(5)
    } else if (rating.toFixed(2) < 0.41) {
      changeWave(2)
      waveCheck(4)
    } else if (rating.toFixed(2) < 0.61) {
      changeWave(3)
      waveCheck(3)
    } else if (rating.toFixed(2) < 0.81) {
      changeWave(4)
      waveCheck(2)
    } else if (rating.toFixed(2) >= 0.81) {
      changeWave(5)
      waveCheck(1)
    }
  }
  const con = (num) => {
    submitRating(num)
  }

  function submitRating(num) {
    axios.post(`/api/spots/${props.match.params.id}/rate`, { rate: num }, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(() => createRating())
      .catch((err) => {
        if (err.response.data.message !== 'Unauthorized') {
          return setError(err.response.data.message)
        } else {
          setError('Unauthorized - please log in')
        }
      })
    if (rating !== undefined) {
      waves()
    }
  }

  function checkRating() {
    if (isNaN(rating)) {
      return 0
    }
    return rating.toFixed(2)
  }


  function addFavourite() {
    // this is a POST request as I am adding the spot ID to the user "favourites" array - however this could be made into a PUT request instead
    axios.post(`/api/spots/${props.match.params.id}/favourite`, {}, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(response => {
        setError(response.data.message)
      })
      .catch((err) => {
        if (err.response.data.message !== 'Unauthorized') {
          return setError(err.response.data.message)
        } else {
          setError('Unauthorized - please log in')
          setError(response.data.message)
        }
      })
  }

  function isOwner(data) {
    return Auth.getUserId() === data.user
  }

  function isAdmin() {
    console.log(name)
    if (name === 'admin') {
      return true
    }
  }

  function makeSure() {
    if (text === 'Are you sure') {
      handleDelete()
    }
    setText('Are you sure')
  }

  function handleDelete() {
    axios.delete(`/api/spots/${props.match.params.id}`, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(() => props.history.push('/spots'))
      .catch(err => console.log(err))
  }


  return (
    <section id='single-spot' className="section">
      <div className="container">
        <div id='section-one'>
          <div className="columns is-multiline">
            <div className="column is-half-tablet main-column">
              <p className="title">
                {data.spotName}
              </p>
              <p className="subtitle">
                {`${data.country} - ${data.region}`}
              </p>
              <p id="description">
                {data.description}
              </p>
              <br />
              {data.long && data.lat && <ForecastChart lon={data.long} lat={data.lat} />}
            </div>
            <div id='image-column' className="column is-half-tablet main-column">
              <img id='spot-image' src={data.image} />
            </div>
          </div>
          <div id='rating-box'>
            <div id='current-rating'>
              <div>Rating: {((checkRating()) * 5).toFixed(2)} stars
                {/* {checkRating()} / {(checkRating() * 100).toFixed(2)}% */}
                {/* <br />
                {people} rating */}
              </div>
              <br />
              <div id="waves">
                <div className="imgDiv">
                  <img className="ratingImg" id="wave1" src='https://i.imgur.com/KjLvvGz.png' />
                </div>
                <div className="imgDiv">
                  <img className="ratingImg" id="wave2" src='https://i.imgur.com/KjLvvGz.png' />
                </div>
                <div className="imgDiv">
                  <img className="ratingImg" id="wave3" src='https://i.imgur.com/KjLvvGz.png' />
                </div>
                <div className="imgDiv">
                  <img className="ratingImg" id="wave4" src='https://i.imgur.com/KjLvvGz.png' />
                </div>
                <div className="imgDiv">
                  <img className="ratingImg" id="wave5" src='https://i.imgur.com/KjLvvGz.png' />
                </div>

              </div>
            </div>
            <div id='client-rating'>
              <label>Rate this Spot:</label>
              <div id='button-box'>
                <button className='button is-small is-info is-outlined rating-button' onClick={() => con(1)}>1</button>
                <button className='button is-small is-info is-outlined rating-button' onClick={() => con(2)}>2</button>
                <button className='button is-small is-info is-outlined rating-button' onClick={() => con(3)}>3</button>
                <button className='button is-small is-info is-outlined rating-button' onClick={() => con(4)}>4</button>
                <button className='button is-small is-info is-outlined rating-button' onClick={() => con(5)}>5</button>
                {error && <small className="help is-danger">
                  {error}
                </small>}
              </div>
              <button className='button is-info favourite' onClick={() => addFavourite()}> Add to favourites</button>
            </div>
          </div>
          {/* <ForecastChart lat={data.lat} lon={data.long}/> */}
        </div>
      </div>
      <div className='container' id='section-2'>
        <div className='columns'>
          <div id='surf-map-column' className="column is-half-tablet main-column">
            {data.long && data.lat && <MiniSurfMap lat={data.lat} lon={data.long} />}
            <div>
              {isOwner(data) &&
                <>
                  <p><i>You created this spot</i></p>
                  <br />
                </>
              }
              {isAdmin() &&
                <>
                  <button className="button is-danger" onClick={
                    () => makeSure()
                  }>
                    {text}
                  </button>
                </>
              }
              {isAdmin() &&
                <>
                  <Link className="button is-info" to={`/edit/${props.match.params.id}`}>
                    Edit Spot
                  </Link>
                </>
              }
            </div>
          </div>
          <div className="column is-half-tablet main-column">
            {/* <ForecastChart lat={data.lat} lon={data.long} /> */}
            <Comments data={data} updateComments={resp => updateComments(resp)} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SingleSpot
