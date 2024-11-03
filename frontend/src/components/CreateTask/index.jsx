import React, {useState, useEffect} from 'react'
import ClipLoader from "react-spinners/ClipLoader"
import red from '../../assets/red.png'
import green from '../../assets/green.png'
import checkImg from '../../assets/check.png'
import uncheckImg from '../../assets/uncheck.png'
import deleteImg from '../../assets/delete.png'
import downArr1 from '../../assets/downArr.png'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import blue from '../../assets/blue.png'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import axios from 'axios'
import styled from "styled-components"
const url = 'https://pro-manage-webapp-backend.vercel.app/api'
import './index.css'

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }

  input {
    width: 10vw;
    height: 5vh;
    text-align: center;
    font-size: 1vw;
    border-radius: 12px;
    border: 1px solid #E2E2E2;
    outline: none;
    font-family: Poppins;
    font-weight: 500;
  }

  input::placeholder {
    color: #707070;
    font-family: Poppins;
    font-weight: 500;
    font-size: 1vw;
    text-align: center;
  }`

function CreateTask({setIsCreate}) {
  
  const [loading, setLoading] = useState(false)
  const token = sessionStorage.getItem('authToken')
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('')
  const [checklist, setChecklist] = useState([]) 
  const [dueDate, setDueDate] = useState(null)
  const [assignedToEmail, setAssignedToEmail] = useState('')
  const [completedCheckCount, setCompletedCheckCount] = useState(0)
  const [userEmails, setUserEmails] = useState([])
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    const handleUserEmails = async () => {
      try{
        setLoading(true)
        const reqUrl = `${url}/user/emails`
        const response = await axios.get(reqUrl, {
          headers: {
            'token': `${token}`
          }
        })
        if(response){
          setUserEmails(response.data.userDetails)
          setLoading(false)
        }
      }
      catch(err){
        console.log(err)
        setLoading(false)
      }
    }
    handleUserEmails()
  }, [])

  const handleRemoveChecklist = (index) => {
    const updatedChecklist = checklist.filter((each, eachIndex) => {
      return (
        eachIndex !== index
      )
    })
    setChecklist(updatedChecklist)
  }

  const handleAddChecklist = () => {
    setChecklist([...checklist, { checkText: '', checked: false }])
  }

  const handleChecklistCheck = (index, field, val) => {
    const updatedChecklist = [...checklist]
    updatedChecklist[index][field] = val
    if(field === 'checked' && val === true){
      setCompletedCheckCount(completedCheckCount + 1)
    }
    else{
      setCompletedCheckCount(completedCheckCount - 1)
    }
    setChecklist(updatedChecklist)
  }

  const handleChecklistText = (index, field, val) => {
    const updatedChecklist = [...checklist]
    updatedChecklist[index][field] = val
    setChecklist(updatedChecklist)
  }

  const handleSubmit = async () => {
    const hasEmptyField = checklist.some(check => !check.checkText)

    if (!title || !priority || hasEmptyField || checklist.length < 1) {
      toast.error("Required Fields should not be Empty!")
      return
    }
    try{
      setLoading(true)
      const reqUrl = `${url}/task/create`
      const response = await axios.post(reqUrl, { title: title, priority: priority, checklist: checklist, dueDate: dueDate, assignedToEmail: assignedToEmail, completedCheckCount: completedCheckCount }, {
        headers: {
          'token': `${token}`
        }
      })
      if(response){
        setLoading(false)
        toast.success("Task created successfully")
        window.location.reload(false)
      }
    } catch (error) {
      toast.error(error.response.data.msg || "Error Occurred")
      setLoading(false)
    }
  }

  const handleEmail = (val) => {
    setAssignedToEmail(val)
    setExpand(false)
  }

  return (
    <>
      {loading && <div>
        <ClipLoader color={"#36D7B7"} loading={loading} size={150} />
      </div>}
      {!loading && <div className='create-container'><div className='top-div-create'>
      <div className='title-div-create'>
        <h3 className='title-para-create'>Title <span className='star-create'>*</span></h3>
        <input className='title-inp-create' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Enter Task Title' onClick={() => setExpand(false)}></input>
      </div>
      <div className='prior-div-create'>
        <h3 className='prior-para-create'>Select Priority <span className='star-create'>*</span></h3>
        <button className='high-btn-create' onClick={() => setPriority('high')} style={{backgroundColor: priority === 'high' ? '#EEECEC' : ''}}><img src={red} alt='red_img'></img> HIGH PRIORITY</button>
        <button className='mid-btn-create' onClick={() => setPriority('mid')} style={{backgroundColor: priority === 'mid' ? '#EEECEC' : ''}}><img src={blue} alt='blue_img'></img> MODERATE PRIORITY</button>
        <button className='low-btn-create' onClick={() => setPriority('low')} style={{backgroundColor: priority === 'low' ? '#EEECEC' : ''}}><img src={green} alt='green_img'></img> LOW PRIORITY</button>
      </div>
      <div className='assign-div-create'>
        <h3 className='assign-para-create'>Assign to</h3>
        <button className='assign-sel-create' onClick={() => setExpand(!expand)}>{assignedToEmail ? assignedToEmail : 'Add a assignee'}<img className='down-img-create' src={downArr1} alt='down_img'></img>
        <div className='opt-div-create'>
          {expand && userEmails.map((user, userIndex) => {
            return (
              <div className='opt-each-div-create' key={user._id} value={user[0]} onClick={() => handleEmail(user[0])}>
                <div className='opt-d1-create'>
                  <h3 className='opt-para-create'>{user[0][0].toUpperCase() + user[0][1].toUpperCase()}</h3>
                </div>
                <h3 className='opt-email-create'>{user[0]}</h3>
                <button className='opt-btn-create'>Assign</button>
              </div>
            )
          })}
        </div>
        </button>
      </div>
      <h3 className='check-para-create'>Checklist ({completedCheckCount}/{checklist.length}) <span className='star-create'>*</span></h3>
      <div className='check-div-create'>
        {checklist.length > 0 && checklist.map((each, eachIndex) => {
          return (<div className='check-each-create' key={eachIndex}>
          {each.checked ? <img className='check-img-create' src={checkImg} alt='check_img' style={{cursor: 'pointer'}} onClick={() => handleChecklistCheck(eachIndex, 'checked', false)}></img> : <img className='check-img-create' src={uncheckImg} alt='uncheck_img' style={{cursor: 'pointer'}} onClick={() => handleChecklistCheck(eachIndex, 'checked', true)}></img>}
          <input className='check-inp-create' value={each.checkText} onChange={(e) => handleChecklistText(eachIndex, 'checkText', e.target.value)} placeholder='Add a Task'></input>
          <img className='del-img-create' src={deleteImg} alt='delete_img' style={{cursor: 'pointer'}} onClick={() => handleRemoveChecklist(eachIndex)}></img>
          </div>)
        })}
      </div>
      <h3 className='add-btn-create' onClick={handleAddChecklist}>+ Add New</h3>
    </div>
    <div className='foot-div-create'>
      <DatePickerWrapper>
        <DatePicker
          selected={dueDate}
          onChange={date => setDueDate(date)}
          dateFormat="dd/MM/yyyy"
          todayButton="Today"
          isClearable
          showMonthDropdown 
          showYearDropdown
          dropdownMode="select"
          placeholderText="Select Due Date"
          minDate={new Date()}
        />
      </DatePickerWrapper>
      <div className='submit-div-create'>
        <button className='cncl-btn-create' onClick={() => setIsCreate(false)}>Cancel</button>
        <button className='save-btn-create' onClick={handleSubmit}>Save</button>
      </div>
    </div>
    </div>}
    </>
  )
}

export default CreateTask
