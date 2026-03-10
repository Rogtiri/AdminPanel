import React, { useEffect, useState } from 'react'
import FormWorker from '../../../component/modalWindow/workerModalWindow/formWorker'
import style from './worker.module.css'
import Search from '../../../component/search/search'
import Submit from '../../../component/modalWindow/workerModalWindow/submit'
import Alert from '../../../component/modalWindow/alert/alert'
import { FaEdit } from "react-icons/fa";
import { MdRemoveRedEye } from "react-icons/md";
import ViewWindow from '../../../component/modalWindow/editWindow/justLook'
import EditWindow from '../../../component/modalWindow/editWindow/editWindow'
import Pagination from '../../../component/pagination'

const Worker = ({pageStatus}) => {
  // Стан для збереження інфо про працівників
  const [worker, setWorker] = useState([])
  // К-ть працівників
  const [sum, setSum] = useState()
  // Показ форми додавання працівника
  const [formWorker, setFormWorker] = useState(false)
  // Збереження айді працівника для звільнення
  const [selectedWorkerId, setSelectedWorkerId] = useState(null)
  // Показ вікна для підтвердження звільнення
  const [submit, setSubmit] = useState(false)
  // фільтр по даті
  const [filterData, setFilterData] = useState(null)
  // Редагувати чи переглянути
  const [modalActive, setModalActive] = useState({edit: false, look: false})
  // Пошук
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  // Тип повідомлення
  const [showAlert, setShowAlert] = useState({
    type: '',
    visible: false,
    message: ''
  })



  const showWorker = async () => {
    try {
      if(!filterData){
        const takeWorker = await fetch(`/api/worker/takeWorker?page=${currentPage}`)
        const result = await takeWorker.json()

        setWorker(result.allWorker)
        setSum(result.sumWorker)
        return
      }
       // Отримання працівника по даті
      const filterBody = filterData.toLocaleDateString("en-CA")

      const findForData = await fetch(`/api/worker/findForData?page=${currentPage}`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filterBody
          })
      })
      const data = await findForData.json()
      setWorker(data.filter)
      setSum(data.sum)
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    setCurrentPage(1);
  }, [filterData]);

  useEffect(() => {
    if(searchQuery){
      const doSearch = async () => {
        try {
          const bodyObj = {
            query: searchQuery,
            status: "Робочий"
          }
          if(filterData){
            bodyObj.filterDate = filterData.toLocaleDateString("en-CA")
          }
          const res = await fetch(`/api/worker/searchWorker?page=${currentPage}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyObj)
          })
          const result = await res.json()
          setWorker(result.finalSearch || [])
          setSum(result.sum || 0)
        } catch (err) {
          console.error(err)
        }
      }
      doSearch()
    } else {
      showWorker()
    }
    
  }, [filterData, currentPage, searchQuery])

  
  return (
    <div>
      <div className={style.search}>
        <Search 
          pageStatus={pageStatus}
          setFormWorker={setFormWorker}
          updateTable={setWorker}
          updateSum={setSum}
          filterData={filterData}
          chooseFilter={setFilterData}
          page= {currentPage}
          setSearchResult={setSearchQuery}
        />
      </div>
      <FormWorker 
        setFormWorker={setFormWorker}
        formWorker={formWorker}
        showWorker={showWorker}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
      />
      <Submit 
        onClose={() => setSubmit(false)}
        isOpen={submit}
        workerId={selectedWorkerId}
        refresh={showWorker}
        setShowAlert={setShowAlert}
        pageStatus={pageStatus}
      />
      <Alert
        setShowAlert={setShowAlert}
        showAlert={showAlert}
        duration={3000}
      />
      <EditWindow 
        active={modalActive}
        setActive={setModalActive}
        id={selectedWorkerId}
        pageStatus={pageStatus}
        updateTable={showWorker}
      />
      <ViewWindow 
        active={modalActive}
        setActive={setModalActive}
        id={selectedWorkerId}
        pageStatus={pageStatus}
      />
      <div className={style.container}>
        <div className={style.nameChapter}>
          <h3 style={{margin: 0}}>Розділ працівники</h3>
          <div className={style.sumOrders}>Кількість працівників: {sum}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ПІБ працівника</th>
              <th>Номер телефону</th>
              <th>Посада</th>
              <th>Дата найму</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            {/* Відображення замовлень */}
            {worker.map((w) => (
              <tr key={w._id}>
                <td>{w.name} {w.surname} {w.pobatkovi}</td>
                <td>{w.phone}</td>
                <td>{w.nameWorkType}</td>
                <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                <td>
                  <FaEdit onClick={() => {
                    setSelectedWorkerId(w._id)
                    setModalActive(prev => ({...prev, edit: true}))
                    }} style={{cursor: 'pointer', marginRight: 10, color: 'grey'}}/>
                  <MdRemoveRedEye  onClick={() => {
                    setSelectedWorkerId(w._id)
                    setModalActive(prev => ({...prev, look: true}))
                    }} style={{cursor: 'pointer', marginRight: 10, color: 'grey'}}/>
                  <button onClick={() => {
                    setSelectedWorkerId(w._id)
                    setSubmit(true)
                  }} className={style.fire}>Звільнити</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={style.paginationBlock}>
            {/* Сторінки */}
            <Pagination 
              curentPage={currentPage}
              totalPage={Math.ceil(sum/5)}
              onPageChange={setCurrentPage}
            />
        </div>
      </div>
    </div>
  )
}

export default Worker
