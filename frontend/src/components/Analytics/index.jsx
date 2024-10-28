import React, {useState, useEffect} from 'react'
import './index.css'
import skyblue from '../../assets/skyblue.png'
import ClipLoader from "react-spinners/ClipLoader"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
const url = 'https://pro-manage-mern-backend.vercel.app/api'

function Analytics() {

    const token = sessionStorage.getItem('authToken')
    const userId = sessionStorage.getItem('userId')
    const backlogs = sessionStorage.getItem('backlogCount')
    const todos = sessionStorage.getItem('todoCount')
    const progresses = sessionStorage.getItem('progressCount')
    const dones = sessionStorage.getItem('doneCount')
    const [loading, setLoading] = useState(false)
    const [low, setLow] = useState(0)
    const [mid, setMid] = useState(0)
    const [high, setHigh] = useState(0)
    const [due, setDue] = useState(0)

    const handleAnaly = async () => {
        try{
            setLoading(true)
            const reqUrl = `${url}/user/get/${userId}`
            const response = await axios.get(reqUrl, {
                headers: {
                    'token': `${token}`
                }
            })
            if(response){
                setLow(response.data.lowCount)
                setMid(response.data.midCount)
                setHigh(response.data.highCount)
                setDue(response.data.dueDateCount)
                setLoading(false)
            }
        }
        catch(error){
            setLoading(false)
        }
    }

    useEffect(() => {
        handleAnaly()
    }, [])

  return (
    <div className='analy-container'>
      <ToastContainer />
      <h3 className='analy-head'>Analytics</h3> 
      {loading && <div style={{position: 'relative', left:'40vw'}}><ClipLoader color={"#36D7B7"} loading={loading} size={100} /></div>}
      {!loading && <div className='analy-div-container'>
        <div className='div1-analy'>
            <div className='backlog-div-analy'>
                <p className='backlog-para-analy'><img className='img-analy' src={skyblue} alt='skyblue_img'></img>Backlog Tasks</p>
                <p className='backlog-no-analy'>{backlogs}</p>
            </div>
            <div className='todo-div-analy'>
                <p className='todo-para-analy'><img className='img-analy' src={skyblue} alt='skyblue_img'></img>To-do Tasks</p>
                <p className='todo-no-analy'>{todos}</p>
            </div>
            <div className='prog-div-analy'>
                <p className='prog-para-analy'><img className='img-analy' src={skyblue} alt='skyblue_img'></img>In-Progress Tasks</p>
                <p className='prog-no-analy'>{progresses}</p>
            </div>
            <div className='done-div-analy'>
                <p className='done-para-analy'><img className='img-analy' src={skyblue} alt='skyblue_img'></img>Completed Tasks</p>
                <p className='done-no-analy'>{dones}</p>
            </div>
        </div>
        <div className='div2-analy'>
            <div className='low-div-analy'>
                <p className='low-para-analy'><img className='img-analy' src={skyblue} alt='skyblue_img'></img>Low Priority</p>
                <p className='low-no-analy'>{low}</p>
            </div>
            <div className='mid-div-analy'>
                <p className='mid-para-analy'><img className='img-analy' src={skyblue} alt='skyblue_img'></img>Moderate Priority</p>
                <p className='mid-no-analy'>{mid}</p>
            </div>
            <div className='high-div-analy'>
                <p className='high-para-analy'><img className='img-analy' src={skyblue} alt='skyblue_img'></img>High Priority</p>
                <p className='high-no-analy'>{high}</p>
            </div>
            <div className='due-div-analy'>
                <p className='due-para-analy'><img className='img-analy' src={skyblue} alt='skyblue_img'></img>Due Date Tasks</p>
                <p className='due-no-analy'>{due}</p>
            </div>
        </div>
      </div>}
    </div>
  )
}

export default Analytics
