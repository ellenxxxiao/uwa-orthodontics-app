import React, { ReactNode } from 'react';
import Footer from '../footer/footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen  w-[500px]">
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
