import React from 'react'
import errorPageImg from '../../assets/errorImg.jpg'
import './index.css'

function ErrorPage() {
  return (
    <div className='error-container'>
      <img className='error-img-container' src={errorPageImg} alt='error_img'></img>
    </div>
  )
}

export default ErrorPage
