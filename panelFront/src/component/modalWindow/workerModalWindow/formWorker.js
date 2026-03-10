import React, { useState } from 'react'
import style from './formWorker.module.css'
import { IoMdCloseCircle } from "react-icons/io";
import Alert from '../alert/alert';

const FormWorker = ({setFormWorker, formWorker, showWorker, showAlert, 
    setShowAlert}) => {

    const initialWorker = {
        name: '',
        surname: '',
        pobatkovi: '',
        phone:'',
        typeWorker: '',
        city: '',
        nameWorkType: '',
        stavka: ''
    }

    const [worker, setWorker] = useState(initialWorker)

    const addNewWorker = async () => {
        try {
            const response = await fetch('/api/worker/addNewWorker', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(worker)
            })
            const data = await response.json()

            if(!response.ok){
                throw new Error(data.message)
            }
            setFormWorker(false)
            setShowAlert({type: 'success', visible: true, message: data.message})
            showWorker()
            setWorker(initialWorker)
        } catch (error) {
            if(error.message.includes('Не всі поля заповнені')){
                setFormWorker(false)
                setShowAlert({type: 'warning', visible: true, message: error.message})
                setWorker(initialWorker)
            } else {
                setFormWorker(false)
                setShowAlert({type: 'error', visible: true, message: error.message})
                setWorker(initialWorker)
            }
        }
    }


  return (
    <div>
        {/* Повідомлення */}
        {showAlert.visible && 
            <Alert 
                showAlert={showAlert}
                setShowAlert={setShowAlert}
                duration={3000}
            />
        }
      {formWorker && 
        <div className={style.modalActive}>
            <div className={style.modalContent}>
                <IoMdCloseCircle className={style.closeIcon} onClick={() => setFormWorker(false)}/>
                <h4 style={{margin: 0}}>Додати працівника</h4>
                    <label className={style.editPole}>
                        Імя
                        <input 
                        value={worker.name}
                        onChange={(e) => setWorker({...worker, name: e.target.value})}
                        className={style.edidContentPole}
                        />
                    </label>
                    <label className={style.editPole}>
                        Прізвище
                        <input 
                        value={worker.surname}
                        onChange={(e) => setWorker({...worker, surname: e.target.value})}
                        className={style.edidContentPole}
                        />
                    </label>
                    <label className={style.editPole}>
                        Побатькові
                        <input 
                        value={worker.pobatkovi}
                        onChange={(e) => setWorker({...worker, pobatkovi: e.target.value})}
                        className={style.edidContentPole}
                        />
                    </label>
                    <label className={style.editPole}>
                        Телефон
                        <input 
                        value={worker.phone}
                        onChange={(e) => setWorker({...worker, phone: e.target.value})}
                        className={style.edidContentPole}
                        />
                    </label>
                    <label className={style.editPole}>
                        Місто проживання
                        <input 
                        value={worker.city}
                        onChange={(e) => setWorker({...worker, city: e.target.value})}
                        className={style.edidContentPole}
                        />
                    </label>
                    <label className={style.editPole}>
                        Тип найму
                        <input 
                        value={worker.typeWorker}
                        onChange={(e) => setWorker({...worker, typeWorker: e.target.value})}
                        className={style.edidContentPole}
                        />
                    </label>
                    <label className={`${style.editPole} ${style.emailField}`}>
                        Посада
                        <input 
                        value={worker.nameWorkType}
                        onChange={(e) => setWorker({...worker, nameWorkType: e.target.value})}
                        className={style.edidContentPole}
                        />
                    </label>
                    <label className={`${style.editPole} ${style.commentField}`}>
                        Ставка
                        <input 
                        value={worker.stavka}
                        onChange={(e) => setWorker({...worker, stavka: e.target.value})}
                        className={style.edidContentPole}
                        />
                    </label>
                    <button onClick={() => addNewWorker()} className={style.btnSendWorkerInfo}>
                        Додати
                    </button>
            </div>
        </div>
      }
    </div>
  )
}

export default FormWorker
