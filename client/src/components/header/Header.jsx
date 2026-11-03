import { useState, useContext } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { SidebarContext } from '../../App.jsx'
import './Header.css'
import {ROUTE_HOME, ROUTE_STOCK, ROUTE_EMPLOYEE, ROUTE_CONTRACT, ROUTE_PROFILE} from '../../path/ClientPath.js'
import {useSelector} from "react-redux";
import {ADMIN, AGENT} from "../../role/SystemRoles.js";

function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useContext(SidebarContext)

  const userRole = useSelector(state => state.user.user.role.name);

  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          ☰
        </button>
        <h1 className="header-title">African Global Logistics</h1>
        <div className="header-subtitle">Warehouse Management System</div>
      </div>

      {/*<div className="header-center">*/}
      {/*  <div className="search-bar">*/}
      {/*    <span className="search-icon">🔍</span>*/}
      {/*    <input*/}
      {/*      type="text"*/}
      {/*      placeholder="Search products, orders, employees..."*/}
      {/*      value={searchQuery}*/}
      {/*      onChange={(e) => setSearchQuery(e.target.value)}*/}
      {/*      className="search-input"*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div className="header-right">
        <nav className="header-nav">
          <Link to={ROUTE_HOME} className="nav-link">Home</Link>
          {(userRole==ADMIN || userRole==AGENT) && <Link to={ROUTE_STOCK} className="nav-link">Stock</Link>}
          <Link to={ROUTE_CONTRACT} className="nav-link">Contract</Link>
          {userRole==ADMIN && <Link to={ROUTE_EMPLOYEE} className="nav-link">Employee</Link>}
        </nav>

        <div className="header-actions">
          <div className="user-profile" onClick={() => navigate(ROUTE_PROFILE)}>
            <div className="avatar">👤</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
