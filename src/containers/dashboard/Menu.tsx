import React, {FC, useMemo} from 'react';
import {Menu, Tooltip} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {getFilteredMenusList} from 'router/dashboard';
import {useLocation, NavLink} from 'react-router-dom';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';
import join from 'lodash/join';
import split from 'lodash/split';
import {useUser} from 'hooks';
import {dashboardRouteProps, subDashboardRouteProps} from 'types/dashboard';

interface Props {
  onChangeRoute?: () => void;
}

const {SubMenu, Item} = Menu;

const SideMenu: FC<Props> = ({onChangeRoute}) => {
  const {pathname} = useLocation();
  const user = useUser();

  const createSubs = (parentKey?: string, subMenus?: Array<subDashboardRouteProps>) =>
    compact(
      map(subMenus, (subMenu: subDashboardRouteProps): any =>
        isEmpty(subMenu.subs) ? (
          !subMenu.hidden && (
            <Item key={subMenu.route} className="side-menu-item">
              <NavLink to={subMenu?.route || ''} onClick={onChangeRoute}>
                {subMenu.title}
              </NavLink>
              {subMenu?.extra && (
                <Tooltip title={subMenu?.extra.title}>
                  <NavLink className="side-menu-item-extra" to={subMenu.extra.route} onClick={onChangeRoute}>
                    <PlusOutlined className="text-xs text-white" />
                  </NavLink>
                </Tooltip>
              )}
            </Item>
          )
        ) : (
          <SubMenu key={join(compact([parentKey, subMenu.key]), '.')} title={subMenu?.title} icon={subMenu?.icon}>
            {createSubs(subMenu.key, subMenu?.subs)}
          </SubMenu>
        )
      )
    );

  const filterMenu = useMemo(() => getFilteredMenusList(user?.getAllPermissions(), user?.isSuperUser()), [user]);

  return (
    <Menu
      mode="inline"
      theme="dark"
      style={{background: '#0A325A'}}
      defaultSelectedKeys={[pathname]}
      defaultOpenKeys={window.innerWidth < 992 && window.innerWidth > 767 ? undefined : split(pathname, '/')}
      className="w-full border-0">
      {map(filterMenu, (item: dashboardRouteProps) =>
        item?.route && !item?.hidden ? (
          <Item icon={item?.icon} className="side-menu-item" key={item.route}>
            {item?.key === 'dashboard' ? (
              <a href={item.route} onClick={onChangeRoute}>
                {item.title}
              </a>
            ) : (
              <NavLink to={item.route} onClick={onChangeRoute}>
                {item.title}
              </NavLink>
            )}
          </Item>
        ) : (
          !isEmpty(item?.subs) && (
            <SubMenu key={item.key} title={item.title} icon={item.icon}>
              {createSubs(item?.key, item?.subs)}
            </SubMenu>
          )
        )
      )}
    </Menu>
  );
};
export default SideMenu;
