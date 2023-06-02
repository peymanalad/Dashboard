import React from 'react';
import {Menu, Dropdown, Button} from 'antd';
import {MoreOutlined} from '@ant-design/icons';
import map from 'lodash/map';
import {menuItem} from 'types/general';

export interface props {
  items: menuItem[];
}

const DropDownMenu = ({items}: props) => {
  const menu = (
    <Menu>
      {map(items, (item: menuItem, index: number) => (
        <Menu.Item
          key={index}
          icon={item?.icon}
          onClick={item?.onClick}
          danger={item?.danger}
          disabled={item?.disabled}>
          {item?.name}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown overlay={menu}>
      <Button type="text" style={{color: '#aeb5b8'}} icon={<MoreOutlined />} />
    </Dropdown>
  );
};
export default DropDownMenu;
