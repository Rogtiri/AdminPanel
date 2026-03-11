import { useEffect, useState } from 'react'
import Search from '../../../component/search/search.js'
import EditWindow from '../../../component/modalWindow/editWindow/editWindow.js'
import { chooseFilter } from './function.js'
import style from './order.module.css'
import { FaEdit } from "react-icons/fa";
import { MdRemoveRedEye } from "react-icons/md";
import ViewWindow from '../../../component/modalWindow/editWindow/justLook.js'
import Pagination from '../../../component/pagination.jsx'
// GET запрос на сервер
// Отримати усі замовлення та відобразити за допомогою map
const Orders = ({pageStatus}) => {
  // Хук для збереження замовлень
  const [orders, setOrders] = useState([])
  // Загальна к-ть замовлень
  const [sumOrder, setSumOrder] = useState()
  const [searchQuery, setSearchQuery] = useState('')
  // Збереження вибору дати для відправки на сервер
  // Сховище фільтрів
  const [filter, setFilter] = useState({status: '', data: null})
  const [modalActive, setModalActive] = useState({edit: false, look: false})
  const [selectedId, setSelectedId] = useState(null)
  // Стан сторінки
  const [currentPage, setCurrentPage] = useState(1)
  // Фільтр
  // Відображення замовлень по даті на календарю
  // Функція вибору типу проекта, статусу замовлення
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);
    // Відображення усіх замовлень при загрузці сторінки, або вибору фільтра
  useEffect(() => {
    if(searchQuery){
      const doSearch = async () => {
        try {
          const obj = {
            query: searchQuery
          }
          if(filter){
            obj.filterBody = filter
          }
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/take/searchOrder?page=${currentPage}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
          })
          const result = await res.json()
          setOrders(result.finalSearch || [])
          setSumOrder(result.sum || 0)
        } catch (err) {
          console.error(err)
        }
      }
      doSearch()
    } else{
      chooseFilter({
        filter, 
        setOrders, 
        setSumOrder,
        page: currentPage
      })
    }
  }, [filter, currentPage, searchQuery])

  // Оновлення таблиці згідно змін
  const updateTable = (newChange) => {
    if (!newChange?._id) return
    setOrders(prev => 
      prev.map((order) => 
        order._id === newChange._id ? newChange : order
      )
    )
  }
  // Кольори статусів роботи
  const statusBackgroundColors = {
    'Нове замовлення': '#fef3c6',
    'В роботі': '#dbeafe',
    'Скасоване замовлення': '#ffe2e2',
    'Завершене замовлення': '#dbfce7'
  };
  const statusBorderColors = {
    'Нове замовлення': '#fee685',
    'В роботі': '#bedbff',
    'Скасоване замовлення': '#ffc9c9',
    'Завершене замовлення': '#b9f8cf'
  };
  const statusTextColors = {
    'Нове замовлення': '#c26100',
    'В роботі': '#1f3cbc',
    'Скасоване замовлення': '#9f0712',
    'Завершене замовлення': '#016630'
  };

return (
  // Загальний контейнер
    <div>
      {/* Пошук та фільтри пошуку */}
      <div className={style.search}>
        <Search 
          updateTable={setOrders}
          updateSum={setSumOrder}
          pageStatus={pageStatus}
          filter={filter}
          chooseFilter={setFilter}
          page= {currentPage}
          setSearchResult={setSearchQuery}
        />
      </div>
      <div className={style.mainContainer}>
        {/* Модальне вікно */}
        <EditWindow 
          active={modalActive}
          setActive={setModalActive} 
          id={selectedId}
          updateTable={updateTable}
          pageStatus={pageStatus}
        />
        <ViewWindow 
          active={modalActive}
          setActive={setModalActive}
          id={selectedId}
          pageStatus={pageStatus}
        />
        {/* Контейнер з таблицею */}
        <div className={style.container}>
          <div className={style.nameChapter}>
            <h3 style={{margin: 0}}>Розділ замовлень</h3>
            <div className={style.sumOrders}>Кількість замволень: {sumOrder}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Тип проекту</th>
                <th>Імя замовника</th>
                <th>Номер</th>
                <th>Емайл</th>
                <th>Сума</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Дія</th>
              </tr>
            </thead>
            <tbody>
              {/* Відображення замовлень */}
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o.typeProject}</td>
                  <td>{o.name}</td>
                  <td>{o.phone}</td>
                  <td>{o.email}</td>
                  <td>{o.budjet}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div  className={style.status} style={{
                      backgroundColor: statusBackgroundColors[o.status],
                      border: `1px solid ${statusBorderColors[o.status]}`,
                      color: statusTextColors[o.status]
                    }}>{o.status}</div>
                  </td>
                  <td>
                    <FaEdit onClick={() => {
                      setModalActive(prev => ({...prev, edit: true}))
                      setSelectedId(o._id)
                      }} style={{cursor: 'pointer', marginRight: 10, color: 'grey'}}/>
                    <MdRemoveRedEye  onClick={() => {
                      setModalActive(prev => ({...prev, look: true}))
                      setSelectedId(o._id)
                      }} style={{cursor: 'pointer', color: 'grey'}}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={style.paginationBlock}>
            {/* Сторінки */}
            <Pagination 
              curentPage={currentPage}
              totalPage={Math.ceil(sumOrder/5)}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
)
}

export default Orders
