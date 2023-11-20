import React, {useRef, ElementRef, FC, useMemo, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useDelete, useFetch} from 'hooks';
import {Avatar, Button, Card, Dropdown, Space} from 'antd';
// @ts-ignore
import {Graph, GraphProps} from 'react-d3-graph';
import {
  BankOutlined,
  RadarChartOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  EyeOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import AddOrganizationModal from 'containers/organization/AddOrganization';
import SetOrganizationModal from 'containers/organization/SetOrganization';
import ShowOrganizationUserModal from 'containers/organization/ShowOrganizationUser';
import findIndex from 'lodash/findIndex';
import {generateUniqueColorCodeById, getImageUrl, getLangSearchParam} from 'utils';
import {DeedLogoImg} from 'assets';

const ShowGraph: FC = () => {
  const {t} = useTranslation('organization');
  const history = useHistory();
  const CardRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const addOrganizationRef = useRef<ElementRef<typeof AddOrganizationModal>>(null);
  const setOrganizationRef = useRef<ElementRef<typeof SetOrganizationModal>>(null);
  const showOrganizationUserRef = useRef<ElementRef<typeof ShowOrganizationUserModal>>(null);

  const fetchOrganizationChart = useFetch({
    name: 'OrganizationCharts',
    url: '/services/app/DeedCharts/GetAll',
    query: {
      SkipCount: 0,
      MaxResultCount: 500
    },
    enabled: true
  });

  const deleteRequest = useDelete({
    url: 'services/app/DeedCharts/Delete',
    name: 'OrganizationCharts',
    titleKey: 'label'
  });

  const data = useMemo(() => {
    const filtredNodes = fetchOrganizationChart?.data?.items?.filter(
      (organization: any) => !!organization?.deedChart?.leafPath
    );
    const nodes = filtredNodes?.map((organization: any) => {
      const link = organization?.deedChart?.leafPath?.slice(0, -1)?.split('\\');
      return {
        id: `${organization?.deedChart?.id}`,
        leafPath: organization?.deedChart?.leafPath,
        organizationId: organization?.deedChart?.organizationId,
        parentId: organization?.deedChart?.parentId,
        logo: organization?.deedChart?.organizationLogo,
        label: organization?.deedChart?.caption,
        color:
          !!link?.[1] && !!organization?.deedChart?.organizationId ? generateUniqueColorCodeById(link?.[1]) : undefined
      };
    });
    const links: any[] = [];
    filtredNodes?.forEach((organization: any) => {
      const link = organization?.deedChart?.leafPath?.slice(0, -1)?.split('\\');
      const source = link?.[link.length - 2];
      const target = link?.[link.length - 1];
      if (
        link.length > 1 &&
        findIndex(fetchOrganizationChart?.data?.items, ['deedChart.id', +source]) > -1 &&
        findIndex(fetchOrganizationChart?.data?.items, ['deedChart.id', +target]) > -1
      )
        links.push({
          source,
          target,
          color: !!link?.[1] ? generateUniqueColorCodeById(link?.[1], 50) : undefined
        });
    });
    let source = null;
    if (nodes) {
      const targetNodes = new Set<string>();
      // Collect all target nodes from links
      links.forEach((link) => {
        targetNodes.add(link.target);
      });

      // Find the first node that is not a target at all
      for (const node of nodes) {
        if (!targetNodes.has(node.id)) {
          source = node;
          break;
        }
      }
    }
    return {nodes, links, source};
  }, [fetchOrganizationChart?.data]);

  const items = [
    {
      label: t('newOrganization'),
      key: 'addSubset',
      icon: <BankOutlined />
    }
  ];

  const anotherItems = [
    {
      label: t('detailOrganizationChart'),
      key: 'detailOrganizationChart',
      icon: <HomeOutlined />
    },
    {
      label: t('edit'),
      key: 'edit',
      icon: <EditOutlined />
    }
  ];

  const notSourceItems = [
    {
      label: t('delete'),
      key: 'delete',
      icon: <DeleteOutlined />
    }
  ];

  const organizationItem = [
    {
      label: t('showGlobalUsers'),
      key: 'showGlobalUsers',
      icon: <UserOutlined />
    },
    {
      label: t('showOrganizationChart'),
      key: 'showOrganizationChart',
      icon: <RadarChartOutlined />
    },
    {
      label: t('organizationProfile'),
      key: 'organizationProfile',
      icon: <EyeOutlined />
    }
  ];

  const calculateWidth = () => {
    const cardBodyWidth = CardRef.current?.querySelector('.ant-card-body')?.clientWidth;
    if (!!cardBodyWidth) setWidth(cardBodyWidth - 50 || 800);
  };

  useEffect(() => {
    calculateWidth();
  }, [CardRef.current]);

  const myConfig: GraphProps<any, any>['config'] | any = {
    automaticRearrangeAfterDropNode: false,
    collapsible: false,
    directed: true,
    focusAnimationDuration: 0.75,
    focusZoom: 1,
    freezeAllDragEvents: false,
    height: 700,
    highlightDegree: 0,
    // highlightDegree: 1,
    highlightOpacity: 1,
    linkHighlightBehavior: true,
    initialZoom: 0.75,
    maxZoom: 12,
    minZoom: 0.05,
    nodeHighlightBehavior: true,
    // nodeHighlightBehavior: false,
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
        const isFirstLayer = splitLayer?.length === 1;
        return (
          <div {...node} style={{...node.style, display: 'flex', justifyContent: 'center'}}>
            <Dropdown
              trigger={['click']}
              menu={{
                items: isFirstLayer
                  ? items
                  : !!node?.organizationId
                  ? data?.source?.id === node?.id
                    ? [...items, ...organizationItem, ...anotherItems]
                    : [...items, ...organizationItem, ...anotherItems, ...notSourceItems]
                  : [...anotherItems, ...notSourceItems],
                triggerSubMenuAction: 'click',
                onClick: ({key}) => {
                  switch (key) {
                    case 'showOrganizationChart':
                      history.push(getLangSearchParam(`/organization/graph/show/${node?.organizationId}`), {
                        nodeLabel: node?.label
                      });
                      break;
                    case 'detailOrganizationChart':
                      history.push(
                        getLangSearchParam(
                          !!node?.organizationId
                            ? `/organization/organization/edit/${node?.organizationId}`
                            : '/organization/organization/create'
                        ),
                        {
                          organization: {label: node?.label, id: node?.id}
                        }
                      );
                      break;
                    case 'organizationProfile':
                      history.push(getLangSearchParam(`/organization/organization/show/${node?.organizationId}`));
                      break;
                    case 'showGlobalUsers':
                      if (showOrganizationUserRef.current) showOrganizationUserRef.current.open(node?.organizationId);
                      break;
                    case 'addSubset':
                      if (addOrganizationRef.current) addOrganizationRef.current.open(node);
                      break;
                    case 'setOrganization':
                      if (setOrganizationRef.current) setOrganizationRef.current.open(node?.id, node?.label);
                      break;
                    case 'edit':
                      if (addOrganizationRef.current) addOrganizationRef.current.open(node, true);
                      break;
                    case 'delete':
                      deleteRequest.show(node, {Id: node?.id});
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
                className={`p-1 main-node ${isFirstLayer && 'bg-danger'}`}
                src={
                  isFirstLayer ? (
                    DeedLogoImg
                  ) : node?.logo ? (
                    getImageUrl(node?.logo)
                  ) : (
                    <HomeOutlined style={{fontSize: '1.7rem'}} />
                  )
                }
                style={{background: node?.fill || node?.color}}
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
      strokeWidth: 5,
      markerHeight: 6,
      markerWidth: 6,
      strokeDasharray: 1,
      strokeDashoffset: 1,
      strokeLinecap: 'round'
    }
  };

  const onReOrder = () => {
    setWidth(0);
    setTimeout(calculateWidth, 300);
  };

  return (
    <Card
      title={t('title')}
      loading={!data?.nodes?.length}
      ref={CardRef}
      extra={
        <Space size="small">
          <Button className="sm:w-unset mr-auto bg-orange" type="primary" onClick={onReOrder} icon={<ReloadOutlined />}>
            {t('reOrder')}
          </Button>
        </Space>
      }>
      {!!width && (
        <>
          <Graph id="graph-id" className="w-full" data={data} config={myConfig} />
          <AddOrganizationModal ref={addOrganizationRef} />
          <SetOrganizationModal ref={setOrganizationRef} />
          <ShowOrganizationUserModal ref={showOrganizationUserRef} isGlobal />
        </>
      )}
    </Card>
  );
};

export default ShowGraph;
