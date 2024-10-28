import React, {useState, useEffect} from 'react'
import './index.css'
import ClipLoader from "react-spinners/ClipLoader"
import downArr from '../../assets/downArr2.png'
import upArr from '../../assets/upArr.png'
import checkImg from '../../assets/check.png'
import uncheckImg from '../../assets/uncheck.png'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import collapse from '../../assets/collapse.png'
import red from '../../assets/red.png'
import green from '../../assets/green.png'
import ellipseImg from '../../assets/3Ellipse.png'
import blue from '../../assets/blue.png'
import axios from 'axios'
const url = 'https://pro-manage-webapp-backend.vercel.app/api'
const clientUrl = 'https://pro-manage-mern-frontend.vercel.app'

function Backlog({isDelete, setIsDelete, isCreate, isEdit, setId, ellipse, setEllipse, setIsEdit, isLogout, isAdd}) {

    const token = sessionStorage.getItem('authToken')
    const selectedDate = sessionStorage.getItem('selectedDate')
    const [expand, setExpand] = useState([])
    const [loading, setLoading] = useState(false)
    const [backlogData, setBacklogData] = useState([])
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    sessionStorage.setItem('backlogCount', backlogData.length)

    const handleBacklog = async () => {
        try{
            setLoading(true)
            const reqUrl = `${url}/task/backlog?filter=${selectedDate}`
            const response = await axios.get(reqUrl, {
                headers: {
                    'token': `${token}`
                }
            })
            if(response){
                setBacklogData(response.data)
                setLoading(false)
            }
        }
        catch(error){
            setLoading(false)
        }
    }

    useEffect(() => {
        handleBacklog()
    }, [])
    
    const handleExpand = (index) => {
        setExpand([
            ...expand,
            index
        ])
    }
    const handleCompress = (index) => {
        setExpand(expand.filter((each) => each !== index))
    }

    const handleEllipse = (index) => {
        if(ellipse !== index){
            setEllipse(index)
        }
        else{
            setEllipse(null)
        }
    }

    const handleCloseAll = () => {
        setExpand([])
    }

    const handleCheck = async (taskId, checkId) => {
        try{
            const reqUrl = `${url}/task/check/${taskId}/${checkId}`
            const response = await axios.post(reqUrl, {}, {
                headers: {
                    'token': `${token}`
                }
            })
            if(response){
                window.location.reload(false)
            }
        }
        catch(error){
            console.error(error)
        }
    }

    const handleSection = async (taskId, section) => {
        try{
            const reqUrl = `${url}/task/section/${taskId}`
            const response = await axios.patch(reqUrl, {section}, {
                headers: {
                    'token': `${token}`
                }
            })
            if(response){
                window.location.reload(false)
            }
        }
        catch(error){
            console.error(error)
        }
    }

    const copyToClipboard = (link) => {
        navigator.clipboard.writeText(link).then(() => {
          toast.success('Link Copied', {
            position: 'top-right',
            style: {
                width: '15vw',
                backgroundColor: '#F6FFF9',
                boxShadow: '0px 4px 16px 0px #100B2714',
                border: '1px solid #48C1B5',
                borderRadius: '12px',
                color: '#27303A',
                fontFamily: 'Poppins',
                fontSize: '1.2em',
                fontWeight: '600',
                textAlign: 'center',
                left: '5vw'
            },
            autoClose: 2000
          })
        }).catch(err => {
          toast.error('Failed to copy link!', {
            position: 'bottom-center',
            style: {
                width: '15vw',
                backgroundColor: '#F6FFF9',
                boxShadow: '0px 4px 16px 0px #100B2714',
                border: '1px solid #48C1B5',
                borderRadius: '12px',
                color: '#27303A',
                fontFamily: 'Poppins',
                fontSize: '1.2em',
                fontWeight: '600',
                textAlign: 'center',
                left: '5vw'
            },
            autoClose: 2000
          });
          console.error('Failed to copy: ', err);
        });
      };

    const handleShare = (id) => {
        const link = `${clientUrl}/${id}/read-task`
        copyToClipboard(link)
    }

    const handleDeleteCheck = (id) => {
        setIsDelete(true)
        setId(id)
    }

    const handleEdit = (id) => {
        setIsEdit(true)
        sessionStorage.setItem('taskId', id)
    }

  return (
    <div className='back-container'>
      <div className='head-container-back'>
        <h3 className='head1-back'>Backlog</h3>
        <img className='coll-img-back' src={collapse} alt='collapse_img' onClick={handleCloseAll}></img>
      </div>
      {loading && <ClipLoader color="#000" />}
      {!loading && <div className='body-container-back'>
        {backlogData.length > 0 && backlogData.map((each, eachIndex) => {
            return (
                <div className='body-div-back' key={each._id}>
                    <div className='body-d1-back'>
                        <div className='pri-div-back'>
                          {each.priority === 'low' && <p className='pri-para-back'><img src={green} alt='green_img'></img>&nbsp; LOW PRIORITY</p>}
                          {each.priority === 'mid' && <p className='pri-para-back'><img src={blue} alt='blue_img'></img>&nbsp; MODERATE PRIORITY</p>}
                          {each.priority === 'high' && <p className='pri-para-back'><img src={red} alt='red_img'></img>&nbsp; HIGH PRIORITY</p>}
                          {each.assignedToEmail && <div className='email-div-back'>
                            <p className='email-para-back'>{each.assignedToEmail[0].toUpperCase() + each.assignedToEmail[1].toUpperCase()}</p>
                          </div>}
                        </div>
                        <img className='elli-img-back' src={ellipseImg} alt='ellipse_img' onClick={() => handleEllipse(each._id)}></img>
                        {ellipse === each._id && <div className='pop-div-back'>
                            <h3 className='edit-btn-back' onClick={() => handleEdit(each._id)}>Edit</h3>
                            <h3 className='share-btn-back' onClick={() => handleShare(each._id)}>Share</h3>
                            <h3 className='del-btn-back' onClick={() => handleDeleteCheck(each._id)}>Delete</h3>
                        </div>}
                    </div>
                    <h3 className='head2-back'>{each.title}
                      <span className='head2-para-back'>{each.title}</span>
                    </h3>
                    <div className='check-d1-back'>
                        <h3 className='check-para1-back'>Checklist ({each.completedCheckCount}/{each.checklist.length})</h3>
                        {expand.includes(eachIndex) ? <img className='arrow-img-back' src={upArr} alt='up_img' onClick={() => handleCompress(eachIndex)}></img> : <img className='arrow-img-back' src={downArr} alt='down_img' onClick={() => handleExpand(eachIndex)}></img>}
                    </div>
                    <div className='check-div-back'>
                    {expand.includes(eachIndex) && each.checklist.map((check) => {
                        return (
                            <div className='check-d2-back' key={check._id}>
                                {check.checked ? <img className='check-img-back' src={checkImg} alt='check_img' onClick={() => handleCheck(each._id, check._id)}></img> : <img className='check-img-back' src={uncheckImg} alt='uncheck_img' onClick={() => handleCheck(each._id, check._id)}></img>}
                                <h3 className='check-para2-back'>{check.checkText}</h3>
                            </div>
                        )
                    })}
                    </div>
                    <div className='body-d2-back'>
                        {each.dueDate ? <button className='date-btn-back' style={{backgroundColor: each.priority === 'high' || new Date(each.dueDate).toLocaleDateString() < new Date().toLocaleDateString() ? '#CF3636' : '#EEECEC', color: each.priority === 'high' || new Date(each.dueDate).toLocaleDateString() < new Date().toLocaleDateString() ? '#FFFFFF' : '#767575'}}>{months[new Date(each.dueDate).toLocaleDateString().split('/')[1] - 1]} {new Date(each.dueDate).toLocaleDateString().split('/')[0]}th</button> : <div className='date-btn-back'></div>}
                        <div className='sect-div-back'>
                            <button className='pro-btn-back' onClick={() => handleSection(each._id, 'inprogress')} disabled={isDelete || isCreate || isLogout || isAdd || isEdit}>PROGRESS</button>
                            <button className='todo-btn-back' onClick={() => handleSection(each._id, 'todo')} disabled={isDelete || isCreate || isLogout || isAdd || isEdit}>TO-DO</button>
                            <button className='done-btn-back' onClick={() => handleSection(each._id, 'done')} disabled={isDelete || isCreate || isLogout || isAdd || isEdit}>DONE</button>
                        </div>
                    </div>
                </div>
            )
        })}
      </div>}
    </div>
  )
}

export default Backlog
