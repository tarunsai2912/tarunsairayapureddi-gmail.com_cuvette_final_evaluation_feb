import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Board from '../../components/Board'
import Settings from '../../components/Settings'
import Analytics from '../../components/Analytics'
import SideBar from '../../components/SideBar'
import './index.css'

function HomePage() {

  const [showBoard, setShowBoard] = useState(true)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isToken, setIsToken] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isLogout, setIsLogout] = useState(false)
  const [isAdd, setIsAdd] = useState(false)

  const navigate = useNavigate()
  const token = sessionStorage.getItem('authToken')

  const handleDashboard = () => {
    setShowBoard(true)
    setShowAnalytics(false)
    setShowSettings(false)
  }

  const handleAnalytics = () => {
    setShowAnalytics(true)
    setShowBoard(false)
    setShowSettings(false)
  }

  const handleSettings = () => {
    setShowSettings(true)
    setShowAnalytics(false)
    setShowBoard(false)
  }

  const tokenCheck = () => {
    if(token){
      setIsToken(true)
    }
    else{
      navigate('/')
    }
  }

  useEffect(() => {
    tokenCheck()
  }, [])

  return (
    <>
      {isToken && 
      <div className='home-container'>
        <div className='grid1-home' style={{borderRight: isDelete || isCreate || isEdit || isLogout || isAdd ? '' : '1px solid #EDF5FE'}}>
          <SideBar isDelete={isDelete} setIsDelete={setIsDelete} isCreate={isCreate} setIsCreate={setIsCreate} isEdit={isEdit} setIsEdit={setIsEdit} isLogout={isLogout} setIsLogout={setIsLogout} isAdd={isAdd} setIsAdd={setIsAdd} handleDashboard={handleDashboard} handleAnalytics={handleAnalytics} handleSettings={handleSettings} />
        </div>
        <div className='grid2-home'>
          {showBoard && <Board isDelete={isDelete} setIsDelete={setIsDelete} isCreate={isCreate} setIsCreate={setIsCreate} isEdit={isEdit} setIsEdit={setIsEdit} isLogout={isLogout} setIsLogout={setIsLogout} isAdd={isAdd} setIsAdd={setIsAdd} />}
          {showAnalytics && <Analytics />}
          {showSettings && <Settings />}
        </div>
      </div>}
    </>
  )
}

export default HomePage
