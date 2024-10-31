import React, {useState} from 'react'
import appLogo from '../../assets/appLogo.png'
import analytics from '../../assets/anly.png'
import board from '../../assets/board.png'
import settings from '../../assets/settings.png'
import analytics1 from '../../assets/analy1.png'
import board1 from '../../assets/board1.png'
import settings1 from '../../assets/settings1.png'
import logout from '../../assets/logout.png'
import './index.css'

function SideBar({isDelete, setIsDelete, isCreate, setIsCreate, isEdit, setIsEdit, isLogout, setIsLogout, isAdd, setIsAdd, handleDashboard, handleAnalytics, handleSettings}) {

  const [isClickedDash, setIsClickedDash] = useState(true)
  const [isClickedAnaly, setIsClickedAnaly] = useState(false)
  const [isClickedSet, setIsClickedSet] = useState(false)

  const handleDash = () => {
    setIsClickedDash(true)
    setIsClickedAnaly(false)
    setIsClickedSet(false)
  }

  const handleAnaly = () => {
    setIsClickedDash(false)
    setIsClickedAnaly(true)
    setIsClickedSet(false)
  }

  const handleSet = () => {
    setIsClickedDash(false)
    setIsClickedAnaly(false)
    setIsClickedSet(true)
  }

  const handleDashClick = () => {
    handleDashboard()
    handleDash()
  }

  const handleAnalyClick = () => {
    handleAnalytics()
    handleAnaly()
  }

  const handleSetClick = () => {
    handleSet()
    handleSettings()
  }

  const closeFlag = () => {
    if(isDelete){
      setIsDelete(false)
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

  return (
    <div className='sidebar-container' style={{backgroundColor: isDelete || isCreate || isEdit || isLogout || isAdd ? '#303D438C' : '#FFFFFF'}} onClick={closeFlag}>
      <div className='head-div-sidebar' style={{opacity: isDelete || isCreate || isEdit || isLogout || isAdd ? '0.1' : '1'}}>
        <img className='img-sidebar' src={appLogo} alt='app_img'></img>
        <h1 className='head-sidebar' onClick={handleDashClick}>Pro Manage</h1>
      </div>
      <div className='mid-div-sidebar' style={{opacity: isDelete || isCreate || isEdit || isLogout || isAdd ? '0.1' : '1'}}>
        <div className='board-sidebar' onClick={handleDashClick} style={{backgroundColor: isClickedDash ? '#4391ED1A' : ''}}>
          {isClickedDash ? <img className='board-img-sidebar' src={board1} alt='board_img'></img> : <img className='board-img-sidebar' src={board} alt='board_img'></img>}
          <p className='board-para-sidebar' style={{color: isClickedDash ? '#000000' : '#707070'}}>Board</p>
        </div>
        <div className='analy-sidebar' onClick={handleAnalyClick} style={{backgroundColor: isClickedAnaly ? '#4391ED1A' : ''}}>
          {isClickedAnaly ? <img className='analy-img-sidebar' src={analytics1} alt='analy_img'></img> : <img className='analy-img-sidebar' src={analytics} alt='analy_img'></img>}
          <p className='analy-para-sidebar' style={{color: isClickedAnaly ? '#000000' : '#707070'}}>Analytics</p>
        </div>
        <div className='set-sidebar' onClick={handleSetClick} style={{backgroundColor: isClickedSet ? '#4391ED1A' : ''}}>
          {isClickedSet ? <img className='set-img-sidebar' src={settings1} alt='set_img'></img> : <img className='set-img-sidebar' src={settings} alt='set_img'></img>}
          <p className='set-para-sidebar' style={{color: isClickedSet ? '#000000' : '#707070'}}>Settings</p>
        </div>
      </div>
      <div className='logout-div-sidebar' onClick={() => setIsLogout(true)} style={{opacity: isDelete || isCreate || isEdit || isLogout || isAdd ? '0.1' : '1'}}>
        <img className='logout-img-sidebar' src={logout} alt='logout_img'></img>
        <p className='logout-para-sidebar'>Log out</p>
      </div>
    </div>
  )
}

export default SideBar
