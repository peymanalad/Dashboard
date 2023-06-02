import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Input, Form, Row, Col, Drawer, InputNumber} from 'antd';
import {SearchOutlined, CloseOutlined} from '@ant-design/icons';
import {MultiSelectPaginate, MultiSelect, SimpleSelect, DateTimePicker} from 'components';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'qs';
import mapLodash from 'lodash/map';
import {queryStringToObject} from 'utils';
import {providingType} from 'assets';
import type {Role} from 'types/common';
import toNumber from 'lodash/toNumber';
import {UserStatues} from 'assets/constants/User';

interface refProps {
  open: () => void;
  close: () => void;
}

interface props {
  ref: RefObject<refProps>;
}

const SearchUser: ForwardRefRenderFunction<refProps, props> = (props: props, forwardedRef: ForwardedRef<refProps>) => {
  const history = useHistory();
  const {t} = useTranslation('user-show');
  const queryObject = queryStringToObject(useLocation().search);

  const [role, setRole] = useState<Role | null>(queryObject?.role || null);
  const [visible, setVisible] = useState(false);

  const onFinish = (val: any) => {
    const searchValue: any = {
      ...val,
      id: val?.userId,
      role_id: val?.role?.id,
      clinics_id: val?.clinics?.id,
      group_id: val?.group?.id,
      specializations_id: mapLodash(val?.specializations, 'id'),
      diseases_id: mapLodash(val?.diseases, 'id'),
      doctors_id: mapLodash(val?.doctors, 'id')
    };
    history.replace({
      search: qs.stringify(searchValue)
    });
  };

  useImperativeHandle(forwardedRef, () => ({
    open() {
      setVisible(true);
    },
    close() {
      setVisible(false);
    }
  }));

  return (
    <Drawer
      title={t('search')}
      closable
      width={350}
      contentWrapperStyle={{maxWidth: '100vw'}}
      bodyStyle={{padding: 5, paddingBottom: 0}}
      placement="left"
      onClose={() => {
        setVisible(false);
      }}
      visible={visible}>
      <Form layout="vertical" className="h-full relative" onFinish={onFinish}>
        <Row className="d-block h-full overflow-auto px-4 pb-24" style={{maxHeight: '80vh'}}>
          <Form.Item name="name" label={t('name')} className="mb-1/2 label-p-0" initialValue={queryObject?.name}>
            <Input placeholder={t('empty')} className="w-full " />
          </Form.Item>
          <Form.Item name="mobile" label={t('mobile')} className="mb-1/2 label-p-0" initialValue={queryObject?.mobile}>
            <Input placeholder={t('empty')} className="w-full " />
          </Form.Item>
          <Form.Item
            name="username"
            label={t('username')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.username}>
            <Input type="single" className="w-full " placeholder={t('empty')} />
          </Form.Item>

          <Form.Item name="userId" label={t('id')} className="mb-1/2 label-p-0" initialValue={queryObject?.id}>
            <InputNumber className="w-full " placeholder={t('empty')} />
          </Form.Item>
          <Form.Item name="status" className="mb-1/2 label-p-0" label={t('status')}>
            <SimpleSelect keys="id" label="name" placeholder={t('choose')} data={UserStatues} />
          </Form.Item>
          <Form.Item
            name="created_from"
            label={t('created_from')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.created_from}>
            <DateTimePicker />
          </Form.Item>

          <Form.Item
            name="created_to"
            label={t('created_to')}
            className="mb-1/2 label-p-0"
            initialValue={queryObject?.created_to}>
            <DateTimePicker />
          </Form.Item>
          <Form.Item name="role" label={t('role')} className="mb-1/2 label-p-0" initialValue={queryObject?.role}>
            <MultiSelect
              url="roles/view_users"
              keyValue="id"
              keyLabel="title"
              onChange={(val: any) => setRole(val)}
              urlName="roles_view_users"
              placeholder={t('empty')}
              isGeneral={false}
              showSearch
              alignDropDownTop
            />
          </Form.Item>
          {toNumber(role?.id) === 4 && (
            <>
              <Form.Item
                name="doctors"
                label={t('doctor')}
                className="mb-1/2 label-p-0"
                initialValue={queryObject?.doctors}>
                <MultiSelectPaginate
                  mode="tags"
                  url="users/doctors"
                  keyValue="name"
                  keyLabel="full_name"
                  urlName="doctors"
                  isGeneral
                  showSearch
                  alignDropDownTop
                  placeholder={t('doctor')}
                />
              </Form.Item>
              <Form.Item name="group" className="mb-1/2 label-p-0" initialValue={queryObject?.group}>
                <MultiSelectPaginate
                  placeholder={t('groups')}
                  url="users/groups"
                  keyValue="id"
                  keyLabel="name"
                  urlName="groups"
                  isGeneral
                  showSearch
                  alignDropDownTop
                />
              </Form.Item>
            </>
          )}
          {toNumber(role?.id) === 2 && (
            <>
              <Form.Item
                name="diseases"
                label={t('disease')}
                className="mb-1/2 label-p-0"
                initialValue={queryObject?.diseases}>
                <MultiSelectPaginate
                  mode="tags"
                  url="diseases/paginate"
                  keyValue="id"
                  keyLabel="name"
                  urlName="disease"
                  isGeneral
                  showSearch
                  alignDropDownTop
                  dropDownWith={200}
                />
              </Form.Item>
              <Form.Item
                name="is_providing"
                label={t('providingStatus')}
                className="mb-1/2 label-p-0"
                initialValue={queryObject?.is_providing}>
                <SimpleSelect keys="id" label="name" placeholder={t('all')} allowClear data={providingType} />
              </Form.Item>
              <Form.Item
                name="specializations"
                label={t('specialty')}
                className="mb-1/2 label-p-0"
                initialValue={queryObject?.specializations}>
                <MultiSelectPaginate
                  mode="tags"
                  url="specializations/paginate"
                  keyValue="name"
                  keyLabel="name"
                  urlName="specializations"
                  isGeneral
                  showSearch
                  alignDropDownTop
                  dropDownWith={200}
                />
              </Form.Item>
            </>
          )}
          {toNumber(role?.id) === 6 && (
            <Form.Item
              name="clinics"
              label={t('clinic')}
              className="mb-1/2 label-p-0"
              initialValue={queryObject?.clinics}>
              <MultiSelectPaginate
                url="users/clinics"
                keyValue="id"
                keyLabel="name"
                urlName="clinics"
                isGeneral
                showSearch
                alignDropDownTop
                placeholder={t('all')}
              />
            </Form.Item>
          )}
        </Row>
        <Row
          gutter={24}
          className="flex flex-col sm:flex-row items-center justify-between w-full m-0 absolute bottom-0">
          <Col xs={24} sm={12} className="w-full">
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />} className="w-full">
              {t('search')}
            </Button>
          </Col>
          <Col xs={24} sm={12} className="flex justify-end items-center w-full my-4">
            <Button
              className="ant-btn-secondary w-full"
              type="primary"
              onClick={() => {
                history.replace({search: ''});
                setVisible(false);
              }}
              icon={<CloseOutlined />}>
              {t('delete')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default forwardRef(SearchUser);
