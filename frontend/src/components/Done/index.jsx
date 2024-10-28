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
const clientUrl = 'https://pro-manage-cuvette-webapp.vercel.app'

function Done({isDelete, setIsDelete, isCreate, isEdit, setId, ellipse, setEllipse, setIsEdit, isLogout, isAdd}) {

    const token = sessionStorage.getItem('authToken')
    const [expand, setExpand] = useState([])
    const [loading, setLoading] = useState(false)
    const [doneData, setDoneData] = useState([])
    const selectedDate = sessionStorage.getItem('selectedDate')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    sessionStorage.setItem('doneCount', doneData.length)

    const handleDone = async () => {
        try{
            setLoading(true)
            const reqUrl = `${url}/task/done?filter=${selectedDate}`
            const response = await axios.get(reqUrl, {
                headers: {
                    'token': `${token}`
                }
            })
            if(response){
                setDoneData(response.data)
                setLoading(false)
            }
        }
        catch(error){
            setLoading(false)
        }
    }

    useEffect(() => {
        handleDone()
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
    <div className='done-container'>
      <div className='head-container-done'>
        <h3 className='head1-done'>Done</h3>
        <img className='coll-img-done' src={collapse} alt='collapse_img' onClick={handleCloseAll}></img>
      </div>
      {loading && <ClipLoader color="#000" />}
      {!loading && <div className='body-container-done'>
        {doneData.length > 0 && doneData.map((each, eachIndex) => {
            return (
                <div className='body-div-done' key={each._id}>
                    <div className='body-d1-done'>
                        <div className='pri-div-done'>
                          {each.priority === 'low' && <p className='pri-para-done'><img src={green} alt='green_img'></img>&nbsp; LOW PRIORITY</p>}
                          {each.priority === 'mid' && <p className='pri-para-done'><img src={blue} alt='blue_img'></img>&nbsp; MODERATE PRIORITY</p>}
                          {each.priority === 'high' && <p className='pri-para-done'><img src={red} alt='red_img'></img>&nbsp; HIGH PRIORITY</p>}
                          {each.assignedToEmail && <div className='email-div-done'>
                            <p className='email-para-done'>{each.assignedToEmail[0].toUpperCase() + each.assignedToEmail[1].toUpperCase()}</p>
                          </div>}
                        </div>
                        <img className='elli-img-done' src={ellipseImg} alt='ellipse_img' onClick={() => handleEllipse(each._id)}></img>
                        {ellipse === each._id && <div className='pop-div-done'>
                            <h3 className='edit-btn-done' onClick={() => handleEdit(each._id)}>Edit</h3>
                            <h3 className='share-btn-done' onClick={() => handleShare(each._id)}>Share</h3>
                            <h3 className='del-btn-done' onClick={() => handleDeleteCheck(each._id)}>Delete</h3>
                        </div>}
                    </div>
                    <h3 className='head2-done'>{each.title}
                        <span className='head2-para-done'>{each.title}</span>
                    </h3>
                    <div className='check-d1-done'>
                        <h3 className='check-para1-done'>Checklist ({each.completedCheckCount}/{each.checklist.length})</h3>
                        {expand.includes(eachIndex) ? <img className='arrow-img-done' src={upArr} alt='up_img' onClick={() => handleCompress(eachIndex)}></img> : <img className='arrow-img-done' src={downArr} alt='down_img' onClick={() => handleExpand(eachIndex)}></img>}
                    </div>
                    <div className='check-div-done'>
                    {expand.includes(eachIndex) && each.checklist.map((check) => {
                        return (
                            <div className='check-d2-done' key={check._id}>
                                {check.checked ? <img className='check-img-done' src={checkImg} alt='check_img' onClick={() => handleCheck(each._id, check._id)}></img> : <img className='check-img-done' src={uncheckImg} alt='uncheck_img' onClick={() => handleCheck(each._id, check._id)}></img>}
                                <h3 className='check-para2-done'>{check.checkText}</h3>
                            </div>
                        ) 
                    })}
                    </div>
                    <div className='body-d2-done'>
                        {each.dueDate ? <button className='date-btn-done' style={{backgroundColor: '#63C05B', color: '#FFFFFF'}}>{months[new Date(each.dueDate).toLocaleDateString().split('/')[1] - 1]} {new Date(each.dueDate).toLocaleDateString().split('/')[0]}th</button> : <div className='date-btn-done'></div>}
                        <div className='sect-div-done'>
                            <button className='back-btn-done' onClick={() => handleSection(each._id, 'backlog')} disabled={isDelete || isCreate || isLogout || isAdd || isEdit}>BACKLOG</button>
                            <button className='todo-btn-done' onClick={() => handleSection(each._id, 'todo')} disabled={isDelete || isCreate || isLogout || isAdd || isEdit}>TO-DO</button>
                            <button className='pro-btn-done' onClick={() => handleSection(each._id, 'inprogress')} disabled={isDelete || isCreate || isLogout || isAdd || isEdit}>PROGRESS</button>
                        </div>
                    </div>
                </div>
            )
        })}
      </div>}
    </div>
  )
}

export default Done