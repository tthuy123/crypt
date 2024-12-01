import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './Topbar';

const Layout = () => {
  return (
    <>
      {/* TopBar */}
      <TopBar />

      {/* Nội dung chính của các route sẽ xuất hiện tại đây */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
