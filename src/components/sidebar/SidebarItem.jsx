import React,  { useState, useEffect }  from 'react'
import { NavLink } from 'react-router-dom'
// import { useSidebarOpenContext } from '../../providers/GlobalProvider'
import { useStore, useSubItem } from '../../providers/GlobalProvider'

import { useLocation, useNavigate } from 'react-router-dom';

function SidebarItem(props) {
  const isOpen = useStore();
  const { item } = props;
  const [subNav, setSubNav] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSubNav = (e) => {
    if (item.subNav) {
      e.preventDefault(); // Evita la navegación si hay submenús
      setSubNav(prevSubNav => !prevSubNav);
    } else {
      navigate(item.path); // Navega a la ruta si no hay submenús
    }
  };

  useEffect(() => {
    if (item.subNav) {
      const isActiveSubNav = item.subNav.some(subItem => subItem.path === location.pathname);
      if (isActiveSubNav) {
        setSubNav(true); // Mantén el submenú abierto si uno de los subitems está activo
      }
    }
  }, [item.subNav, location.pathname]);

  return (
    <>
      {/* Menú */}
      <div
        style={{ marginTop: '5px', cursor: 'pointer' }}
        className="link"
        onClick={toggleSubNav}
        title={item.title}
      >
        <div className="icon">{item.icon}</div>
        <span style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
          {item.title}
        </span>

        <div className="sidebar-arrow">
          {item.subNav && subNav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </div>

      {/* Subitems */}
      {subNav &&
        item.subNav.map((subItem, index) => (
          <NavLink
            to={subItem.path}
            key={index}
            className="nav-subItem link"
            activeclassname="active"
          >
            <div className="icon">{subItem.icon}</div>
            <span className="link_text" style={{ display: subNav && isOpen ? 'block' : 'none' }}>
              {subItem.title}
            </span>
          </NavLink>
        ))}
    </>
  );
}



export default SidebarItem
