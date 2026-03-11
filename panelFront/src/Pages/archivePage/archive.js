import { useEffect, useState, useCallback } from 'react'
import style from './archive.module.css'
import Submit from '../../component/modalWindow/workerModalWindow/submit'
import Search from '../../component/search/search'
import Alert from '../../component/modalWindow/alert/alert'
import ViewWindow from '../../component/modalWindow/editWindow/justLook'
import { MdRemoveRedEye } from "react-icons/md";
import Pagination from '../../component/pagination'

const Archive = ({pageStatus}) => { 

  const [workerArhive, setWorkerArhive] = useState([])
  const [sumArhive, setSumArhive] = useState()
  const [selectedWorkerArhiveId, setSelectedWorkerArhiveId] = useState(null)
  const [submit, setSubmit] = useState(false)
  const [modalActive, setModalActive] = useState({edit: false, look: false})
//   Звільнити чи відновити
  const [delOrExt, setDelOrExt] = useState()
  // Пошук
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  // Тип повідомлення
  const [showAlert, setShowAlert] = useState({
    type: '',
    visible: false,
    message: ''
  })



  const showWorkerArhive = useCallback(async () => {
    try {
      const takeWorkerArhive = await fetch(`/api/worker/takeArhiveWorker?page=${currentPage}`)
      const result = await takeWorkerArhive.json()

      setWorkerArhive(result.arhiveWorker)
      setSumArhive(result.sumWorker)
    } catch (error) {
      
    }
  }, [currentPage])

  useEffect(() => {
    if(searchQuery){
      const doSearch = async () => {
        try {
          const bodyObj = {
            query: searchQuery,
            status: "Архів"
          }
          const res = await fetch(`/api/worker/searchWorker?page=${currentPage}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyObj)
          })
          const result = await res.json()
          setWorkerArhive(result.finalSearch || [])
          setSumArhive(result.sum || 0)
        } catch (err) {
          console.error(err)
        }
      }
      doSearch()
    } else {
      showWorkerArhive()
    }
  }, [currentPage, searchQuery, showWorkerArhive])

  
  return (
    <div>
        <Submit 
        onClose={() => setSubmit(false)}
        isOpen={submit}
        workerId={selectedWorkerArhiveId}
        refresh={showWorkerArhive}
        setShowAlert={setShowAlert}
        pageStatus={pageStatus}
        delOrExt={delOrExt}
      />
      <Alert
        setShowAlert={setShowAlert}
        showAlert={showAlert}
        duration={3000}
      />
      <ViewWindow 
        active={modalActive}
        setActive={setModalActive}
        id={selectedWorkerArhiveId}
        pageStatus={pageStatus}
      />
      <div className={style.search}>
        <Search 
          pageStatus={pageStatus}
          updateTable={setWorkerArhive}
          updateSum={setSumArhive}
          setSubmit={setSubmit}
          page= {currentPage}
          setSearchResult={setSearchQuery}
        />
      </div>
      <div className={style.container}>
        <div className={style.nameChapter}>
          <h3 style={{margin: 0}}>Архів</h3>
          <div className={style.sumOrders}>Кількість людей в архіві: {sumArhive}</div>
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
            {workerArhive.map((w) => (
              <tr key={w._id}>
                <td>{w.name} {w.surname} {w.pobatkovi}</td>
                <td>{w.phone}</td>
                <td>{w.nameWorkType}</td>
                <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                <td style={{display: 'flex', gap: 5}}>
                   <MdRemoveRedEye  onClick={() => {
                      setModalActive(prev => ({...prev, look: true}))
                      setSelectedWorkerArhiveId(w._id)
                      }} style={{cursor: 'pointer', marginRight: 10, color: 'grey'}}/>
                  <button onClick={() => {
                    setSelectedWorkerArhiveId(w._id)
                    setSubmit(true)
                    setDelOrExt('delete')
                  }} className={style.fire}>Звільнити</button>
                  <button onClick={() => {
                    setSelectedWorkerArhiveId(w._id)
                    setSubmit(true)
                    setDelOrExt('extend')
                  }} className={style.extend}>Відновити</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={style.paginationBlock}>
            {/* Сторінки */}
            <Pagination 
              curentPage={currentPage}
              totalPage={Math.ceil(sumArhive/5)}
              onPageChange={setCurrentPage}
            />
        </div>
      </div>
    </div>
  )
}

export default Archive
