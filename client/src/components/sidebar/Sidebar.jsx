import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SidebarContext } from '../../App.jsx'
import './Sidebar.css'
import {ROUTE_HOME, ROUTE_STOCK, ROUTE_CONTRACT, ROUTE_EMPLOYEE, ROUTE_SETTINGS} from '../../path/ClientPath.js'
import {useSelector} from "react-redux";
import {ADMIN, AGENT, USER} from "../../role/SystemRoles.js";

function Sidebar() {
  const { isSidebarExpanded, setIsSidebarExpanded, isMobileSidebarOpen, setIsMobileSidebarOpen } = useContext(SidebarContext)
  const location = useLocation()
  const navigate = useNavigate()

  const userRole = useSelector(state => state.user.user.role.name);

  const showLabel = (isSidebarExpanded || isMobileSidebarOpen);

  const menuItems = [
    { path: ROUTE_HOME, label: 'Home', icon: '🏠', roles: [ADMIN, AGENT, USER] },
    { path: ROUTE_STOCK, label: 'Stock', icon: '📦', roles: [ADMIN, AGENT] },
    { path: ROUTE_CONTRACT, label: 'Contract', icon: '📋', roles: [ADMIN, AGENT, USER] },
    { path: ROUTE_EMPLOYEE, label: 'Employee', icon: '👥', roles: [ADMIN] },
  ]

  const handleNavClick = (path) => {
    navigate(path)
    setIsMobileSidebarOpen(false)
  }

  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <aside
        className={`sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'} ${isMobileSidebarOpen ? 'mobile-open' : ''}`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="sidebar-header">
          <span className="logo-icon">🌍</span>
          {showLabel && <span className="logo-text">AGL</span>}
        </div>

        <nav className="sidebar-nav">
          {menuItems.filter((item) => item.roles.includes(userRole))
              .map(item => (
                  <div
                      key={item.path}
                      onClick={() => handleNavClick(item.path)}
                      className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {showLabel && <span className="nav-label">{item.label}</span>}
                  </div>))
          }
        </nav>

        <div onClick={() => handleNavClick(ROUTE_SETTINGS)} className="sidebar-footer">
          <span className="footer-icon">⚙️</span>
          {showLabel && <span className="footer-text">Settings</span>}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
