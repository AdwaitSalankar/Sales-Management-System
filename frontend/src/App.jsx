import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { MultiSelectDropdown, RangeDropdown } from './components/FilterDropdowns';
import { fetchSales } from './services/api';
import { Search, ChevronDown, Copy, Info, RotateCcw } from 'lucide-react';
import './App.css';

const FILTER_OPTIONS = {
  region: ['North', 'South', 'East', 'West'],
  gender: ['Male', 'Female'],
  category: ['Electronics', 'Clothing', 'Beauty'],
  paymentMethod: ['Credit Card', 'Debit Card', 'Wallet', 'Net Banking', 'Cash', 'UPI'],
  tags: ['makeup', 'fragrance-free', 'smart', 'skincare', 'accessories', 'wireless', 'unisex', 'organic', 'gadgets', 'beauty', 'casual', 'formal', 'portable', 'fashion', 'cotton']
};

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);

  const [stats, setStats] = useState({
      totalUnits: 0,
      totalAmount: 0,
      totalDiscount: 0
  });

  // State
  const [params, setParams] = useState({
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'sale.date',
    order: 'desc',
    region: [],
    gender: [],
    category: [],
    paymentMethod: [],
    tags: [],
    minAge: '',
    maxAge: ''
  });

  useEffect(() => {
    loadData();
  }, [params]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Convert Array State to CSV Strings for API
      const apiParams = {
        ...params,
        region: params.region.join(','),
        gender: params.gender.join(','),
        category: params.category.join(','),
        paymentMethod: params.paymentMethod.join(','),
        tags: params.tags.join(',')  
      };
      
      const result = await fetchSales(apiParams);
      setData(result.data || []);

      if (result.pagination) {
          setTotalPages(result.pagination.totalPages);
      }

      if (result.stats) {
          setStats(result.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, newValues) => {
    setParams(prev => ({ ...prev, [key]: newValues, page: 1 }));
  };

  const handleAgeChange = (min, max) => {
      setParams(prev => ({ ...prev, minAge: min, maxAge: max, page: 1 }));
  };

  const handleSearch = (e) => {
    setParams(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    let newSort = {};

    switch (value) {
        case 'date-newest':
            newSort = { sortBy: 'sale.date', order: 'desc' };
            break;
        case 'date-oldest':
            newSort = { sortBy: 'sale.date', order: 'asc' };
            break;
        case 'name-asc':
            newSort = { sortBy: 'customer.name', order: 'asc' };
            break;
        case 'name-desc':
            newSort = { sortBy: 'customer.name', order: 'desc' };
            break;
        case 'quantity-desc':
            newSort = { sortBy: 'sale.quantity', order: 'desc' };
            break;
        case 'quantity-asc':
            newSort = { sortBy: 'sale.quantity', order: 'asc' };
            break;
        default:
            newSort = { sortBy: 'sale.date', order: 'desc' };
    }
    setParams(prev => ({ ...prev, ...newSort }));
  };

  const handleReset = () => {
    setParams({
      search: '',
      page: 1,
      limit: 10,
      sortBy: 'sale.date',
      order: 'desc',
      region: [],
      gender: [],
      category: [],
      paymentMethod: [],
      tags: [],
      minAge: '',
      maxAge: ''
    });
  };

  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert(`Copied ${text} to clipboard!`);
    }
  };

  const generatePagination = () => {
    const current = params.page;
    const last = totalPages;
    const delta = 4;
    const range = [];

    if (last <= 7) {
      for (let i = 1; i <= last; i++) range.push(i);
      return range;
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', last];
    }

    if (current >= last - 3) {
      return [1, '...', last - 4, last - 3, last - 2, last - 1, last];
    }

    return [1, '...', current - 1, current, current + 1, '...', last];
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        
        <header className="top-header">
          <h3>Sales Management System</h3>
          <div className="search-container">
            <Search size={16} color="#888" />
            <input 
              className="search-input" 
              placeholder="Search Name or Phone..." 
              onChange={handleSearch} 
              value={params.search}
            />
          </div>
        </header>

        <div className="filter-bar">
           <button 
             className="filter-btn" 
             onClick={handleReset}
             title="Reset all filters"
             style={{ padding: '8px' }}
           >
             <RotateCcw size={16} />
           </button>

           <MultiSelectDropdown 
              label="Customer Region" 
              options={FILTER_OPTIONS.region} 
              selected={params.region}
              onChange={(vals) => handleFilterChange('region', vals)}
           />

           <MultiSelectDropdown 
              label="Gender" 
              options={FILTER_OPTIONS.gender} 
              selected={params.gender}
              onChange={(vals) => handleFilterChange('gender', vals)}
           />

           <RangeDropdown 
              label="Age Range"
              min={params.minAge}
              max={params.maxAge}
              onApply={handleAgeChange}
           />

           <MultiSelectDropdown 
              label="Product Category" 
              options={FILTER_OPTIONS.category} 
              selected={params.category}
              onChange={(vals) => handleFilterChange('category', vals)}
           />

           <MultiSelectDropdown 
              label="Tags" 
              options={FILTER_OPTIONS.tags} 
              selected={params.tags}
              onChange={(vals) => handleFilterChange('tags', vals)}
           />

           <MultiSelectDropdown 
              label="Payment Method" 
              options={FILTER_OPTIONS.paymentMethod} 
              selected={params.paymentMethod}
              onChange={(vals) => handleFilterChange('paymentMethod', vals)}
           />

           <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
             <span style={{fontSize: '0.85rem', color: '#666'}}>Sort by:</span>
             <select 
                onChange={handleSortChange} 
                className="filter-dropdown"
                defaultValue="date-newest"
             >
                <optgroup label="Date">
                    <option value="date-newest">Date (Newest First)</option>
                    <option value="date-oldest">Date (Oldest First)</option>
                </optgroup>
                <optgroup label="Name">
                    <option value="name-asc">Customer Name (A-Z)</option>
                    <option value="name-desc">Customer Name (Z-A)</option>
                </optgroup>
                <optgroup label="Quantity">
                    <option value="quantity-desc">Quantity (High to Low)</option>
                    <option value="quantity-asc">Quantity (Low to High)</option>
                </optgroup>
             </select>
           </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-title">Total units sold <Info size={12}/></div>
            {/* Dynamic Value */}
            <div className="stat-value">{stats.totalUnits.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Amount <Info size={12}/></div>
            {/* Dynamic Value */}
            <div className="stat-value">₹ {stats.totalAmount.toLocaleString()}</div>
          </div>
           <div className="stat-card">
            <div className="stat-title">Total Discount <Info size={12}/></div>
            {/* Dynamic Value */}
            <div className="stat-value">₹ {stats.totalDiscount.toLocaleString()}</div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? <div style={{padding: 20}}>Loading...</div> : (
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Product Category</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Customer region</th>
                <th>Product ID</th>
                <th>Employee name</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row._id || row.transactionId}>
                  <td>{String(row.transactionId).substring(0,8)}</td>
                  <td>{new Date(row.sale.date).toISOString().split('T')[0]}</td>
                  <td>{row.customer.id}</td>
                  <td><b>{row.customer.name}</b></td>
                  <td>{row.customer.phone}
                    <Copy 
                        size={12} 
                        className="copy-icon" 
                        onClick={() => handleCopy(row.customer.phone)}
                        title="Copy Phone Number"
                    />
                  </td>
                  <td>{row.customer.gender}</td>
                  <td>{row.customer.age}</td>
                  <td><b>{row.product.category}</b></td>
                  <td><b>0{row.sale.quantity}</b></td>
                  <td><b>₹ {row.sale.totalAmount.toLocaleString()}</b></td>
                  <td><b>{row.customer.region}</b></td>
                  <td><b>{row.product.id}</b></td>
                  <td>{row.operational?.salesPerson?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        <div className="pagination-footer">
           <button 
              className="page-btn"
              disabled={params.page === 1}
              style={{ color: '#000000ff' }}
              onClick={() => setParams({...params, page: params.page - 1})}
           >
             &lt;
           </button>
           
           {generatePagination().map((pageNum, index) => (
             pageNum === '...' ? (
               <span key={`dots-${index}`} style={{ padding: '0 8px', color: '#000000ff' }}>...</span>
             ) : (
               <button 
                 key={pageNum}
                 className={`page-btn ${params.page === pageNum ? 'active' : ''}`}
                 style={{ color: '#000000ff' }}
                 onClick={() => setParams({...params, page: pageNum})}
               >
                 {pageNum}
               </button>
             )
           ))}

           <button 
              className="page-btn"
              disabled={params.page === totalPages}
              style={{ color: '#000000ff' }}
              onClick={() => setParams({...params, page: params.page + 1})}
           >
             &gt;
           </button>
        </div>
      </div>
    </div>
  );
}

export default App;