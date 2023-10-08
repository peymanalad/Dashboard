import React, {useRef, ElementRef, FC, useMemo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch} from 'hooks';
import {Avatar, Card, Dropdown} from 'antd';
// @ts-ignore
import {Graph, GraphProps} from 'react-d3-graph';
import {UserOutlined, UserAddOutlined, UsergroupAddOutlined, BankOutlined} from '@ant-design/icons';
import ShowOrganizationUserModal from 'containers/organization/ShowOrganizationUser';
import AddOrganizationModal from 'containers/organization/AddOrganization';
import SetOrganizationModal from 'containers/organization/SetOrganization';
import AddOrganizationUserModal from 'containers/organization/AddOrganizationUser';
import findIndex from 'lodash/findIndex';
import {getImageUrl} from 'utils';
import {DeedLogoImg} from 'assets';
import {HomeOutlined} from '@ant-design/icons';

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
    query: {
      SkipCount: 0,
      MaxResultCount: 200
    },
    enabled: true
  });

  const data = useMemo(() => {
    const nodes = fetchOrganizationChart?.data?.items?.map((organization: any) => ({
      id: `${organization?.organizationChart?.id}`,
      leafPath: organization?.organizationChart?.leafPath,
      organizationId: organization?.organizationChart?.organizationId,
      logo: organization?.organizationChart?.organizationLogo,
      label: organization?.organizationChart?.caption
    }));
    const links: any[] = [];
    fetchOrganizationChart?.data?.items?.forEach((organization: any) => {
      const link = organization?.organizationChart?.leafPath?.slice(0, -1)?.split('\\');
      const source = link?.[link.length - 2];
      const target = link?.[link.length - 1];
      if (
        link.length > 1 &&
        findIndex(fetchOrganizationChart?.data?.items, ['organizationChart.id', +source]) > -1 &&
        findIndex(fetchOrganizationChart?.data?.items, ['organizationChart.id', +target]) > -1
      )
        links.push({
          source,
          target
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
    automaticRearrangeAfterDropNode: false,
    collapsible: false,
    directed: true,
    focusAnimationDuration: 0.75,
    focusZoom: 1,
    freezeAllDragEvents: false,
    height: 700,
    highlightDegree: 1,
    highlightOpacity: 0.2,
    linkHighlightBehavior: true,
    initialZoom: 0.5,
    maxZoom: 12,
    minZoom: 0.05,
    nodeHighlightBehavior: true,
    panAndZoom: false,
    staticGraph: false,
    staticGraphWithDragAndDrop: false,
    width: width || 800,
    d3: {
      alphaTarget: 0.05,
      gravity: -1000,
      linkLength: 200,
      linkStrength: 1.5,
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
      renderLabel: true,
      size: {
        height: 700,
        width: 700
      },
      strokeColor: 'none',
      strokeWidth: 1.5,
      // svg: '',
      symbolType: 'circle',
      viewGenerator: (node: any) => {
        const splitLayer = node?.leafPath?.slice(0, -1)?.split('\\');
        const isSecondLayer = splitLayer?.length === 2;
        const isFirstLayer = splitLayer?.length === 1;
        return (
          <div {...node} style={{...node.style, display: 'flex', justifyContent: 'center'}}>
            <Dropdown
              trigger={['click']}
              menu={{
                items: isSecondLayer && !node?.organizationId ? [...items, setOrganizationAction] : items,
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
              <Avatar
                size={55}
                className={`p-1 main-node ${!!node?.organizationId && 'bg-danger'} ${isFirstLayer && 'bg-primary'}`}
                src={
                  isFirstLayer ? (
                    DeedLogoImg
                  ) : node?.logo ? (
                    getImageUrl(node?.logo)
                  ) : (
                    <HomeOutlined style={{fontSize: '1.7rem'}} />
                  )
                }
                style={{background: node?.fill}}
              />
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
    <Card title={t('title')} loading={!data?.nodes?.length} ref={CardRef}>
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
