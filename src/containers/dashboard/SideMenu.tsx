import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useLayoutEffect,
  useState
} from 'react';
import ScrollArea from 'react-scrollbar';
import {Layout, Avatar, Row, Space, Typography, Drawer, Button} from 'antd';
import {RightOutlined, CloseOutlined} from '@ant-design/icons';
import {SideMenuDetail} from 'containers';
import {DeedLogoImg} from 'assets';
import {useTranslation} from 'react-i18next';
import {CSSTransition} from 'react-transition-group';

interface refProps {
  collapseMenu: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const {Sider} = Layout;
const {Text} = Typography;

const SideMenu: ForwardRefRenderFunction<refProps, props> = (props: props, forwardedRef: ForwardedRef<refProps>) => {
  const {t} = useTranslation('side_menu');

  const [collapsed, setCollapsed] = useState<boolean>(window.innerHeight < 992);

  const collapseMenu = () => setCollapsed((prevState: boolean) => !prevState);

  useImperativeHandle(forwardedRef, () => ({
    collapseMenu
  }));

  useLayoutEffect(() => {
    function updateSize() {
      if (window.innerWidth < 992 && window.innerWidth > 767) {
        setCollapsed(true);
      } else if (collapsed) setCollapsed(false);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <Row className="bg-header">
      {/*@ts-ignore*/}
      <ScrollArea className="h-full d-none md:d-block" speed={1} horizontal={false}>
        <Sider width={220} collapsible trigger={null} collapsed={collapsed} className="bg-white">
          <Row className="bg-white flex-center flex-col">
            <Row className="w-full h-20 bg-header flex flex-row px-2 items-center justify-around">
              <Space align="center" size={1} className="flex flex-row">
                <Avatar size={30} src={DeedLogoImg} />
                <CSSTransition in={!collapsed} timeout={600} classNames="menu-title" unmountOnExit>
                  <Text className="px-3 text-lg text-white font-bold">{t('deed')}</Text>
                </CSSTransition>
                <Button
                  type="text"
                  onClick={collapseMenu}
                  className="d-none lg:d-block"
                  icon={<RightOutlined className={`text-white font-bold ${collapsed ? 'rotate-180' : ''}`} />}
                />
              </Space>
            </Row>
          </Row>
          <SideMenuDetail />
        </Sider>
      </ScrollArea>
      <Drawer
        title={
          <Row className="flex flex-row justify-between items-center">
            <Avatar size={40} src={DeedLogoImg} />
            <Text className="px-3 text-lg text-white font-bold">{t('deed')}</Text>
            <Button type="text" onClick={collapseMenu} icon={<CloseOutlined className="text-white" />} />
          </Row>
        }
        rootClassName="md:d-none"
        closable={false}
        width={350}
        contentWrapperStyle={{maxWidth: '100vw'}}
        bodyStyle={{paddingRight: 0, paddingLeft: 0}}
        headerStyle={{color: 'white', paddingTop: '1.5rem'}}
        placement="right"
        onClose={collapseMenu}
        visible={collapsed}>
        <SideMenuDetail onChangeRoute={collapseMenu} />
      </Drawer>
    </Row>
  );
};
export default forwardRef(SideMenu);
