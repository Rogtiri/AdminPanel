import React, { useEffect, useState } from 'react';
import style from './editWindow.module.css';
import { IoIosClose } from "react-icons/io";
import Alert from '../alert/alert';


const EditWindow = ({ active, setActive, id, updateTable, pageStatus }) => {
  const [editOrder, setEditOrder] = useState({
    typeProject: '',
    name: '',
    phone: '',
    email: '',
    budjet: '',
    comment: '',
    status: ''
  });

  const [editWorker, setEditWorker] = useState({
    name: '',
    surname: '',
    pobatkovi: '',
    phone:'',
    typeWorker: '',
    city: '',
    nameWorkType: '',
    stavka: ''
  });

  const [showAlert, setShowAlert] = useState({
    type: '',
    visible: false,
    message: ''
  });

  useEffect(() => {
    if (!id) return
    const config = {
      orders: {url: `${process.env.REACT_APP_API_URL}/api/take/takeOrderForEdit?idOrder=${id}`},
      workers: {url: `${process.env.REACT_APP_API_URL}/api/worker/takeWorkerForEdit?idWorker=${id}`}
    }
    const url = config[pageStatus]?.url
    if (!url) return;


    const take = async () => {
      const find = await fetch(url)
      const result = await find.json()
      if(pageStatus === 'orders'){
        setEditOrder(result)
      } else {
        setEditWorker(result)
      } 
    }

    take()
  }, [id, pageStatus])

  const saveEdit = async () => {
    try {
      const config = {
        orders: {url: '/api/take/sendEdit', body: { editOrder, id }},
        workers: {url: '/api/worker/sendEdit', body: { editWorker, id }}
      }

      const {url, body} = config[pageStatus] || {}
      if(!url) return

      const sendEdit = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const resultSaving = await sendEdit.json();
      if (!sendEdit.ok) throw new Error(resultSaving.message);

      if (resultSaving.newEdit) {
        setShowAlert({ type: 'success', visible: true, message: resultSaving.message });
        updateTable(resultSaving.newEdit);
        setActive(prev => ({...prev, edit: false}));
        return;
      }

      setShowAlert({ type: 'warning', visible: true, message: resultSaving.message });
      setActive(false);
    } catch (error) {
      setShowAlert({ type: 'error', visible: true, message: error.message });
      setActive(prev => ({...prev, edit: false}));
    }
  };

  const handleStatusChange = (status) => {
    setEditOrder({ ...editOrder, status });
  };

  return (
    <>
      <Alert setShowAlert={setShowAlert} showAlert={showAlert} duration={3000} />
      {pageStatus === 'orders' && 
      active.edit && (
        <div className={style.modalActive}>
          <div className={style.modalContent}>
            {/* Close Icon */}
            <IoIosClose className={style.closeIcon} onClick={() => setActive(prev => ({...prev, edit: false}))} />

            {/* Header */}
            <div className={style.modalHeader}>
              <h2 className={style.modalTitle}>Редагувати замовлення</h2>
            </div>

            {/* Form Body */}
            <div className={style.modalBody}>
              <div className={style.formRow}>
                <label className={`${style.formLabel}`}>
                  Ім’я
                  <input
                    type="text"
                    value={editOrder.name}
                    onChange={(e) => setEditOrder({ ...editOrder, name: e.target.value })}
                    className={style.formInput}
                  />
                </label>
                <label className={style.formLabel}>
                  Тип проекту
                  <input
                    type="text"
                    value={editOrder.typeProject}
                    onChange={(e) => setEditOrder({ ...editOrder, typeProject: e.target.value })}
                    className={style.formInput}
                  />
                </label>
              </div>

              <div className={style.formRow}>
                <label className={style.formLabel}>
                  Телефон
                  <input
                    type="tel"
                    value={editOrder.phone}
                    onChange={(e) => setEditOrder({ ...editOrder, phone: e.target.value })}
                    className={style.formInput}
                  />
                </label>
                <label className={style.formLabel}>
                  Ціна
                  <input
                    type="number"
                    value={editOrder.budjet}
                    onChange={(e) => setEditOrder({ ...editOrder, budjet: e.target.value })}
                    className={style.formInput}
                  />
                </label>
              </div>

              <div className={style.formRowFull}>
                <label className={style.formLabel}>
                  Емайл
                  <input
                    type="email"
                    value={editOrder.email}
                    onChange={(e) => setEditOrder({ ...editOrder, email: e.target.value })}
                    className={style.formInput}
                  />
                </label>
              </div>

              <div className={style.formRowFull}>
                <label className={style.formLabel}>
                  Коментарі
                  <input
                    type="text"
                    value={editOrder.comment}
                    onChange={(e) => setEditOrder({ ...editOrder, comment: e.target.value })}
                    className={style.formInput}
                  />
                </label>
              </div>

              {/* Status Section */}
              <div className={style.statusSection}>
                <div className={style.statusDisplay}>
                  <span>Статус замовлення:</span>
                  <span
                    className={`${style.statusText} ${
                      editOrder.status === 'В роботі'
                        ? style.inProgress
                        : editOrder.status === 'Скасоване замовлення'
                        ? style.cancelled
                        : editOrder.status === 'Завершене замовлення'
                        ? style.completed
                        : ''
                    }`}
                  >
                    {editOrder.status}
                  </span>
                </div>
                <div className={style.statusButtons}>
                  <button
                    className={`${style.btnStatus} ${
                      editOrder.status === 'В роботі' ? style.active : ''
                    }`}
                    onClick={() => handleStatusChange('В роботі')}
                  >
                    В роботу
                  </button>
                  <button
                    className={`${style.btnStatus} ${
                      editOrder.status === 'Скасоване замовлення' ? style.active : ''
                    }`}
                    onClick={() => handleStatusChange('Скасоване замовлення')}
                  >
                    Скасувати
                  </button>
                  <button
                    className={`${style.btnStatus} ${
                      editOrder.status === 'Завершене замовлення' ? style.active : ''
                    }`}
                    onClick={() => handleStatusChange('Завершене замовлення')}
                  >
                    Завершити
                  </button>
                </div>

              </div>

              {/* Save Button */}
              <div className={style.saveButtonContainer}>
                <button className={style.btnSave} onClick={saveEdit}>
                  Зберегти
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {pageStatus === 'workers' && 
      active.edit && (
        <div className={style.modalActive}>
          <div className={style.modalContent}>
            {/* Close Icon */}
            <IoIosClose className={style.closeIcon} onClick={() => setActive(prev => ({...prev, edit: false}))} />

            {/* Header */}
            <div className={style.modalHeader}>
              <h2 className={style.modalTitle}>Редагувати інфо працівника</h2>
            </div>

            {/* Form Body */}
            <div className={style.modalBody}>
              <div className={style.formRow}>
                <label className={`${style.formLabel}`}>
                  Ім’я
                  <input
                    type="text"
                    value={editWorker.name}
                    onChange={(e) => setEditWorker({ ...editWorker, name: e.target.value })}
                    className={style.formInput}
                  />
                </label>
                <label className={style.formLabel}>
                  Прізвище
                  <input
                    type="text"
                    value={editWorker.surname}
                    onChange={(e) => setEditWorker({ ...editWorker, surname: e.target.value })}
                    className={style.formInput}
                  />
                </label>
                <label className={style.formLabel}>
                  Побатькові
                  <input
                    type="text"
                    value={editWorker.pobatkovi}
                    onChange={(e) => setEditWorker({ ...editWorker, pobatkovi: e.target.value })}
                    className={style.formInput}
                  />
                </label>
                <label className={style.formLabel}>
                  Телефон
                  <input
                    type="tel"
                    value={editWorker.phone}
                    onChange={(e) => setEditWorker({ ...editWorker, phone: e.target.value })}
                    className={style.formInput}
                  />
                </label>
              </div>

              <div className={style.formRow}>
                <label className={style.formLabel}>
                  Тип найму
                  <input
                    type="text"
                    value={editWorker.typeWorker}
                    onChange={(e) => setEditWorker({ ...editWorker, typeWorker: e.target.value })}
                    className={style.formInput}
                  />
                </label>
                <label className={style.formLabel}>
                  Посада
                  <input
                    type="text"
                    value={editWorker.nameWorkType}
                    onChange={(e) => setEditWorker({ ...editWorker, nameWorkType: e.target.value })}
                    className={style.formInput}
                  />
                </label>
              </div>

              <div className={style.formRow}>
                <label className={style.formLabel}>
                  Місто
                  <input
                    type="text"
                    value={editWorker.city}
                    onChange={(e) => setEditWorker({ ...editWorker, city: e.target.value })}
                    className={style.formInput}
                  />
                </label>
                <label className={style.formLabel}>
                  Ставка
                  <input
                    type="number"
                    value={editWorker.stavka}
                    onChange={(e) => setEditWorker({ ...editWorker, stavka: e.target.value })}
                    className={style.formInput}
                  />
                </label>
              </div>
              {/* Save Button */}
              <div className={style.saveButtonContainer}>
                <button className={style.btnSave} onClick={() => saveEdit()}>
                  Зберегти
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditWindow;
