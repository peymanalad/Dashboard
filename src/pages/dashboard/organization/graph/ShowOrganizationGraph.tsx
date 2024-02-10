import React, {useRef, ElementRef, FC, useMemo, useEffect, useState} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useFetch, usePost} from 'hooks';
import {Avatar, Card, Dropdown} from 'antd';
// @ts-ignore
import {Graph, GraphProps} from 'react-d3-graph';
import {UserOutlined, UserAddOutlined, HomeOutlined, RadarChartOutlined} from '@ant-design/icons';
import ShowOrganizationUserModal from 'containers/organization/ShowOrganizationUser';
import AddOrganizationUserModal from 'containers/organization/AddOrganizationUser';
import AddOrganizationModal from 'containers/organization/AddOrganization';
import findIndex from 'lodash/findIndex';
import {getImageUrl} from 'utils';

const ShowOrganizationGraph: FC = () => {
  const {t} = useTranslation('organization');
  const CardRef = useRef<HTMLDivElement | null>(null);
  const {id} = useParams<{id?: string}>();
  const location = useLocation<any>();
  const [width, setWidth] = useState<number | null>(null);
  const showOrganizationUserRef = useRef<ElementRef<typeof ShowOrganizationUserModal>>(null);
  const addOrganizationUserRef = useRef<ElementRef<typeof AddOrganizationUserModal>>(null);
  const addOrganizationRef = useRef<ElementRef<typeof AddOrganizationModal>>(null);

  const fetchOrganizationChart = useFetch({
    name: ['OrganizationChart', id],
    url: '/services/app/OrganizationCharts/GetAllForOrganization',
    query: {
      organizationId: id,
      SkipCount: 0,
      MaxResultCount: 200
    },
    enabled: true
  });

  const createOrganization = usePost({
    url: 'services/app/OrganizationCharts/CreateOrEdit',
    refetchQueries: [['OrganizationChart', id]]
  });

  const data = useMemo(() => {
    const nodes = fetchOrganizationChart?.data?.map((organization: any) => ({
      id: `${organization?.organizationChart?.id}`,
      leafPath: organization?.organizationChart?.leafPath,
      organizationId: organization?.organizationChart?.organizationId,
      logo: organization?.organizationChart?.organizationLogo,
      label: organization?.organizationChart?.caption
    }));
    const links: any[] = [];
    fetchOrganizationChart?.data?.forEach((organization: any) => {
      const link = organization?.organizationChart?.leafPath?.slice(0, -1)?.split('\\');
      const source = link?.[link.length - 2];
      const target = link?.[link.length - 1];
      if (
        link.length > 1 &&
        findIndex(fetchOrganizationChart?.data, ['organizationChart.id', +source]) > -1 &&
        findIndex(fetchOrganizationChart?.data, ['organizationChart.id', +target]) > -1
      )
        links.push({
          source,
          target
        });
    });
    return {nodes, links};
  }, [fetchOrganizationChart?.data]);

  const mainOrganization = useMemo(() => fetchOrganizationChart?.data?.[0], [fetchOrganizationChart?.data]);

  useEffect(() => {
    if (!fetchOrganizationChart?.isFetching && !mainOrganization) {
      createOrganization.post({caption: location?.state?.nodeLabel, organizationId: id});
    }
  }, [fetchOrganizationChart?.isFetching, mainOrganization]);

  const items = [
    {
      label: t('addOrganizationChart'),
      key: 'addOrganizationChart',
      icon: <RadarChartOutlined />
    },
    {
      label: t('showUsers'),
      key: 'showUsers',
      icon: <UserOutlined />
    },
    {
      label: t('addUser'),
      key: 'addUser',
      icon: <UserAddOutlined />
    }
  ];

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
    freezeAllDragEvents: true,
    height: 700,
    highlightDegree: 1,
    highlightOpacity: 0.2,
    linkHighlightBehavior: true,
    initialZoom: 0.5,
    maxZoom: 12,
    minZoom: 0.05,
    nodeHighlightBehavior: true,
    panAndZoom: false,
    staticGraph: true,
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
        return (
          <div {...node} style={{...node.style, display: 'flex', justifyContent: 'center'}}>
            <Dropdown
              trigger={['click']}
              menu={{
                items,
                triggerSubMenuAction: 'click',
                onClick: ({key}) => {
                  switch (key) {
                    case 'showUsers':
                      if (showOrganizationUserRef.current) showOrganizationUserRef.current.open(node?.id);
                      break;
                    case 'addOrganizationChart':
                      if (addOrganizationRef.current) addOrganizationRef.current.open(node?.id);
                      break;
                    case 'addUser':
                      if (addOrganizationUserRef.current) addOrganizationUserRef.current.open(node?.id);
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
                className={`p-1 main-node ${!!node?.organizationId && 'bg-danger'}`}
                src={
                  mainOrganization?.id === node?.id ? (
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
    <Card
      title={t('organizationChatFor', {name: mainOrganization?.organizationChart?.caption})}
      loading={!data?.nodes?.length}
      ref={CardRef}>
      {!!width && (
        <>
          <Graph id="graph-id" className="w-full" data={data} config={myConfig} />
          <ShowOrganizationUserModal ref={showOrganizationUserRef} />
          <AddOrganizationUserModal ref={addOrganizationUserRef} organizationId={id} />
          <AddOrganizationModal ref={addOrganizationRef} organizationId={id} />
        </>
      )}
    </Card>
  );
};

export default ShowOrganizationGraph;
