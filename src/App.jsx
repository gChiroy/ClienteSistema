import { useState, useEffect } from 'react'
import './styles/App.scss'
import Home from './pages/Home'
import Login from './pages/Login'
import Inventory from './pages/Inventory'
import Purchases from './pages/Purchases'
import Sales from './pages/Sales'
import CashBox from './pages/CashBox'
// import Reports from "./pages/Reports";
import Users from './pages/Users'
import Sidebar from './components/sidebar/Sidebar'
import Providers from './pages/Providers'
import Customers from './pages/Customers'
import ProveedoresCat from './pages/cat_Proveedores'

import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SkeletonTheme } from 'react-loading-skeleton'
// import { ProtectedRoute } from "./components/ProtectedRoute"; SERVIRA
// import useAuthStore from "./providers/User";
// import Waiters from './pages/Waiters'
// import Rango from "./pages/report/rango";

import InventoryProduct from './pages/Inventory'

import AdminRouteGuard from './providers/AdminRutas'
import InventoryPurchases from './pages/inventoryT/InventoryPurchases'
import InventorySales from './pages/inventoryT/InventorySales'
import ReportSale from './pages/report/sales/ReportSales'
import ReportShopping from './pages/report/shopping/ReportShopping'
import ReportCash from './pages/report/cashbox/ReportCash'
import Reports from './pages/Reports'
import Product from './pages/Products'



// const userRole = localStorage.getItem('userRole')

const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return <>{isAuth ? <Outlet /> : <Navigate to="/login" />}</>
}

const RestrictedRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return <>{!isAuth ? <Outlet /> : <Navigate to="/home" />}</>
}


const App = () => {
  const [pageTitle, setPageTitle] = useState('')
  /* Cambiar el encabezado de la página */
  const setTitle = (title) => {
    setPageTitle(title)
  }

  return (
    <>
      <SkeletonTheme baseColor="#313131" highlightColor="#525252">
        <BrowserRouter>
          {/* Sidebar */}
          <Sidebar pageTitle={pageTitle} />
          {/* <Layout /> */}
          <Routes>
            {/* Rutas que pueden ser accedidas por usuarios autenticados*/}

            {/* Rutas que pueden ser accedidas por usuarios autenticados y que sean 'Administrador' */}
            <Route element={<PrivateRoutes />}>
              <Route path="/home" element={<Home setTitle={setTitle} />} />

              <Route
                path="/cash-box"
                element={<CashBox setTitle={setTitle} />}
              />
              <Route
                path="/users"
                element={
                  <AdminRouteGuard>
                    {' '}
                    <Users setTitle={setTitle} />{' '}
                  </AdminRouteGuard>
                }
              />

              <Route
                path="/reports"
                element={
                <AdminRouteGuard>
                    {' '}
                    <Reports setTitle={setTitle} />
                    {' '}
                  </AdminRouteGuard>
              }
              />
              <Route
                path="/sreport"
                element={
                  <AdminRouteGuard>
                    {' '}
                    <ReportSale setTitle={setTitle} />
                    {' '}
                  </AdminRouteGuard>
              }
              />
              <Route
                path="/shreport"
                element={
                  <AdminRouteGuard>
                    {' '}
                    <ReportShopping setTitle={setTitle} />
                    {' '}
                  </AdminRouteGuard>
              }
              />
              <Route
                path="/breport"
                element={
                  <AdminRouteGuard>
                    {' '}
                    <ReportCash setTitle={setTitle} />
                    {' '}
                  </AdminRouteGuard>
              }
              />
              
              <Route
                path="/products"
                element={
                <AdminRouteGuard>
                  {' '}
                  <Product setTitle={setTitle} />

                  {' '}
                </AdminRouteGuard>
                }
              />
              <Route
                path="/providers"
                element={
                  <AdminRouteGuard>
                  {' '}
                  <Providers setTitle={setTitle} />
                  {' '}
                </AdminRouteGuard>
              }
              />
               <Route
                path="/cat_proveedores"
                element={
                  <AdminRouteGuard>
                  {' '}
                  <ProveedoresCat setTitle={setTitle} />
                  {' '}
                </AdminRouteGuard>
              }
              />
              <Route
                path="/customers"
                element={
                <AdminRouteGuard>
                  {' '}
                  <Customers setTitle={setTitle} />
                  {' '}
                </AdminRouteGuard>
              }
              />
              <Route
                path="/sales"
                element={<Sales setTitle={setTitle} />}
              />

              {/* <Route path="/tasks/:id/edit" element={<EditTask/>}/> */}
              <Route
                path="/inventoryproduct"
                element={
                  <AdminRouteGuard>
                    {' '}
                    <InventoryProduct setTitle={setTitle} />{' '}
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/inventorypurchases"
                element={
                  <AdminRouteGuard>
                    {' '}
                    <InventoryPurchases setTitle={setTitle} />{' '}
                  </AdminRouteGuard>
                }
              />
              
              <Route
                path="/inventorysale"
                element={
                  <AdminRouteGuard>
                    {' '}
                    <InventorySales setTitle={setTitle} />{' '}
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/purchases"
                element={
                <AdminRouteGuard>
                  {' '}
                  <Purchases setTitle={setTitle} />
                  {' '}
                </AdminRouteGuard>
              }
                
              />
              <Route path="*" element={<Navigate replace to="/home" />} />
            </Route>

            <Route element={<RestrictedRoutes />}>
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>

          {/* </Sidebar> */}
        </BrowserRouter>
      </SkeletonTheme>
    </>
  )
}

export default App
