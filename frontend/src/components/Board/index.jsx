import React, {useState, useEffect} from 'react'
import people from '../../assets/people.png'
import downArr1 from '../../assets/downArr.png'
import ClipLoader from "react-spinners/ClipLoader"
import Backlog from '../Backlog'
import Todo from '../Todo'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import Done from '../Done'
import Progress from '../Progress'
import CreateTask from '../CreateTask'
import EditTask from '../EditTask'
import './index.css'
import axios from 'axios'
const url = 'https://pro-manage-webapp-backend.vercel.app/api'

function Board({isDelete, setIsDelete, isCreate, setIsCreate, isEdit, setIsEdit, isLogout, setIsLogout, isAdd, setIsAdd}) {

  const navigate = useNavigate()
  const Username = sessionStorage.getItem('name')
  const token = sessionStorage.getItem('authToken')
  const [Id, setId] = useState('')
  const [assignee, setAssignee] = useState('')
  const [ellipse, setEllipse] = useState(null)
  const [isContinue, setIsContinue] = useState(false)
  const date = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
  const [userEmails, setUserEmails] = useState([])
  const [boardEmails, setBoardEmails] = useState([])
  const [isError1, setIsError1] = useState(false)
  const [isError2, setIsError2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDate, setIsDate] = useState(false)
  const selectedDate = sessionStorage.getItem('selectedDate')

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
          setUserEmails(response.data.userEmails)
          setBoardEmails(response.data.boardEmails)
        }
      }
      catch(err){
        console.log(err)
      }
    }
    handleUserEmails()
  }, [])

  const handleDelete = async (taskId) => {
    try{
      setLoading(true)
      const reqUrl = `${url}/task/delete/${taskId}`
      const response = await axios.delete(reqUrl, {
        headers: {
          'token': `${token}`
        }
      })
      if(response){
        setIsDelete(false)
        setLoading(false)
        window.location.reload(false)
      }
    }
    catch(error){
      setIsDelete(false)
      console.error(error)
      setLoading(false)
    }
  }

  const closeFlag = () => {
    if(isDelete){
      setIsDelete(false)
    }
    if(ellipse){
      setEllipse(null)
    }
    if(isCreate){
      setIsCreate(false)
    }
    if(isEdit){
      setIsEdit(false)
    }
    if(isLogout){
      setIsLogout(false)
    }
    if(isAdd){
      setIsAdd(false)
    }
  }

  const closeFlag1 = () => {
    if(isDelete){
      setIsDelete(false)
    }
    if(ellipse){
      setEllipse(null)
    }
    if(isCreate){
      setIsCreate(false)
    }
    if(isEdit){
      setIsEdit(false)
    }
    if(isLogout){
      setIsLogout(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.clear()
    navigate('/')
  }

  const handleEmail = async () => {
    setLoading(true)
    if(userEmails && userEmails.includes(assignee) && !boardEmails.includes(assignee)){
      try{
        const reqUrl = `${url}/task/assign-board`
        const response = await axios.post(reqUrl, {email: assignee}, {
          headers: {
            'token': `${token}`
          }
        })
        if(response){
          setIsContinue(true)
          setIsError1(false)
          setIsError2(false)
          setLoading(false)
        }
      }catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    else if(boardEmails.includes(assignee)){
      setIsError2(true)
      setIsError1(false)
      setLoading(false)
    }
    else{
      setIsError1(true)
      setIsError2(false)
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setAssignee('')
    setIsAdd(false)
    setIsError1(false)
    setIsError2(false)
  }

  const handleContinue = () => {
    setAssignee('')
    setIsContinue(false)
    setIsAdd(false)
    window.location.reload(false) 
  }
  
  const handleDate = (val) => {
    sessionStorage.setItem('selectedDate', val)
    window.location.reload(false)
  }

  return (
    <div className='board-container' style={{backgroundColor: isDelete || isCreate || isEdit || isLogout || isAdd ? '#303D438C' : '#FFFFFF'}}>
      <ToastContainer />
      <div className='div1-container-board' onClick={closeFlag}>
        <h3 className='head1-board'>Welcome! {Username}</h3>
        <h3 className='date-board'>{date.getDate()}th {months[date.getMonth()]}, {date.getFullYear()}</h3>
      </div>
      <div className='head2-div-board' onClick={closeFlag1}>
        <div className='board-div-board'>
          <h3 className='head2-board'>Board</h3>
          <h3 className='para1-board' onClick={() => setIsAdd(true)}><img src={people} alt='people_img'></img>&nbsp; Add People</h3>
          <div className='board-d1-board'>
            {boardEmails.length > 0 && boardEmails.map((each, index) => {
              return(
              <div className='each-bdiv-board' key={index}>
                <p className='board-para-board'>{each[0].toUpperCase() + each[1].toUpperCase()}</p>
              </div>)
            })}
          </div>
        </div>
        <h3 className='para2-board' onClick={() => setIsDate(!isDate)}>{selectedDate || 'All'} &nbsp;<img src={downArr1} alt='down_img'></img></h3>
      </div>
      <div className='tasks-container-board' onClick={closeFlag} style={{opacity: isDelete || isCreate || isEdit || isLogout || isAdd ? '0.1' : '1'}}>
        <Backlog isDelete={isDelete} setIsDelete={setIsDelete} isCreate={isCreate} isEdit={isEdit} setId={setId} ellipse={ellipse} setEllipse={setEllipse} setIsEdit={setIsEdit} isLogout={isLogout} isAdd={isAdd} />
        <Todo isDelete={isDelete} setIsDelete={setIsDelete} isCreate={isCreate} isEdit={isEdit} setIsCreate={setIsCreate} setId={setId} ellipse={ellipse} setEllipse={setEllipse} setIsEdit={setIsEdit} isLogout={isLogout} isAdd={isAdd} />
        <Progress isDelete={isDelete} setIsDelete={setIsDelete} isCreate={isCreate} isEdit={isEdit} setId={setId} ellipse={ellipse} setEllipse={setEllipse} setIsEdit={setIsEdit} isLogout={isLogout} isAdd={isAdd} />
        <Done isDelete={isDelete} setIsDelete={setIsDelete} isCreate={isCreate} isEdit={isEdit} setId={setId} ellipse={ellipse} setEllipse={setEllipse} setIsEdit={setIsEdit} isLogout={isLogout} isAdd={isAdd} />
      </div>
      {(!loading && isDelete) && <div className='del-div-board'>
        <h3 className='del-para-board'>Are you sure you want to delete?</h3>
        <div className='del-grid-board'>
          <button className='del-btn-board' onClick={() => handleDelete(Id)}>Yes, Delete</button>
          <button className='del-cncl-board' onClick={() => setIsDelete(false)}>Cancel</button>
        </div>
      </div>}
      {isCreate && <CreateTask setIsCreate={setIsCreate} />}
      {isEdit && <EditTask setIsEdit={setIsEdit} />}
      {isLogout && <div className='logout-div-board'>
        <h3 className='logout-para-board'>Are you sure you want to Logout?</h3>
        <div className='logout-grid-board'>
          <button className='logout-btn-board' onClick={handleLogout}>Yes, Logout</button>
          <button className='logout-cncl-board' onClick={() => setIsLogout(false)}>Cancel</button>
        </div>
      </div>}
      {(!loading && isAdd) && <div className='add-board'>
        {!isContinue ? <div className='add-div-board'><h3 className='add-para-board'>Add people to the board</h3>
        <input className='add-inp-board' value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder='Enter the email'></input>
        {isError1 && <h3 className='add-err-board'>Add App Registered Email only</h3>}
        {isError2 && <h3 className='add-err-board'>Email already added to the Board</h3>}
        <div className='add-grid-board'>
          <button className='add-cncl-board' onClick={handleCancel}>Cancel</button>
          <button className='add-btn-board' onClick={handleEmail}>Add Email</button>
        </div></div> : <div className='ok-div-board'>
          <h3 className='ok-para-board'>{assignee} added to board</h3>
          <button className='ok-btn-board' onClick={handleContinue}>Okay, got it!</button>
        </div>}
      </div>}
      {loading && <div className='add-board'><ClipLoader color="#000" /></div>}
      {isDate && <div className='date-div-board'>
        <h3 className='date-para-board' onClick={() => handleDate('')}>All</h3>
        <h3 className='date-para-board' onClick={() => handleDate('Today')}>Today</h3>
        <h3 className='date-para-board' onClick={() => handleDate('This Week')}>This Week</h3>
        <h3 className='date-para-board' onClick={() => handleDate('This Month')}>This Month</h3>
      </div>}
    </div>
  )
}

export default Board
