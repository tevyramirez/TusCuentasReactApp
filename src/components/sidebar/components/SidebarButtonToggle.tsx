import React from 'react';
import { TbLayoutSidebarLeftCollapse } from 'react-icons/tb';

interface SidebarToggleButtonProps {
  open: boolean;
  onToggle: () => void;
}

const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({ open, onToggle }) => {
  return (
    <button
      className={`fixed top-4 right-4 z-50 cursor-pointer ${open ? 'hidden' : ''}`}
      onClick={onToggle}
    >
      <TbLayoutSidebarLeftCollapse />
    </button>
  );
};

export default SidebarToggleButton;