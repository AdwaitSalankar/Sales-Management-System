import React from 'react';
import { LayoutDashboard, User, Users, FileText, Settings, Database, CircleDollarSign } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="brand" style={{ border: '1px solid #e5e5e5ff', padding: '1px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <User size={30} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>Vault</span>
          <div style={{ fontSize: '0.8rem', color: '#999', marginLeft:'1.4px' }}>Adwait Salankar</div>
        </div>
      </div>
      

      <div className="nav-group-title">Main</div>
      <div className="nav-item active">
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </div>
      <div className="nav-item">
        <Users size={18} />
        <span>Nexus</span>
      </div>
      <div className="nav-item">
        <Database size={18} />
        <span>Intake</span>
      </div>
      <div className="nav-item">
        <Settings size={18} />
        <span>Services</span>
      </div>

      <div className="nav-group-title">Invoices</div>
      <div className="nav-item">
        <FileText size={18} />
        <span>Proforma Invoices</span>
      </div>
      <div className="nav-item">
        <CircleDollarSign size={18} />
        <span>Final Invoices</span>
      </div>
    </div>
  );
};

export default Sidebar;