import React from 'react'
import style from './pagination.module.css'

const Pagination = ({curentPage, totalPage, onPageChange}) => {
    // Якщо немає сторінок нічого не показуємо
    if(totalPage <= 1) return null
    // масив для сторінок
    const pages = []
    // завжди показуємо першу сторінку
    pages.push(1)
    // якщо цільова сторінка більша ніж 4 між 1 сторінкою та цільовою додаємо ...
    if(curentPage > 4){
        pages.push('...')
    }
    // Межі для показу сторінок біля цільової
    const start = Math.max(2, curentPage - 2)
    const end = Math.min(totalPage - 1, curentPage + 2)
    // відображення всіх сторінок через цикл
    for(let i = start; i <= end; i++){
        pages.push(i)
    }
    // Якщо до останьої сторінки ще багато сторінок додаємо ...
    if(curentPage < totalPage - 3){
        pages.push('...')
    }
    // Показуємо останню сторінку
    if(totalPage > 1) {
        pages.push(totalPage)
    }
    // видаляємо можливі дублікати
    const uniquePage = pages.filter((page, index) => pages.indexOf(page) === index)

    // const doSearch = async () => {
    //     try {
    //       const res = await fetch(`/api/take/searchOrder?page=${currentPage}`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ query: searchQuery })
    //       })
    //       const result = await res.json()
    //       updateTable(result.finalSearch || [])
    //       setSumOrder(result.total || 0)
    //     } catch (err) {
    //       console.error(err)
    //     }
    // }
    return(
        <div className={style.paginationBlock}>
            {/*  кнопка назад */}
            <button className={style.but}
                onClick={() => onPageChange(curentPage - 1)}
                disabled={curentPage === 1}
            >
                Назад
            </button>

            {uniquePage.map((page, index) => page === '...' ? (
                <span>...</span>
            ):(
                <button className={curentPage === page ? style.active : style.but}
                    key={page}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            {/*  кнопка вперед */}
            <button className={style.but}
                onClick={() => onPageChange(curentPage + 1)}
                disabled={curentPage === totalPage}
            >
                Вперед
            </button>
        </div>
    )
}

export default Pagination