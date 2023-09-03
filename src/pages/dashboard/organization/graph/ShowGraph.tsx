import React, {useRef, ElementRef, FC, useMemo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch} from 'hooks';
import {Button, Card, Dropdown, Space} from 'antd';
// @ts-ignore
import {Graph, GraphProps} from 'react-d3-graph';
import {UserOutlined, UserAddOutlined, UsergroupAddOutlined, BankOutlined} from '@ant-design/icons';
import ShowOrganizationUserModal from 'containers/organization/ShowOrganizationUser';
import AddOrganizationModal from 'containers/organization/AddOrganization';
import SetOrganizationModal from 'containers/organization/SetOrganization';
import AddOrganizationUserModal from 'containers/organization/AddOrganizationUser';

const ShowGraph: FC = () => {
  const {t} = useTranslation('organization');
  const CardRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const showOrganizationUserRef = useRef<ElementRef<typeof ShowOrganizationUserModal>>(null);
  const addOrganizationRef = useRef<ElementRef<typeof ShowOrganizationUserModal>>(null);
  const setOrganizationRef = useRef<ElementRef<typeof SetOrganizationModal>>(null);
  const addOrganizationUserRef = useRef<ElementRef<typeof AddOrganizationUserModal>>(null);

  const fetchOrganizationChart = useFetch({
    name: 'OrganizationCharts',
    url: '/services/app/OrganizationCharts/GetAll',
    enabled: true
  });

  const data = useMemo(() => {
    const nodes = fetchOrganizationChart?.data?.items?.map((organization: any) => ({
      id: `${organization?.organizationChart?.id}`,
      leafPath: organization?.organizationChart?.leafPath,
      label: organization?.organizationChart?.caption
    }));
    const links: any[] = [];
    fetchOrganizationChart?.data?.items?.forEach((organization: any) => {
      const link = organization?.organizationChart?.leafPath?.slice(0, -1)?.split('\\');
      if (link.length > 1)
        links.push({
          source: link?.[link.length - 2],
          target: link?.[link.length - 1]
        });
    });
    return {nodes, links};
  }, [fetchOrganizationChart?.data]);

  const items = [
    {
      label: t('showUsers'),
      key: 'showUsers',
      icon: <UserOutlined />
    },
    {
      label: t('addUser'),
      key: 'addUser',
      icon: <UserAddOutlined />
    },
    {
      label: t('addSubset'),
      key: 'addSubset',
      icon: <UsergroupAddOutlined />
    }
  ];

  const setOrganizationAction = {
    label: t('setOrganization'),
    key: 'setOrganization',
    icon: <BankOutlined />
  };

  useEffect(() => {
    const cardBodyWidth = CardRef.current?.querySelector('.ant-card-body')?.clientWidth;
    if (!!cardBodyWidth) setWidth(cardBodyWidth - 50 || 800);
  }, [CardRef.current]);

  const myConfig: GraphProps<any, any>['config'] | any = {
    automaticRearrangeAfterDropNode: true,
    collapsible: false,
    directed: true,
    focusAnimationDuration: 0.75,
    focusZoom: 1,
    freezeAllDragEvents: false,
    height: 600,
    highlightDegree: 1,
    highlightOpacity: 0.2,
    linkHighlightBehavior: true,
    initialZoom: 0.7,
    maxZoom: 12,
    minZoom: 0.05,
    nodeHighlightBehavior: true,
    panAndZoom: false,
    staticGraph: false,
    staticGraphWithDragAndDrop: false,
    width: width || 800,
    d3: {
      alphaTarget: 0.05,
      gravity: -250,
      linkLength: 120,
      linkStrength: 2,
      disableLinkForce: false
    },
    node: {
      color: '#d3d3d3',
      fontColor: 'black',
      fontSize: 14,
      fontWeight: 'normal',
      highlightColor: 'red',
      highlightFontSize: 16,
      highlightFontWeight: 'bold',
      highlightStrokeColor: 'red',
      highlightStrokeWidth: 1.5,
      mouseCursor: 'crosshair',
      opacity: 0.9,
      labelPosition: 'bottom',
      labelProperty: 'label',
      renderLabel: false,
      size: {
        height: 350,
        width: 1200
      },
      strokeColor: 'none',
      strokeWidth: 1.5,
      // svg: '',
      symbolType: 'circle',
      viewGenerator: (node: any) => {
        // console.log(node?.leafPath);
        const isSecondLayer = node?.leafPath?.slice(0, -1)?.split('\\')?.length === 2;
        return (
          <div {...node}>
            <Dropdown
              trigger={['click']}
              menu={{
                items: isSecondLayer ? [...items, setOrganizationAction] : items,
                triggerSubMenuAction: 'click',
                onClick: ({key}) => {
                  switch (key) {
                    case 'showUsers':
                      if (showOrganizationUserRef.current) showOrganizationUserRef.current.open(node?.id);
                      break;
                    case 'addUser':
                      if (addOrganizationUserRef.current) addOrganizationUserRef.current.open(node?.id);
                      break;
                    case 'addSubset':
                      if (addOrganizationRef.current) addOrganizationRef.current.open(node?.id);
                      break;
                    case 'setOrganization':
                      if (setOrganizationRef.current) setOrganizationRef.current.open(node?.id);
                      break;
                    default:
                      return;
                  }
                }
              }}
              placement="bottom"
              arrow>
              <Button style={{background: node?.fill}}>{node?.label}</Button>
            </Dropdown>
          </div>
        );
      }
    },
    link: {
      type: 'STRAIGHT',
      color: 'lightgray',
      fontColor: 'black',
      fontSize: 8,
      fontWeight: 'normal',
      highlightColor: 'red',
      highlightFontSize: 8,
      highlightFontWeight: 'normal',
      labelProperty: 'label',
      mouseCursor: 'pointer',
      opacity: 1,
      renderLabel: false,
      semanticStrokeWidth: true,
      strokeWidth: 3,
      markerHeight: 6,
      markerWidth: 6,
      strokeDasharray: 1,
      strokeDashoffset: 1,
      strokeLinecap: 'round'
    }
  };

  return (
    <Card
      title={t('title')}
      loading={!data?.nodes?.length}
      ref={CardRef}
      extra={
        <Space size="small">
          {/*<Button*/}
          {/*  type="primary"*/}
          {/*  className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset"*/}
          {/*  icon={<FormOutlined />}>*/}
          {/*  {t('add_organization')}*/}
          {/*</Button>*/}
        </Space>
      }>
      {!!width && (
        <>
          <Graph id="graph-id" className="w-full" data={data} config={myConfig} />
          <ShowOrganizationUserModal ref={showOrganizationUserRef} />
          <AddOrganizationModal ref={addOrganizationRef} />
          <SetOrganizationModal ref={setOrganizationRef} />
          <AddOrganizationUserModal ref={addOrganizationUserRef} />
        </>
      )}
    </Card>
  );
};

export default ShowGraph;
