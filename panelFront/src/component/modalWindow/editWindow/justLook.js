
import React, { useEffect, useState } from 'react'
import style from './editWindow.module.css'
import { IoMdCloseCircle } from "react-icons/io";

const ViewWindow = ({active, setActive, id, pageStatus}) => {

  const [orderData, setOrderData] = useState({
    typeProject: '',
    name: '',
    phone: '',
    email: '',
    budjet: '',
    comment: '',
    status:''
  })
  const [workerInfo, setWorkerInfo] = useState({
    name: '',
    surname: '',
    pobatkovi: '',
    phone:'',
    typeWorker: '',
    city: '',
    nameWorkType: '',
    stavka: ''
  })

  useEffect(() => {
    if (!id || !active.look) {
      setOrderData({ typeProject: '', name: '', phone: '', email: '', budjet: '', comment: '', status: '' })
      setWorkerInfo({ name: '', surname: '', pobatkovi: '', phone: '', typeWorker: '', city: '', nameWorkType: '', stavka: '' })
      return
    }
    const config = {
      orders: {url: `${process.env.REACT_APP_API_URL}/api/take/takeOrderForEdit?idOrder=${id}`},
      workers: {url: `${process.env.REACT_APP_API_URL}/api/worker/takeWorkerForEdit?idWorker=${id}`},
      archive: {url: `${process.env.REACT_APP_API_URL}/api/worker/takeWorkerForEdit?idWorker=${id}`}
    }
    const url = config[pageStatus]?.url
    if (!url) return;


    const take = async () => {
      const find = await fetch(url)
      const result = await find.json()
      if(pageStatus === 'orders'){
        setOrderData(result)
      } else if(pageStatus === 'workers'){
        setWorkerInfo(result)
      } else if(pageStatus === 'archive'){
        setWorkerInfo(result)
      } 
    }

    take()
  }, [id, pageStatus, active.look])

  return (
    <>
    {pageStatus === 'orders' && 
      active.look && (
        <div className={style.modalActive} >
          <div className={style.modalContent}>
            <IoMdCloseCircle className={style.closeIcon} onClick={() => setActive(prev => ({...prev, look: false}))}/>
            <span>Перегляд Замовлення</span>
            <div className={style.modalContentPole}>
              <div className={style.editPole}>
                <strong>Ім'я:</strong> {orderData.name}
              </div>
              <div className={style.editPole}>
                <strong>Тип проекту:</strong> {orderData.typeProject}
              </div>
              <div className={style.editPole}>
                <strong>Телефон:</strong> {orderData.phone}
              </div>
              <div className={style.editPole}>
                <strong>Ціна:</strong> {orderData.budjet}
              </div>
              <div className={`${style.editPole} ${style.emailField}`}>
                <strong>Email:</strong> {orderData.email}
              </div>
              <div className={`${style.editPole} ${style.commentField}`}>
                <strong>Коментарі:</strong> {orderData.comment}
              </div>
            </div>
            <div className={style.changeStatusContainer}>
              <div>
                <strong>Статус замовлення: </strong> {orderData.status}
              </div>
            </div>
          </div> 
        </div>
      )}
      {(pageStatus === 'workers' || pageStatus === 'archive') && 
      active.look && (
        <div className={style.modalActive} >
          <div className={style.modalContent}>
            <IoMdCloseCircle className={style.closeIcon} onClick={() => setActive(prev => ({...prev, look: false}))}/>
            <span>Повна інформація працівника</span>
            <div className={style.modalContentPole}>
              <div className={style.editPole}>
                <strong>ПІБ:</strong> {workerInfo.name} {workerInfo.surname} {workerInfo.pobatkovi}
              </div>
              <div className={style.editPole}>
                <strong>Телефон:</strong> {workerInfo.phone}
              </div>
              <div className={style.editPole}>
                <strong>Тип найму:</strong> {workerInfo.typeWorker}
              </div>
              <div className={style.editPole}>
                <strong>Місто:</strong> {workerInfo.city}
              </div>
              <div className={`${style.editPole} ${style.emailField}`}>
                <strong>Посада:</strong> {workerInfo.nameWorkType}
              </div>
              <div className={`${style.editPole} ${style.commentField}`}>
                <strong>Ставка:</strong> {workerInfo.stavka}
              </div>
            </div>
          </div> 
        </div>
      )}
    </>
  )
}

export default ViewWindow

