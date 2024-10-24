import React from 'react'
/* icons */
import { RiArrowDownSFill, RiFileList2Line } from 'react-icons/ri'
import { RiArrowUpSFill } from 'react-icons/ri'


import { FaAddressCard, FaCashRegister, FaHome, FaMoneyCheck, FaProductHunt, FaShopify } from 'react-icons/fa'
import { MdOutlinePointOfSale, MdOutlineSettingsApplications } from "react-icons/md";
import { FiShoppingCart } from 'react-icons/fi'
import { MdAddShoppingCart, MdCreditScore, MdInventory } from 'react-icons/md'
import { BsFillCalculatorFill, BsFillInboxFill } from 'react-icons/bs'

import { GiCash, GiHandTruck, GiReceiveMoney, GiSkirt } from 'react-icons/gi'
import { FaUsersCog } from 'react-icons/fa'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { TbAdjustmentsAlt, TbFileReport, TbReport } from 'react-icons/tb'
import { MdAssignmentAdd } from 'react-icons/md'
import { FaHandHoldingDollar, FaRegCircleUser, FaSackDollar, FaTruckArrowRight } from 'react-icons/fa6'
import { PiUserListFill } from "react-icons/pi";
/* Arrows */
import { RiShoppingBasketLine } from 'react-icons/ri'
import { FcSalesPerformance } from 'react-icons/fc'
import { IoMdHome } from 'react-icons/io';
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
    icon: <IoMdHome />,
    // showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
  },
  {
    title: "Caja",
    path: "/cash-box",
    icon: <FaCashRegister />,
    // showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin

  },
  {
    title: "Transacciones",
    path: "/jjj",
    icon: <FaMoneyCheck />,
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
        icon: <GiReceiveMoney />,
        class: "nav-subItem",
      },
      {
        title: "Compras",
        path: "/purchases",
        icon: <FaShopify />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar s   olo para admin
        class: "nav-subItem",
      }
    ]
  },
  {
    title: "Inventario",
    path: "/inventoryproduct",
    icon: <RiFileList2Line />,
    showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
    iconClosed: <RiArrowDownSFill 
                  size={25}
                />,
    iconOpened: <RiArrowUpSFill 
                  size={25}
                />
  },
  {
    title: "Reportes",
    path: "/reports",
    icon: <TbFileReport />,
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
        icon: <GiReceiveMoney />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      },
      {
        title: "Compras",
        path: "/shreport",
        icon: <FaShopify />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      },
      {
        title: "Caja",
        path: "/breport",
        icon: <FaCashRegister />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      }
    ]
  },
  {
    title: "Usuarios",
    path: "/users",
    icon: <FaRegCircleUser />,
    showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
  },
  {
    title: "Configuración",
    path: "/ki",
    icon: <MdOutlineSettingsApplications />,
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
        icon: <GiSkirt />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      },
      {
        title: "Proveedores",
        path: "/providers",
        icon: <GiHandTruck />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      },
      {
        title: "Clientes",
        path: "/customers",
        icon: <FaAddressCard />,
        showOnlyForAdmin: true, // Nuevo campo para mostrar solo para admin
        class: "nav-subItem",
      }
    ]
  }
];