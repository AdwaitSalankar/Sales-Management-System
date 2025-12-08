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
  paymentMethod: ['Credit Card', 'Debit Card', 'PayPal', 'Net Banking', 'Cash'],
  tags: ['Sale', 'New', 'Premium', 'Discounted', 'Bulk']
};

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

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
        
        // Just for UI
        paymentMethod: '', 
        tags: ''       
      };
      
      const result = await fetchSales(apiParams);
      setData(result.data || []);
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
    if (value === 'date-newest') newSort = { sortBy: 'sale.date', order: 'desc' };
    else if (value === 'quantity-desc') newSort = { sortBy: 'sale.quantity', order: 'desc' };
    else if (value === 'name-asc') newSort = { sortBy: 'customer.name', order: 'asc' };
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
             <select onChange={handleSortChange} className="filter-dropdown">
                <option value="date-newest">Date (Newest First)</option>
                <option value="name-asc">Customer Name (A-Z)</option>
                <option value="quantity-desc">Quantity (High to Low)</option>
             </select>
           </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-title">Total units sold <Info size={12}/></div>
            <div className="stat-value">10</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Amount <Info size={12}/></div>
            <div className="stat-value">₹89,000</div>
          </div>
           <div className="stat-card">
            <div className="stat-title">Total Discount <Info size={12}/></div>
            <div className="stat-value">₹15,000</div>
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
                  <td>{row.customer.phone} <Copy size={12} className="copy-icon" /></td>
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
              onClick={() => setParams({...params, page: params.page - 1})}
           >
             &lt;
           </button>
           <span style={{padding: '5px 10px', fontSize: '0.9rem'}}>Page {params.page}</span>
           <button 
              className="page-btn"
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