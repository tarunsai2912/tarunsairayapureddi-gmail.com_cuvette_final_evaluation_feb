import React, {useState} from 'react'
import name from '../../assets/name.png'
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

function Register({handleLogin}) {

    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)

    const handleClick1 = () => setShowPassword1(!showPassword1)
    const handleClick2 = () => setShowPassword2(!showPassword2)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({...formData,
            [e.target.name]: e.target.value
        })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const validate = () => {
        const newErrors = {};
        
        if (!formData.name) {
            newErrors.name = 'Give a Name'
        }

        if (!formData.email) {
            newErrors.email = 'Give an Email'
        } 
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid Email'
        }

        if (!formData.password) {
            newErrors.password = 'Give a Password'
        } 
        else if (formData.password.length < 6) {
            newErrors.password = 'Password > 6 characters'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Give a Password'
        } 
        else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords doesn’t match'
        }

        return newErrors
    };

    const handleSubmit = async () => {
        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            if(errors.name){
                setFormData({...formData,
                    name: ''
                })
            }
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
            if(errors.confirmPassword){
                setFormData({...formData,
                    confirmPassword: ''
                })
            }
            return
        }
        try{
            setLoading(true)
            const reqUrl  = `${url}/user/register`
            const response = await axios.post(reqUrl, formData)
            if (response) {
                toast.success("User got Registered Successfully")
                setLoading(false)
                handleLogin()
            }
        }
        catch (error){
            toast.error("User Already Exists")
            setLoading(false)
        }
    }

  return (
    <>
    <ToastContainer />
    {loading && <div style={{position: 'relative', left:'40vw'}}><ClipLoader color={"#36D7B7"} loading={loading} size={100} /></div>}
    {!loading && <div className='reg-container'>
      <h3 className='para1-reg'>Register</h3>
      <div className='name-div-reg'>
        <img className='name-img-reg' src={name} alt='name_img'></img>
        <input type='text' name='name' placeholder={errors.name ? '' : 'Name'} className='name-input-reg' value={errors.name ? '' : formData.name} onChange={handleChange} style={{border: errors.name ? '2px solid #D60000' : '2px solid #F4F4F4'}}></input>
        {errors.name && <span className='name-err-reg' style={{ color: 'red' }}>{errors.name}</span>}
      </div>
      <div className='email-div-reg'>
        <img className='email-img-reg' src={email} alt='email_img'></img>
        <input type='email' name='email' placeholder={errors.email ? '' : 'Email'} className='email-input-reg' value={errors.email ? '' : formData.email} onChange={handleChange} style={{border: errors.email ? '2px solid #D60000' : '2px solid #F4F4F4'}}></input>
        {errors.email && <span className='email-err-reg' style={{ color: 'red' }}>{errors.email}</span>}
      </div>
        <div className='confpass-div-reg'>
        <img className='confpass-img-reg' src={password} alt='confpass_img'></img>
        <input type={showPassword2 ? "text" : "password"} name='confirmPassword' placeholder={errors.confirmPassword ? '' : 'Confirm Password'} className='confpass-input-reg' value={errors.confirmPassword ? '' : formData.confirmPassword} onChange={handleChange} style={{border: errors.confirmPassword ? '2px solid #D60000' : '2px solid #F4F4F4'}}></input>
        {showPassword2 ? <img className='view1-img-reg' src={hide} alt='hide_img' onClick={handleClick2}></img> : <img className='view1-img-reg' src={view} alt='view_img' onClick={handleClick2}></img>}
        {errors.confirmPassword && <span className='confpass-err-reg' style={{ color: 'red' }}>{errors.confirmPassword}</span>}
      </div> 
      <div className='pass-div-reg'>
        <img className='pass-img-reg' src={password} alt='pass_img'></img>
        <input type={showPassword1 ? "text" : "password"} name='password' placeholder={errors.password ? '' : 'Password'} className='pass-input-reg' value={errors.password ? '' : formData.password} onChange={handleChange} style={{border: errors.password ? '2px solid #D60000' : '2px solid #F4F4F4'}}></input>
        {showPassword1 ? <img className='view2-img-reg' src={hide} alt='hide_img' onClick={handleClick1}></img> : <img className='view2-img-reg' src={view} alt='view_img' onClick={handleClick1}></img>}
        {errors.password && <span className='pass-err-reg' style={{ color: 'red' }}>{errors.password}</span>}
      </div>
      <button onClick={handleSubmit} className='signup-btn-reg'>Register</button>
      <h4 className='para2-reg'>Have an account ?</h4>
      <button className='log-btn-reg' onClick={handleLogin}>Log in</button>
    </div>}
    </>
  )
}

export default Register
