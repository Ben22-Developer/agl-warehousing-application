import { useState, useEffect, createContext, useContext } from 'react'
import {BrowserRouter as Router, Routes, Route, useLocation, useRouteError} from 'react-router-dom'
import Sidebar from './components/sidebar/Sidebar.jsx'
import Header from './components/header/Header.jsx'
import ProductCarousel from './components/product-carousel/ProductCarousel.jsx'
import StockPage from './components/stock-page/StockPage.jsx'
import EmployeePage from './components/employee-page/EmployeePage.jsx'
import ContractPage from './components/contract-page/ContractPage.jsx'
import {
  ROUTE_HOME,
  ROUTE_STOCK,
  ROUTE_EMPLOYEE,
  ROUTE_CONTRACT,
  ROUTE_AUTHORIZATION_CODE, ROUTE_SETTINGS, ROUTE_PROFILE
} from './path/ClientPath.js'
import RedirectingComponent from "./components/auth/RedirectingComponent.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Settings from "./components/setting/Settings.jsx";
import ReadStockComponent from "./components/stock-page/read-stock-component/ReadStockComponent.jsx";
import UserProfile from "./components/setting/profile/UserProfile.jsx";

export const SidebarContext = createContext()

function App()
{
  const [theme, setTheme] = useState('light')
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <Router>
      <SidebarContext.Provider value={{ isSidebarExpanded, setIsSidebarExpanded, isMobileSidebarOpen, setIsMobileSidebarOpen }}>
        <AppContent theme={theme} toggleTheme={toggleTheme} />
      </SidebarContext.Provider>
    </Router>
  )
}

function AppContent({ theme, toggleTheme })
{
  return(
    <Routes>
      <Route errorElement={<Error/>} element={<ProtectedRoute theme={theme} toggleTheme={toggleTheme} />}>
        <Route index={true} path={ROUTE_HOME} element={<ReadStockComponent showActions={false} />} />
        <Route path={ROUTE_STOCK} element={<StockPage />} />
        <Route path={ROUTE_EMPLOYEE} element={<EmployeePage />} />
        <Route path={ROUTE_CONTRACT} element={<ContractPage />} />
        <Route path={ROUTE_SETTINGS} element={<Settings theme={theme} toggleTheme={toggleTheme} />} />
        <Route path={ROUTE_PROFILE} element={<UserProfile />} />
      </Route>
      <Route path={ROUTE_AUTHORIZATION_CODE} element={<RedirectingComponent />} />
    </Routes>
  )
}

export default App

function Error () {

  const error = useRouteError();
  console.error(error); // Log for debugging

  return <p>Hello</p>;
}
