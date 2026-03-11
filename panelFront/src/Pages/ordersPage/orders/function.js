 export const chooseFilter = async ({filter, setOrders, setSumOrder, page}) => {
    try {
      // Запрос на отримання всіх замовлень якщо жоден із фільтрів не обрано
        let url = `${process.env.REACT_APP_API_URL}/api/take/takeOrders?page=${page}`
        // Отримання
        if(filter?.status && filter.status !== ''){
          url += `&status=${encodeURIComponent(filter.status)}`
        }
        if(filter.data){
          const dateStr = filter.data.toLocaleDateString("en-CA")
          url += `&data=${dateStr}`
        }

        const res = await fetch(url)
        const date = await res.json()
        // Збереження
        setOrders(date.orders)
        setSumOrder(date.sum)
    } catch (error) {
      console.log(error)
    }
    
  }