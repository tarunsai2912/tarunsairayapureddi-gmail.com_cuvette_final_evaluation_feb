import React, {useState, useEffect} from 'react'
import ClipLoader from "react-spinners/ClipLoader"
import red from '../../assets/red.png'
import green from '../../assets/green.png'
import checkImg from '../../assets/check.png'
import uncheckImg from '../../assets/uncheck.png'
import deleteImg from '../../assets/delete.png'
import { ToastContainer, toast } from 'react-toastify'
import downArr1 from '../../assets/downArr.png'
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
    font-size: 1rem;
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
    font-size: 1rem;
    text-align: center;
  }`

function EditTask({setIsEdit}) {
  
  const [task, setTask] = useState({})
  const [loading, setLoading] = useState(true)
  const token = sessionStorage.getItem('authToken')
  const userId = sessionStorage.getItem('userId')
  const taskId = sessionStorage.getItem('taskId')
  const [userEmails, setUserEmails] = useState([])
  const [expand, setExpand] = useState(false)

  const fetchTask = async () => {
    const reqUrl = `${url}/task/each/${taskId}`
    const response = await axios.get(reqUrl)
    if(response){
        setTask(response.data)
        setLoading(false)
    }
    else{
        setLoading(false)
    }
  }

  useEffect(() => {
    const handleUserEmails = async () => {
        try{
          const reqUrl = `${url}/user/emails`
          const response = await axios.get(reqUrl, {
            headers: {
              'token': `${token}`
            }
          })
          if(response){
            setUserEmails(response.data.userDetails)
          }
        }
        catch(err){
          console.log(err)
        }
      }
    handleUserEmails()
    fetchTask()
  }, [])

  const handleRemoveChecklist = (index) => {
    if (task.checklist.length > 1) {
      const updatedChecklist = task.checklist.filter((each, eachIndex) => {
        return (
          eachIndex !== index 
        )
      })
      setTask({
        ...task,
        checklist: updatedChecklist
      })
    }
  }

  const handleAddChecklist = () => {
    setTask({
        ...task,
        checklist:  [...task.checklist, { checkText: '', checked: false }]
    })
  }

  const handleChecklistCheck = (index, field, val) => {
    const updatedChecklist = [...task.checklist]
    updatedChecklist[index][field] = val
    if(field === 'checked' && val === true){
      task.completedCheckCount++
    }
    else{
        task.completedCheckCount--
    }
    setTask({
        ...task,
        checklist: updatedChecklist
    })
  }

  const handleChecklistText = (index, field, val) => {
    const updatedChecklist = [...task.checklist]
    updatedChecklist[index][field] = val
    setTask({
        ...task,
        checklist: updatedChecklist 
    })
  }

  const handleSubmit = async () => {
    const hasEmptyField = task.checklist.some(check => !check.checkText)

    if (!task.title || !task.priority || hasEmptyField || task.checklist.length < 1) {
      toast.error("Required Fields should not be Empty!")
      return
    }
    try{
      setLoading(true)
      const reqUrl = `${url}/task/update/${taskId}`
      const response = await axios.put(reqUrl, task, {
        headers: {
          'token': `${token}`
        }
      })
      if(response){
        setLoading(false)
        toast.success('Task updated successfully')
        window.location.reload(false)
      }
    } catch (error) {
      toast.error(error.response.data.msg || "Error Occurred")
      setLoading(false)
    }
  }

  const handleEmail = (val) => {
    setTask({
        ...task,
        assignedToEmail: val
    })
    setExpand(false)
  }

  return (
    <>
      <ToastContainer />
      {loading && <div>
        <ClipLoader color={"#36D7B7"} loading={loading} size={150} />
      </div>}
      {!loading && task && <div className='edit-container'><div className='top-div-edit'>
      <div className='title-div-edit'>
        <h3 className='title-para-edit'>Title <span className='star-edit'>*</span></h3>
        <input className='title-inp-edit' value={task.title} onChange={(e) => setTask({...task, title: e.target.value})} placeholder='Enter Task Title'></input>
      </div>
      <div className='prior-div-edit'>
        <h3 className='prior-para-edit'>Select Priority <span className='star-edit'>*</span></h3>
        <button className='high-btn-edit' onClick={() => setTask({...task, priority: 'high'})} style={{backgroundColor: task.priority === 'high' ? '#EEECEC' : ''}}><img src={red} alt='red_img'></img> HIGH PRIORITY</button>
        <button className='mid-btn-edit' onClick={() => setTask({...task, priority: 'mid'})} style={{backgroundColor: task.priority === 'mid' ? '#EEECEC' : ''}}><img src={blue} alt='blue_img'></img> MODERATE PRIORITY</button>
        <button className='low-btn-edit' onClick={() => setTask({...task, priority: 'low'})} style={{backgroundColor: task.priority === 'low' ? '#EEECEC' : ''}}><img src={green} alt='green_img'></img> LOW PRIORITY</button>
      </div>
      <div className='assign-div-edit'>
        <h3 className='assign-para-edit'>Assign to</h3>
        <button className='assign-sel-edit' onClick={() => setExpand(!expand)} disabled={task.createdBy !== userId} style={{cursor: task.createdBy !== userId ? 'not-allowed' : 'pointer'}}>{task.assignedToEmail ? task.assignedToEmail : 'Add a assignee'}<img className='down-img-create' style={{visibility: task.createdBy !== userId ? 'hidden' : 'visible'}} src={downArr1} alt='down_img'></img></button>
        <div className='opt-div-edit'>
          {expand && userEmails.map((user, userIndex) => {
            return (
              <div className='opt-each-div-edit' key={user._id} value={user[0]} onClick={() => handleEmail(user[0])}>
                <div className='opt-d1-edit'>
                  <h3 className='opt-para-edit'>{user[0][0].toUpperCase() + user[0][1].toUpperCase()}</h3>
                </div>
                <h3 className='opt-email-edit'>{user[0]}</h3>
                <button className='opt-btn-edit'>Assign</button>
              </div>
            )
          })}
        </div>
      </div>
      <h3 className='check-para-edit'>Checklist ({task.completedCheckCount}/{task.checklist.length}) <span className='star-edit'>*</span></h3>
      <div className='check-div-edit'>
        {task.checklist.length > 0 && task.checklist.map((each, eachIndex) => {
          return (<div className='check-each-edit' key={eachIndex}>
          {each.checked ? <img className='check-img-edit' src={checkImg} alt='check_img' style={{cursor: 'pointer'}} onClick={() => handleChecklistCheck(eachIndex, 'checked', false)}></img> : <img className='check-img-edit' src={uncheckImg} alt='uncheck_img' style={{cursor: 'pointer'}} onClick={() => handleChecklistCheck(eachIndex, 'checked', true)}></img>}
          <input className='check-inp-edit' value={each.checkText} onChange={(e) => handleChecklistText(eachIndex, 'checkText', e.target.value)}></input>
          {task.checklist.length > 1 && <img className='del-img-edit' src={deleteImg} alt='delete_img' style={{cursor: 'pointer'}} onClick={handleRemoveChecklist}></img>}
          </div>)
        })}
      </div>
      <h3 className='add-btn-edit' onClick={handleAddChecklist}>+ Add New</h3>
    </div>
    <div className='foot-div-edit'>
      <DatePickerWrapper>
        <DatePicker
          selected={task.dueDate}
          onChange={date => setTask({...task, dueDate: date})}
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
      <div className='submit-div-edit'>
        <button className='cncl-btn-edit' onClick={() => setIsEdit(false)}>Cancel</button>
        <button className='save-btn-edit' onClick={handleSubmit}>Save</button>
      </div>
    </div>
    </div>}
    </>
  )
}

export default EditTask
