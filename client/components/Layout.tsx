import React from 'react';
import Nav from './Nav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Nav />
      <div>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
