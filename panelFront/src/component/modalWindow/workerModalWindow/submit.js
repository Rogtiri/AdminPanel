import React, { useState } from 'react'
import style from './submit.module.css'
import { IoMdCloseCircle } from "react-icons/io";

const Submit = ({isOpen, onClose, workerId, refresh, setShowAlert, pageStatus,
 delOrExt
}) => {

  const handleAction = async (action) => {
      try {
        let url, method
        switch(action){
          case 'delete':
            url = `${process.env.REACT_APP_API_URL}/api/worker/deleteWorker/${workerId}`
            method = 'DELETE'
            break;
          case 'extend':
            url = `${process.env.REACT_APP_API_URL}/api/worker/inWork/${workerId}`
            method = 'POST'
            break;
          case 'archive':
            url = `${process.env.REACT_APP_API_URL}/api/worker/inArhive/${workerId}`
            method = 'POST'
            break;
        }

        const res = await fetch(url, {method})
        const result = await res.json()
        onClose()
        setShowAlert({type: 'success', visible: true, message: result.message})
        refresh()
        if(!res.ok) throw new Error(result.message)

      } catch (error) {
        setShowAlert({type: 'error', visible: true, message: error.message})
        onClose()
      }
  }



  return (
    <div>
        {isOpen && 
            <div className={style.modalActive}>
              {pageStatus === 'workers' && 
                <div className={style.modalContent}>
                    <IoMdCloseCircle className={style.closeIcon} onClick={onClose} />
                    <h4 style={{margin: 0}}>Впевнений що хочеш звільнити працівника? Він буде переведений до архіву</h4>
                    <div>
                        <button onClick={() => handleAction('archive')} className={style.agree}>Так</button>
                        <button onClick={onClose} className={style.cancel}>Ні</button>
                    </div>
                </div>
              }
              {pageStatus === 'archive' && 
              <div>
                {delOrExt === 'delete' && 
                  <div className={style.modalContent}>
                    <IoMdCloseCircle className={style.closeIcon} onClick={onClose} />
                    <h4 style={{margin: 0}}>Впевнений що хочеш звільнити працівника? Його буде неможливо відновити</h4>
                    <div>
                        <button onClick={() => handleAction('delete')} className={style.agree}>Так</button>
                        <button onClick={onClose} className={style.cancel}>Ні</button>
                    </div>
                  </div>
                }
                {delOrExt === 'extend' && 
                  <div className={style.modalContent}>
                    <IoMdCloseCircle className={style.closeIcon} onClick={onClose} />
                    <h4 style={{margin: 0}}>Впевнений що хочеш повернути працівника?</h4>
                    <div>
                        <button onClick={() => handleAction('extend')} className={style.agree}>Так</button>
                        <button onClick={onClose} className={style.cancel}>Ні</button>
                    </div>
                  </div>
                }
              </div>
                
              }
            </div>
        }    
    </div>  
    
  )
}

export default Submit
