import React, {useRef, type ElementRef, type FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Link, useLocation, useParams} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete, useUser} from 'hooks';

interface Props {
  id?: string;
}

const ShowUserOrganizations: FC<Props> = ({id}) => {
  const {t} = useTranslation('organization');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const {hasPermission} = useUser();
  const location = useLocation();

  const deleteRequest = useDelete({
    url: '/services/app/Organizations/Delete',
    name: 'organizations',
    titleKey: 'organizationName'
  });

  const columns: any = [
    {
      title: '#',
      dataIndex: ['organization', 'id'],
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('name'),
      dataIndex: 'organizationName',
      key: 'organizationName',
      align: 'center'
    },
    {
      title: t('location'),
      dataIndex: 'organizationLocation',
      key: 'organizationLocation',
      align: 'center',
      sorter: false
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  return (
    <CustomTable
      fetch="services/app/User/GetListOfOrganizations"
      query={{userId: id}}
      path=""
      dataName={['users', 'organizations', id]}
      columns={columns}
    />
  );
};

export default ShowUserOrganizations;
