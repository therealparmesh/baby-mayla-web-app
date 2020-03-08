import { Drawer } from 'antd';

export const Modal = ({ children, title, isOpen, onClose }) => {
  return (
    <Drawer
      headerStyle={{ padding: '16px' }}
      bodyStyle={{ padding: '32px' }}
      title={title}
      placement="bottom"
      height="100%"
      width="100%"
      visible={isOpen}
      onClose={onClose}
    >
      {isOpen && children}
    </Drawer>
  );
};
