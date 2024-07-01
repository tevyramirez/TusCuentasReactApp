import React from 'react';
import Sidebar from '../index';
import SidebarToggleButton from './SidebarButtonToggle';

interface SidebarWrapperProps {
  open: boolean;
  onToggle: () => void;
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ open, onToggle }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ${
        open ? 'w-64' : 'w-16'
      }`}
    >
      <Sidebar open={open} onClose={onToggle} />
    </div>
  );
};

export default SidebarWrapper;