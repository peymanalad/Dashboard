import React, {Fragment} from 'react';
import {Row, Spin, Tabs} from 'antd';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {ShowAccountInfo, ShowProfessionInfo, ShowQuestionInfo, ShowContactInfo} from 'containers';
import {useFetch} from 'hooks';

const {TabPane} = Tabs;

function UserCreate() {
  const {t} = useTranslation('user_create');
  const {id} = useParams<{id?: string}>();

  const fetchAccess = useFetch({
    name: ['access_view', id],
    url: 'users/{id}/access_view',
    params: {id},
    enabled: true
  });

  return (
    <Fragment>
      {fetchAccess.isFetching ? (
        <Row className="w-full h-full flex-center">
          <Spin />
        </Row>
      ) : (
        <Tabs type="line" size="small" className="overflow-visible">
          {fetchAccess?.data?.account && (
            <TabPane tab={t('account_info.label')} key="AccountInfo">
              <ShowAccountInfo id={id} />
            </TabPane>
          )}
          {fetchAccess?.data?.profession && (
            <TabPane tab={t('profession_info.label')} key="ProfessionInfo">
              <ShowProfessionInfo id={id} />
            </TabPane>
          )}
          {fetchAccess?.data?.questions && (
            <TabPane tab={t('question_info.label')} key="QuestionInfo">
              <ShowQuestionInfo id={id} />
            </TabPane>
          )}
          {fetchAccess?.data?.contacts && (
            <TabPane tab={t('contact_info.label')} key="ContactInfo">
              <ShowContactInfo id={id} />
            </TabPane>
          )}
        </Tabs>
      )}
    </Fragment>
  );
}

export default UserCreate;
