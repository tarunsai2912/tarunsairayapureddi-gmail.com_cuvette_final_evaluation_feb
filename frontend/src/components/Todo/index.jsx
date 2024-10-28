import React, {useState, useEffect} from 'react'
import './index.css'
import ClipLoader from "react-spinners/ClipLoader"
import downArr from '../../assets/downArr2.png'
import upArr from '../../assets/upArr.png'
import checkImg from '../../assets/check.png'
import uncheckImg from '../../assets/uncheck.png'
import collapse from '../../assets/collapse.png'
import addImg from '../../assets/add.png'
import red from '../../assets/red.png'
import green from '../../assets/green.png'
import ellipseImg from '../../assets/3Ellipse.png'
import blue from '../../assets/blue.png'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
const url = 'https://pro-manage-mern-backend.vercel.app/api'
const clientUrl = 'https://pro-manage-mern-frontend.vercel.app'

function Todo({isDelete, setIsDelete, isCreate, isEdit, setIsCreate, setId, ellipse, setEllipse, setIsEdit, isLogout, isAdd}) {

    const token = sessionStorage.getItem('authToken')
    const [expand, setExpand] = useState([])
    const [loading, setLoading] = useState(false)
    const selectedDate = sessionStorage.getItem('selectedDate')
    const [todoData, setTodoData] = useState([])
    sessionStorage.setItem('todoCount', todoData.length)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const handleTodo = async () => {
        try{
            setLoading(true)
            const reqUrl = `${url}/task/todo?filter=${selectedDate}`
            const response = await axios.get(reqUrl, {
                headers: {
                    'token': `${token}`
                }
            })
            if(response){
                setTodoData(response.data)
                setLoading(false)
            }
        }
        catch(error){
            setLoading(false)
        }
    }

    useEffect(() => {
        handleTodo()
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
    <div className='todo-container'>
      <div className='head-container-todo'>
        <h3 className='head1-todo'>To do</h3>
        <div className='log-div-todo'>
          <img className='add-img-todo' src={addImg} alt='add_img' onClick={() => setIsCreate(true)}></img>
          <img className='coll-img-todo' src={collapse} alt='collapse_img' onClick={handleCloseAll}></img>
        </div>
      </div>
      {loading && <ClipLoader color="#000" />}
      {!loading && <div className='body-container-todo'>
        {todoData.length > 0 && todoData.map((each, eachIndex) => {
            return (
                <div className='body-div-todo' key={each._id}>
                    <div className='body-d1-todo'>
                        <div className='pri-div-todo'>
                          {each.priority === 'low' && <p className='pri-para-todo'><img src={green} alt='green_img'></img>&nbsp; LOW PRIORITY</p>}
                          {each.priority === 'mid' && <p className='pri-para-todo'><img src={blue} alt='blue_img'></img>&nbsp; MODERATE PRIORITY</p>}
                          {each.priority === 'high' && <p className='pri-para-todo'><img src={red} alt='red_img'></img>&nbsp; HIGH PRIORITY</p>}
                          {each.assignedToEmail && <div className='email-div-todo'>
                            <p className='email-para-todo'>{each.assignedToEmail[0].toUpperCase() + each.assignedToEmail[1].toUpperCase()}</p>
                          </div>}
                        </div>
                        <img className='elli-img-todo' src={ellipseImg} alt='ellipse_img' onClick={() => handleEllipse(each._id)}></img>
                        {ellipse === each._id && <div className='pop-div-todo'>
                            <h3 className='edit-btn-todo' onClick={() => handleEdit(each._id)}>Edit</h3>
                            <h3 className='share-btn-todo' onClick={() => handleShare(each._id)}>Share</h3>
                            <h3 className='del-btn-todo' onClick={() => handleDeleteCheck(each._id)}>Delete</h3>
                        </div>}
                    </div>
                    <h3 className='head2-todo'>{each.title}
                        <span className='head2-para-todo'>{each.title}</span>
                    </h3>
                    <div className='check-d1-todo'>
                        <h3 className='check-para1-todo'>Checklist ({each.completedCheckCount}/{each.checklist.length})</h3>
                        {expand.includes(eachIndex) ? <img className='arrow-img-todo' src={upArr} alt='up_img' onClick={() => handleCompress(eachIndex)}></img> : <img className='arrow-img-todo' src={downArr} alt='down_img' onClick={() => handleExpand(eachIndex)}></img>}
                    </div>
                    <div className='check-div-todo'>
                    {expand.includes(eachIndex) && each.checklist.map((check) => {
                        return (
                            <div className='check-d2-todo' key={check._id}>
                                {check.checked ? <img className='check-img-todo' src={checkImg} alt='check_img' onClick={() => handleCheck(each._id, check._id)}></img> : <img className='check-img-todo' src={uncheckImg} alt='uncheck_img' onClick={() => handleCheck(each._id, check._id)}></img>}
                                <h3 className='check-para2-todo'>{check.checkText}</h3>
                            </div>
                        )
                    })}
                    </div>
                    <div className='body-d2-todo'>
                        {each.dueDate ? <button className='date-btn-todo' style={{backgroundColor: each.priority === 'high'  || new Date(each.dueDate).toLocaleDateString() < new Date().toLocaleDateString() ? '#CF3636' : '#EEECEC', color: each.priority === 'high' || new Date(each.dueDate).toLocaleDateString() < new Date().toLocaleDateString() ? '#FFFFFF' : '#767575'}}>{months[new Date(each.dueDate).toLocaleDateString().split('/')[1] - 1]} {new Date(each.dueDate).toLocaleDateString().split('/')[0]}th</button> : <div className='date-btn-todo'></div>}
                        <div className='sect-div-todo'>
                            <button className='back-btn-todo' onClick={() => handleSection(each._id, 'backlog')} disabled={isDelete || isCreate || isLogout || isAdd || isEdit}>BACKLOG</button>
                            <button className='pro-btn-todo' onClick={() => handleSection(each._id, 'inprogress')} disabled={isDelete || isCreate || isLogout || isAdd || isEdit}>PROGRESS</button>
                            <button className='done-btn-todo' onClick={() => handleSection(each._id, 'done')} disabled={isDelete || isCreate || isLogout || isAdd || isEdit}>DONE</button>
                        </div>
                    </div>
                </div>
            )
        })}
      </div>}
    </div>
  )
}

export default Todo
