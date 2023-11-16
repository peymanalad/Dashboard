import React, {FC, useEffect, useMemo} from 'react';
import {useFetch, useUser} from 'hooks';
import {SimpleSelect} from 'components';
import {useTranslation} from 'react-i18next';
import {useHistory, useLocation} from 'react-router-dom';
import {queryStringToObject} from 'utils';
import qs from 'qs';

interface props {
  hasAll?: boolean;
}

const SelectOrganization: FC<props> = ({hasAll, ...props}) => {
  const {t} = useTranslation('organization');
  const location = useLocation();
  const history = useHistory();

  const queryObject = queryStringToObject(location.search);
  const {getAllOrganizations} = useUser();
  const userOrganizations = getAllOrganizations();
  const selectedOrganization = queryObject?.organization;

  const fetchOrganizaion = useFetch({
    name: ['organizations', 'all'],
    url: '/services/app/Organizations/GetAll',
    query: {
      MaxResultCount: 500
    },
    enabled: !userOrganizations?.length
  });

  const organizations: any[] = useMemo(() => {
    if (userOrganizations?.length && !fetchOrganizaion?.isFetching)
      return userOrganizations?.map((userOrganization: any) => ({
        id: userOrganization?.organizationId,
        name: userOrganization?.organizationName
      }));
    const organizations = fetchOrganizaion?.data?.items?.map((organization: any) => ({
      id: organization?.organization?.id,
      name: organization?.leafCationPath || organization?.organization?.organizationName
    }));
    if (hasAll)
      organizations?.unshift({
        id: 0,
        name: t('allOrganizations')
      });
    return organizations;
  }, [userOrganizations, fetchOrganizaion?.data?.items]);

  const onChange = (organization: any) => {
    history.replace({
      search: qs.stringify({...queryObject, organization})
    });
  };

  useEffect(() => {
    if (organizations?.length && !selectedOrganization) onChange(organizations?.[0]);
  }, [organizations]);

  return (
    <SimpleSelect
      keys="id"
      label="name"
      className="w-full"
      placeholder={t('pleaseSelectOrganization')}
      loading={fetchOrganizaion?.isFetching}
      onChange={(val: any, i: any) => {
        onChange(i?.data);
      }}
      value={!organizations?.length ? selectedOrganization?.name : +selectedOrganization?.id}
      data={organizations}
      {...props}
    />
  );
};

export default SelectOrganization;
