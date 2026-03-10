import React, { useState } from 'react'
import style from './search.module.css'
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

// refresh, sum
const Search = ({updateTable, updateSum, filter, filterData, chooseFilter, pageStatus,
setFormWorker, page, setSearchResult
}) => {
    // // Показати фільтри
    const [show, setShow] = useState({filterShow: false, calendarShow: false})
    const [text, setText] = useState('')
    

    const [focus, setFocus] = useState(false)
    // відображення фільтрів
    const showUserChoice = (action) => {
        if(action === 'filter'){
            setShow(prev => ({...prev, filterShow: !prev.filterShow}))
        }
        if(action === 'calendar'){
            setShow(prev => ({...prev, calendarShow: !prev.calendarShow}))
        }
    }
    // Функція пошуку
    const sendSearch = async (type) => {
        if(text.trim() === ''){
            setSearchResult('')
            return
        }

        try {
            const bodyObj = {
                orders: {query: text},
                workers: {query: text, status: "Робочий"}
            }
            if(filterData){
                bodyObj[type].filterDate = filterData.toLocaleDateString("en-CA")
            }
            if(filter){
                bodyObj[type].filterBody = filter
            }
            const config = {
                orders: {url: `/api/take/searchOrder?page=${page}`, body: bodyObj[type]},
                workers: {url: `/api/worker/searchWorker?page=${page}`, body: bodyObj[type]},
                archive: {url: `/api/worker/searchWorker?page=${page}`, body: {query: text, status: 'Архів'}}
            }

            const {url, body} = config[type] || {}
            if (!url) return

            const send = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const result = await send.json()
            updateTable(result.finalSearch)
            updateSum(result.sum)

            setSearchResult(text.trim())
        } catch (error) {
            console.error('Search error:', error)
        }
    }

    return (
        <div className={style.mainContainer}>
            {/* Пошукова система */}
            <div className={focus ? style.focusSearch : style.search} onClick={() => setFocus(prev => !prev)}>
                <input 
                    type='text'
                    placeholder='Пошук...'
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (pageStatus === 'orders') sendSearch('orders');
                            if (pageStatus === 'workers') sendSearch('workers');
                            if (pageStatus === 'archive') sendSearch('archive');
                        }
                    }}
                    className={style.parrams}
                />
                <CiSearch onClick={() => {
                    if (pageStatus === 'orders') sendSearch('orders');
                    if (pageStatus === 'workers') sendSearch('workers');
                    if (pageStatus === 'archive') sendSearch('archive');
                    setFocus(true);
                }}  className={style.btnSearch}/>
            </div>
            {pageStatus === 'orders' &&
            <div className={style.filterContainer}>
                <div style={{display: 'flex'}}>
                    <button onClick={() => showUserChoice('filter')} className={style.showFilter}>Фільтр відображення замовленння
                        <IoIosArrowDown className={`${style.arrow} ${show.filterShow ? style.active : ''}`}/>
                    </button>
                    {show.filterShow && 
                    // Фільтри пошуку (суть в тому щоб зробити одне загалльне меню і обирати декілька фільтрів)
                        <>
                            {/* Фльтр статусу замовленння */}
                            <div className={style.filterMenu}>
                                <button 
                                onClick={() => chooseFilter(prev => ({...prev, status: prev.status === 'Нове замовлення' ? null : 'Нове замовлення'}))} 
                                className={`${style.fileterBtn} ${filter.status === 'Нове замовлення' && style.activeFilter}`}>
                                    Нові замовлення
                                </button>
                                <button
                                onClick={() => chooseFilter(prev => ({...prev, status: prev.status === 'В роботі' ? null : 'В роботі'}))} 
                                className={`${style.fileterBtn} ${filter.status === 'В роботі' && style.activeFilter}`}>
                                    В роботі
                                </button>
                                <button 
                                onClick={() => chooseFilter(prev => ({...prev, status: prev.status === 'Скасоване замовлення' ? null : 'Скасоване замовлення'}))} 
                                className={`${style.fileterBtn} ${filter.status === 'Скасоване замовлення' && style.activeFilter}`}>
                                    Скасовані замовлення
                                </button>
                                <button 
                                onClick={() => chooseFilter(prev => ({...prev, status: prev.status === 'Завершене замовлення' ? null : 'Завершене замовлення'}))} 
                                className={`${style.fileterBtn} ${filter.status === 'Завершене замовлення' && style.activeFilter}`}>
                                    Завершені замовлення
                                </button>
                            </div>
                        </>
                    }
                    {/* Контейнер для календаря */}
                    <div className={style.calendarContainer}>
                        <button onClick={() => showUserChoice('calendar')} className={style.showCalendar}>Календар
                            <IoIosArrowDown className={`${style.arrow} ${show.calendarShow ? style.active : ''}`}/>
                        </button>
                        {/* Календар */}
                        {show.calendarShow && 
                            <div className={style.calendar}>
                            <Calendar 
                                    onClickDay={(d) => {
                                    chooseFilter(prev => ({...prev, data: prev.data && prev.data.getTime() === d.getTime() ? null : d}))
                                }}
                                value={filter.data || null}
                            />
                            </div>
                        }
                    </div>
                </div>
            </div>
            }
            {pageStatus === 'workers' && 
            <div className={style.filterContainer}>
                <div style={{display: 'flex'}}>
                    <button onClick={() => setFormWorker(true)} className={style.showFilter}>Додати працівника
                    </button>
                    {/* Контейнер для календаря */}
                    <div className={style.calendarContainer}>
                        <button onClick={() => showUserChoice('calendar')} className={style.showCalendar}>Календар
                            <IoIosArrowDown className={`${style.arrow} ${show.calendarShow ? style.active : ''}`}/>
                        </button>
                        {/* Календар */}
                        {show.calendarShow && 
                            <div className={style.calendar}>
                            <Calendar 
                                    onClickDay={(d) => {
                                    chooseFilter(prev => prev && prev.getTime() === d.getTime() ? null : d)
                                }}
                                value={filterData || null}
                            />
                            </div>
                        }
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default Search
