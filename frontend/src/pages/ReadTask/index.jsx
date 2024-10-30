import React, {useState, useEffect} from 'react'
import './index.css'
import ClipLoader from "react-spinners/ClipLoader"
import appLogo from '../../assets/appLogo.png'
import checkImg from '../../assets/check.png'
import uncheckImg from '../../assets/uncheck.png'
import red from '../../assets/red.png'
import green from '../../assets/green.png'
import blue from '../../assets/blue.png'
import axios from 'axios'
import { useParams } from 'react-router-dom'
const url = 'https://pro-manage-webapp-backend.vercel.app/api'

function ReadTask() {

  const {id} = useParams()
  const [task, setTask] = useState({})
  const [loading, setLoading] = useState(true)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const taskId = id

  const fetchTask = async () => {
    try{
      const reqUrl = `${url}/task/each/${taskId}`
      const response = await axios.get(reqUrl)
      if(response){
        setTask(response.data)
        setLoading(false)
      }
    }
    catch(error){
      console.error(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTask()
  }, [])

  return (
    <div className='read-container'>
      <div className='head-div-read'>
        <img className='head-img-read' src={appLogo} alt='app_img'></img>
        <h3 className='head-para-read'>Pro Manage</h3>
      </div>
      {loading && <div><ClipLoader color={"#36D7B7"} loading={loading} size={100} /></div>}
      {!loading && <div className='body-div-read'>
        {task.priority === 'low' && <span className='pri-para-read'><img src={green} alt='green_img'></img>&nbsp; LOW PRIORITY</span>}
        {task.priority === 'mid' && <span className='pri-para-read'><img src={blue} alt='blue_img'></img>&nbsp; MODERATE PRIORITY</span>}
        {task.priority === 'high' && <span className='pri-para-read'><img src={red} alt='red_img'></img>&nbsp; HIGH PRIORITY</span>}
        <h3 className='body-head-read'>{task.title}
          <span className='body-head-para-read'>{task.title}</span>
        </h3>
        <div className='check-div-read'>
          <h3 className='check-para1-read'>Checklist ({task.completedCheckCount}/{task.checklist.length})</h3>
          <div className='check-each-div-read'>
            {task.checklist.map((each, eachIndex) => {
              return (<div className='check-each-read' key={eachIndex}>
                {each.checked ? <img className='check-img-read' src={checkImg} alt='check_img'></img> : <img className='check-img-read' src={uncheckImg} alt='uncheck_img'></img>}
                <h3 className='check-para2-read'>{each.checkText}</h3>
              </div>)
            })}
          </div>
        </div>
        {task.dueDate && <div className='date-div-read'>
          <h3 className='date-para-read'>Due Date</h3>
          <button className='date-no-read'>{months[new Date(task.dueDate).toLocaleDateString().split('/')[1] - 1]} {new Date(task.dueDate).toLocaleDateString().split('/')[0]}</button>
        </div>}
      </div>}
    </div>
  )
}

export default ReadTask
