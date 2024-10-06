import React from 'react'
/* icons */
import { RiArrowDownSFill } from 'react-icons/ri'
import { RiArrowUpSFill } from 'react-icons/ri'


import { FaHome, FaProductHunt } from 'react-icons/fa'
import { MdOutlinePointOfSale } from "react-icons/md";
import { FiShoppingCart } from 'react-icons/fi'
import { MdAddShoppingCart, MdCreditScore, MdInventory } from 'react-icons/md'
import { BsFillCalculatorFill, BsFillInboxFill } from 'react-icons/bs'
// creditos
import { GiCash } from 'react-icons/gi'
import { FaUsersCog } from 'react-icons/fa'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { TbAdjustmentsAlt } from 'react-icons/tb'
import { MdAssignmentAdd } from 'react-icons/md'
import { FaHandHoldingDollar, FaTruckArrowRight } from 'react-icons/fa6'
import { PiUserListFill } from "react-icons/pi";
/* Arrows */
import { RiShoppingBasketLine } from 'react-icons/ri'
import { FcSalesPerformance } from 'react-icons/fc'
// import { FaHandHoldingDollar } from 'react-icons/fa'
/* 
  MÓDULOS
  Dashboard
  Inventario (sub módulos --> compras ventas)
  caja
  Usuarios
  Reportes
  Config (sub módulos --> menu, proveedores clientes)
  */

export const SidebarData = [
  {
    title: "Inicio",
    path: "/home",
    icon: <FaHome />,
    // showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
  },
  {
    title: "Caja",
    path: "/cash-box",
    icon: <BsFillCalculatorFill />,
    // showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin

  },
  {
    title: "Operaciones",
    path: "/jjj",
    icon: <MdOutlinePointOfSale />,
    iconClosed: <RiArrowDownSFill 
                  size={25}
                />,
    iconOpened: <RiArrowUpSFill 
                  size={25}
                />,
    subNav: [
      {
        title: "Ventas",
        path: "/sales",
        icon: <FiShoppingCart/>,
        class: "nav-subItem",
      },
      {
        title: "Compras",
        path: "/purchases",
        icon: <MdAddShoppingCart/>,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      }
    ]
  },
  {
    title: "Inventario",
    path: "/jjz",
    icon: <MdInventory />,
    showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
    iconClosed: <RiArrowDownSFill 
                  size={25}
                />,
    iconOpened: <RiArrowUpSFill 
                  size={25}
                />,
    subNav: [
      {
        title: "Producto",
        path: "/inventoryproduct",
        icon: <FaProductHunt />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      },
      {
        title: "Compras",
        path: "/inventorypurchases",
        icon: <RiShoppingBasketLine />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      },
      {
        title: "Ventas",
        path: "/inventorysale",
        icon: <FaHandHoldingDollar/>,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      }
    ]
  },
  {
    title: "Reportes",
    path: "/reports",
    icon: <HiOutlineDocumentReport />,
    showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
    iconClosed: <RiArrowDownSFill 
                size={25}
                />,
    iconOpened: <RiArrowUpSFill
                size={25}            
                />,
    subNav: [
      {
        title: "Ventas",
        path: "/sreport",
        icon: <FaHandHoldingDollar />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      },
      {
        title: "Compras",
        path: "/shreport",
        icon: <FaTruckArrowRight />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      },
      {
        title: "Caja",
        path: "/breport",
        icon: <BsFillInboxFill />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      }
    ]
  },
  {
    title: "Usuarios",
    path: "/users",
    icon: <FaUsersCog />,
    showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
  },
  {
    title: "Configuración",
    path: "/ki",
    icon: <TbAdjustmentsAlt />,
    showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
    iconClosed: <RiArrowDownSFill 
                size={25}
                />,
    iconOpened: <RiArrowUpSFill
                size={25}            
                />,
    subNav: [
      {
        title: "Producto",
        path: "/products",
        icon: <MdAssignmentAdd />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      },
      {
        title: "Proveedores",
        path: "/providers",
        icon: <FaTruckArrowRight />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      },
      {
        title: "Clientes",
        path: "/customers",
        icon: <PiUserListFill />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      }
    ]
  }
];