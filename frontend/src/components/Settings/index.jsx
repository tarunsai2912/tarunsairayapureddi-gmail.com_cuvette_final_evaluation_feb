import React, {useState} from 'react'
import './index.css'
import { useNavigate } from 'react-router-dom'
import name from '../../assets/name.png'
import email from '../../assets/email.png'
import password from '../../assets/password.png'
import ClipLoader from "react-spinners/ClipLoader"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import view from '../../assets/view.png'
import hide from '../../assets/hide.png'
import axios from 'axios'
const url = 'https://pro-manage-webapp-backend.vercel.app/api'

function Settings() {

    const navigate = useNavigate()

    const token = sessionStorage.getItem('authToken')
    const userId = sessionStorage.getItem('userId')
    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const handleClick1 = () => setShowPassword1(!showPassword1)
    const handleClick2 = () => setShowPassword2(!showPassword2)

    const [formData, setFormData] = useState({
      name: '',
      email: '',
      oldPassword: '',
      newPassword: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
      setFormData({...formData,
        [e.target.name]: e.target.value
      })
    }

    const handleSubmit = async () => {
        try{
          setLoading(true)
          const reqUrl  = `${url}/user/update/${userId}`
          const response = await axios.patch(reqUrl, formData, {
            headers: {
              'token': `${token}`
            }
          })
          if (response) {
            toast.success("User Updated Successfully")
            sessionStorage.setItem('name', response.data.userName)
            if(formData.email || (formData.newPassword && formData.oldPassword)){
              sessionStorage.clear()
              setLoading(false)
              navigate('/')
            }
            setLoading(false)
          }
        }
        catch (error){
          toast.error(error.response.data.msg)
          setLoading(false)
        }
    }

  return (
    <div className='set-container'>
      <ToastContainer /> 
      <h3 className='set-head'>Settings</h3> 
      {loading && <div style={{position: 'relative', left:'40vw'}}><ClipLoader color={"#36D7B7"} loading={loading} size={100} /></div>}
      {!loading && <div className='set-inp-container'>
        <div className='name-div-set'>
          <img className='name-img-set' src={name} alt='name_img'></img>
          <input type='text' name='name' placeholder='Name' className='name-input-set' value={formData.name} onChange={handleChange}></input>
        </div>
        <div className='email-div-set'>
          <img className='email-img-set' src={email} alt='email_img'></img>
          <input type='email' name='email' placeholder='Update Email' className='email-input-set' value={formData.email} onChange={handleChange}></input>
        </div>
        <div className='oldpass-div-set'>
          <img className='oldpass-img-set' src={password} alt='oldpass_img'></img>
          <input type={showPassword2 ? "text" : "password"} name='oldPassword' placeholder='Old Password' className='oldpass-input-set' value={formData.oldPassword} onChange={handleChange}></input>
          {showPassword2 ? <img className='view1-img-set' src={hide} alt='hide_img' onClick={handleClick2}></img> : <img className='view1-img-set' src={view} alt='view_img' onClick={handleClick2}></img>}
        </div> 
        <div className='newpass-div-set'>
          <img className='newpass-img-set' src={password} alt='newpass_img'></img>
          <input type={showPassword1 ? "text" : "password"} name='newPassword' placeholder='New Password' className='newpass-input-set' value={formData.newPassword} onChange={handleChange}></input>
          {showPassword1 ? <img className='view2-img-set' src={hide} alt='hide_img' onClick={handleClick1}></img> : <img className='view2-img-set' src={view} alt='view_img' onClick={handleClick1}></img>}
        </div>
        <button onClick={handleSubmit} className='update-btn-set'>Update</button></div>}
    </div>
  )
}

export default Settings
