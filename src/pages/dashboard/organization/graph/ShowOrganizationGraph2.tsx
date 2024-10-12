import React, {useRef, ElementRef, FC, useMemo, useEffect, useState, useCallback} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useDelete, useFetch, usePost} from 'hooks';
import {Card, Dropdown} from 'antd';
// @ts-ignore
import {Tree, TreeNode} from 'react-organizational-chart';
import {UserOutlined, UserAddOutlined, RadarChartOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import ShowOrganizationUserModal from 'containers/organization/ShowOrganizationUser';
import AddOrganizationUserModal from 'containers/organization/AddOrganizationUser';
import AddOrganizationModal from 'containers/organization/AddOrganization';
import {convertSlashRootToNestedArray} from 'utils';

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

  const deleteRequest = useDelete({
    url: 'services/app/OrganizationCharts/Delete',
    name: ['OrganizationChart', id],
    titleKey: 'caption'
  });

  const mainOrganization = useMemo(() => fetchOrganizationChart?.data?.[0], [fetchOrganizationChart?.data]);

  useEffect(() => {
    if (!fetchOrganizationChart?.isFetching && !mainOrganization) {
      createOrganization.post({caption: location?.state?.nodeLabel, organizationId: id});
    }
  }, [fetchOrganizationChart?.isFetching, mainOrganization]);

  const nestedArrayData = useMemo(
    () => convertSlashRootToNestedArray(fetchOrganizationChart?.data || []),
    [fetchOrganizationChart?.data]
  );

  const items = [
    {
      label: t('addOrganizationChart'),
      key: 'addOrganizationChart',
      icon: <RadarChartOutlined />
    },
    {
      label: t('showOfficeUsers'),
      key: 'showUsers',
      icon: <UserOutlined />
    },
    {
      label: t('addOfficeUser'),
      key: 'addUser',
      icon: <UserAddOutlined />
    },
    {
      label: t('edit'),
      key: 'edit',
      icon: <EditOutlined />
    },
    {
      label: t('delete'),
      key: 'delete',
      icon: <DeleteOutlined />
    }
  ];

  const viewGenerator = useCallback(
    (node: any) => (
      <div style={{display: 'flex', justifyContent: 'center'}}>
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
                  if (addOrganizationRef.current) addOrganizationRef.current.open(node);
                  break;
                case 'addUser':
                  if (addOrganizationUserRef.current) addOrganizationUserRef.current.open(node?.id);
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
          <div className="text-base text-white bg-red rounded-lg p-3 cursor-pointer">{node?.caption}</div>
        </Dropdown>
      </div>
    ),
    []
  );

  useEffect(() => {
    const cardBodyWidth = CardRef.current?.querySelector('.ant-card-body')?.clientWidth;
    if (!!cardBodyWidth) setWidth(cardBodyWidth - 50 || 800);
  }, [CardRef.current]);

  const generateChildren = (children: any[]) => {
    return children?.map((child) => (
      <TreeNode label={viewGenerator(child?.organizationChart)}>{generateChildren(child?.children)}</TreeNode>
    ));
  };

  return (
    <Card
      title={t('organizationChatFor', {name: mainOrganization?.organizationChart?.caption})}
      loading={!nestedArrayData?.length}
      ref={CardRef}>
      {!!width && (
        <div style={{direction: 'ltr', overflowX: 'scroll'}} className="pb-8">
          <Tree
            lineWidth="2px"
            lineColor="green"
            lineBorderRadius="10px"
            label={viewGenerator(nestedArrayData?.[0]?.organizationChart)}>
            {generateChildren(nestedArrayData?.[0]?.children)}
          </Tree>
          <ShowOrganizationUserModal ref={showOrganizationUserRef} />
          <AddOrganizationUserModal ref={addOrganizationUserRef} organizationId={id} />
          <AddOrganizationModal ref={addOrganizationRef} organizationId={id} />
        </div>
      )}
    </Card>
  );
};

export default ShowOrganizationGraph;
