import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import email from '../../assets/email.png'
import password from '../../assets/password.png'
import ClipLoader from "react-spinners/ClipLoader"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import view from '../../assets/view.png'
import hide from '../../assets/hide.png'
import './index.css'
import axios from 'axios'
const url = 'https://pro-manage-webapp-backend.vercel.app/api'

function Login({handleRegister}) {

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const handleClick = () => setShowPassword(!showPassword)

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({...formData,
        [e.target.name]: e.target.value
    })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Give an Email'
    } 
    else if (!/\S+@\S+\.\S{3,}/.test(formData.email)) {
      newErrors.email = 'Invalid Email'
    }
    if (!formData.password) {
      newErrors.password = 'Give a Password'
    } 
    else if (formData.password.length < 6) {
      newErrors.password = 'Password is Incorrect'
    }
    return newErrors;
  }

  const handleSubmit = async () => {
    const formErrors = validate()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      if(errors.email){
        setFormData({...formData,
          email: ''
        })
      }
      if(errors.password){
        setFormData({...formData,
          password: ''
        })
      }
      return
    }
    
    try{
      setLoading(true)
      const reqUrl  = `${url}/user/login`
      const response = await axios.post(reqUrl, formData)
      if (response) {
        toast.success("User got LoggedIn Successfully")
        sessionStorage.setItem('authToken', response.data.token)
        sessionStorage.setItem('userId', response.data.user_Id)
        sessionStorage.setItem('name', response.data.name)
        sessionStorage.setItem('email', response.data.email)
        sessionStorage.setItem('selectedDate', 'This Week')
        setLoading(false)
        navigate('/home')
      }
    }
    catch (error){
      toast.error(error.response.data.msg)
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <div><ClipLoader color={"#36D7B7"} loading={loading} size={100} /></div>}
      {!loading && <div className='log-container'>
        <h3 className='para1-log'>Login</h3>
        <div className='email-div-log'>
          <img className='email-img-log' src={email} alt='email_img'></img>
          <input type='email' name='email' placeholder={errors.email ? '' : 'Email'} className='email-input-log' value={errors.email ? '' : formData.email} onChange={handleChange} style={{border: errors.email ? '2px solid #D60000' : '2px solid #F4F4F4'}}></input>
          {errors.email && <span className='email-err-log' style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <div className='pass-div-log'>
          <img className='pass-img-log' src={password} alt='pass_img'></img>
          <input type={showPassword ? "text" : "password"} name='password' placeholder={errors.password ? '' : 'Password'} className='pass-input-log' value={errors.password ? '' : formData.password} onChange={handleChange} style={{border: errors.password ? '2px solid #D60000' : '2px solid #F4F4F4'}}></input>
          {showPassword ? <img className='view-img-log' src={hide} alt='hide_img' onClick={handleClick}></img> : <img className='view-img-log' src={view} alt='view_img' onClick={handleClick}></img>}
          {errors.password && <span className='pass-err-log' style={{ color: 'red' }}>{errors.password}</span>}
        </div>
        <button onClick={handleSubmit} className='login-btn-log'>Log in</button>
        <h4 className='para2-log'>Have no account yet?</h4>
        <button className='reg-btn-log' onClick={handleRegister}>Register</button>
      </div>}
    </>
  )
}

export default Login
