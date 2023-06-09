import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Drawer } from '@alfalab/core-components/drawer';

import { ListMIcon } from '@alfalab/icons-glyph/ListMIcon';

import { ROUTES } from 'routes/constants';

import styles from './header.module.css';

import { NavigationSidebar } from './components';

const Header = () => {
  const location = useLocation();
  const [showNavigationSidebar, setShowNavigationSidebar] = useState(false);

  const handleOpenSidebarClick = () => {
    setShowNavigationSidebar(true);
  };
  const handleCloseSidebar = () => {
    setShowNavigationSidebar(false);
  };

  useEffect(() => {
    handleCloseSidebar();
  }, [location.pathname]);

  return (
    <header className={styles.header} data-test-id='header'>
      <Link to={ROUTES.homePage} className={styles.logo}>
        A-Store
      </Link>

      <button className={styles.sidebarToggle} type='button' onClick={handleOpenSidebarClick}>
        <span>меню</span>
        <ListMIcon />
      </button>

      <Drawer open={showNavigationSidebar} onClose={handleCloseSidebar} className={styles.sidebar}>
        <NavigationSidebar />
      </Drawer>
    </header>
  );
};

export { Header };
