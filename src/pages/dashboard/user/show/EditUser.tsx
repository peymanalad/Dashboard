import React, {FC, Fragment} from 'react';
import {Button, Row, Spin, Tabs} from 'antd';
import {WhatsAppOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {AccountInfo, FinanceInfo, ProfessionInfo, QuestionInfo, ContactInfo} from 'containers';
import {useFetch, useUser} from 'hooks';
import isEmpty from 'lodash/isEmpty';

const {TabPane} = Tabs;

const UserCreate: FC = () => {
  const {t} = useTranslation('user_create');
  const {idUser} = useParams<{idUser: string}>();
  const user = useUser();

  const id = idUser || user.getId();

  const fetchAccess = useFetch({
    name: ['access_user', id],
    url: 'users/{id}/access_update',
    params: {id},
    enabled: true
  });

  const fetchUser = useFetch({
    url: 'users/{id}/edit',
    name: ['user', id, 'account'],
    params: {id}
  });

  return (
    <Fragment>
      {fetchAccess.isFetching ? (
        <Row className="w-full h-full flex-center">
          <Spin />
        </Row>
      ) : (
        <Fragment>
          <Tabs type="line" size="small" className="overflow-visible">
            {fetchAccess?.data?.account && (
              <TabPane tab={t('account_info.label')} key="AccountInfo">
                <AccountInfo id={id} />
              </TabPane>
            )}
            {fetchAccess?.data?.profession && (
              <TabPane tab={t('profession_info.label')} key="ProfessionInfo">
                <ProfessionInfo id={id} />
              </TabPane>
            )}
            {fetchAccess?.data?.financial && (
              <TabPane tab={t('finance_info.label')} key="FinanceInfo">
                <FinanceInfo id={id} />
              </TabPane>
            )}
            {fetchAccess?.data?.questions && (
              <TabPane tab={t('question_info.label')} key="QuestionInfo">
                <QuestionInfo id={id} />
              </TabPane>
            )}
            {fetchAccess?.data?.contacts && (
              <TabPane tab={t('contact_info.label')} key="ContactInfo">
                <ContactInfo id={id} />
              </TabPane>
            )}
          </Tabs>
          {!isEmpty(fetchUser?.data?.mobile) && (
            <Button
              type="primary"
              href={`https://web.whatsapp.com/send?phone=${fetchUser?.data?.mobile}&text=.HI&app_absent=0`}
              target="_blank"
              className="h-12 w-12 ant-btn-success flex-center fixed b-2 shadow-md"
              shape="circle"
              icon={<WhatsAppOutlined className="text-3xl" />}
            />
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default UserCreate;
