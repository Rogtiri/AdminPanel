import { useState } from 'react';
import './App.css';
import Orders from './Pages/ordersPage/orders/orders.js';
import Worker from './Pages/workerPage/worker/worker.js';
import Archive from './Pages/archivePage/archive.js';

function App() {
  const [pageStatus, setPageStatus] = useState('orders');

  return (
    <div className="App">
      <aside className="sidebar">
        <h2 className="sidebar-title">Панель</h2>
        <button
          onClick={() => setPageStatus('orders')}
          className={`nav-btn ${pageStatus === 'orders' ? 'active' : ''}`}
        >
          Замовлення
        </button>
        <button
          onClick={() => setPageStatus('workers')}
          className={`nav-btn ${pageStatus === 'workers' ? 'active' : ''}`}
        >
          Працівники
        </button>
        <button
          onClick={() => setPageStatus('archive')}
          className={`nav-btn ${pageStatus === 'archive' ? 'active' : ''}`}
        >
          Архів
        </button>
      </aside>

      <main className="content">
        {pageStatus === 'orders' && <Orders pageStatus={pageStatus}/>}
        {pageStatus === 'workers' && <Worker pageStatus={pageStatus}/>}
        {pageStatus === 'archive' && <Archive pageStatus={pageStatus}/>}
      </main>
    </div>
  );
}

export default App;
