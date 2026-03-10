import React, { useEffect, useState } from 'react'
import style from './alert.module.css'
import { MdOutlineWarning } from "react-icons/md";
import { MdOutlineDoneAll } from "react-icons/md";
import { VscError } from "react-icons/vsc";

const Alert = ({showAlert, setShowAlert, duration
}) => {
    // Встановлюю стан для відображення повідомлень по таймеру
    useEffect(() => {
        if(!showAlert || !showAlert.visible) return
        const timer = setTimeout(() => {
            setShowAlert(prev => ({...prev, visible: false}))
        }, duration)

        return () => clearTimeout(timer)
    }, [showAlert, duration])

    if(!showAlert || !showAlert.visible) return


  return (
    <div>
        {showAlert.visible && 
            <div className={style.modalActive}>
                {showAlert.type === 'success' && 
                    <div className={style.alertSucces}>
                            <h4 style={{margin: 0}}><MdOutlineDoneAll color='#20aa3eff'/> Успіх: {showAlert.message}</h4>
                    </div>
                }
                {showAlert.type === 'warning' && 
                    <div>
                        <div className={style.alertWorning}>
                            <h4 style={{margin: 0}}><MdOutlineWarning color='#ebaf09'/> Попередження: {showAlert.message}</h4>
                        </div>
                    </div>
                }
                {showAlert.type === 'error' && 
                    <div>
                        <div className={style.alertError}>
                            <h4 style={{margin: 0}}><VscError color='#df222cff'/> Помилка: {showAlert.message}</h4>
                        </div>
                    </div>
                }
            </div>
            
        }
    </div>
      
  )
}

export default Alert
