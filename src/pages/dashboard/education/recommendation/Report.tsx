import React, {FC, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {Button, Card, Col, Collapse, Divider, Form, Input, InputNumber, Row, Tooltip, Space, Radio} from 'antd';
import {usePost} from 'hooks';
import {FileSearchOutlined, ReloadOutlined, FileExcelOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import {DrillDownSelectPaginate, MultiSelect, MultiSelectPaginate, SimpleSelect} from 'components';
import {
  levelSurface,
  seasonType,
  recommendationStatus,
  doctorConfirmStatus,
  evidences,
  defaultUser,
  pictureStatus
} from 'assets';
import {RecommendationTable} from 'containers';
import qs from 'qs';
import {queryStringToObject} from 'utils';
import map from 'lodash/map';

export enum collapse {
  CLOSE,
  OPEN
}

const ReportRecommendation: FC = () => {
  const {t} = useTranslation('recommendation');
  const queryObject = queryStringToObject(useLocation().search);
  const history = useHistory();
  const isReportExcel = useRef<boolean>(false);
  const [form] = Form.useForm();

  const [collapseStatus, setCollapseStatus] = useState<collapse>(collapse.CLOSE);

  const getReportExcel = usePost({
    url: '/recommendations/report/excel',
    method: 'GET',
    timeout: 60000,
    onSuccess(data: any) {
      window.open(data.path, '_self');
    }
  });

  const genExtra = () => (
    <Space size="small">
      <Tooltip title={t('report_section.delete')}>
        <Button
          type="text"
          onClick={(event) => {
            event.stopPropagation();
            history.replace({search: ''});
          }}
          icon={<ReloadOutlined style={{color: '#ff4d4f', fontSize: 18}} />}
        />
      </Tooltip>
      <Tooltip title={t('report_section.get_Excel')}>
        <Button
          type="text"
          loading={getReportExcel.isLoading}
          icon={<FileExcelOutlined style={{color: '#4CAF50', fontSize: 18}} />}
          onClick={(event) => {
            event.stopPropagation();
            isReportExcel.current = true;
            form.submit();
          }}
        />
      </Tooltip>
      <Tooltip title={t('report_section.show')}>
        <Button
          type="text"
          onClick={(event) => {
            event.stopPropagation();
            isReportExcel.current = false;
            form.submit();
          }}
          icon={<FileSearchOutlined style={{color: '#1890ff', fontSize: 18}} />}
        />
      </Tooltip>
    </Space>
  );

  const changeCollapse = (key: any) => {
    key.length ? setCollapseStatus(collapse.OPEN) : setCollapseStatus(collapse.CLOSE);
  };

  const onFinish = (values: any) => {
    values.subjects_id = map(values?.subjects, 'id');
    values.references_id = map(values?.references, 'id');
    values.and_diseases_id = map(values?.and_diseases, 'id');
    values.exclude_diseases_id = map(values?.exclude_diseases, 'id');
    values.diseases_id = map(values?.diseases, 'id');
    values.sources_id = map(values?.sources, 'id');
    values.tags_id = map(values?.tags, 'id');
    values.categories_id = map(values?.categories, 'id');
    values.confirmed_doctors = map(values?.doctorsConfirmed, 'id');
    values.not_confirmed_doctors = map(values?.doctorsNotConfirmed, 'id');
    values.creator_id = values.creator?.id;
    values.researcher_id = values.researcher?.id;
    if (isReportExcel?.current) {
      getReportExcel.post({}, values);
    } else {
      history.replace({
        search: qs.stringify(values)
      });
    }
  };

  return (
    <Row>
      <Col span={24}>
        <Collapse activeKey={collapseStatus} onChange={changeCollapse}>
          <Collapse.Panel
            header={t('report_section.setting')}
            key="1"
            extra={collapseStatus === collapse.OPEN && genExtra()}>
            <Form form={form} layout="vertical" name="visit" requiredMark={false} onFinish={onFinish}>
              <Divider orientation="right">{t('titles')}</Divider>
              <Row gutter={[16, 8]} className="w-full">
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="search" label={t('search_field')} initialValue={queryObject?.search}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="title" label={t('title_field')} initialValue={queryObject?.title}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="content" label={t('content_field')} initialValue={queryObject?.content}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="right">{t('sources')}</Divider>
              <Row gutter={[16, 8]} className="w-full">
                <Col span={24}>
                  <Form.Item label={t('source')} name="sources" initialValue={queryObject?.sources}>
                    <MultiSelectPaginate
                      mode="multiple"
                      url="sources/paginate"
                      keyValue="id"
                      keyLabel="title"
                      placeholder={t('all')}
                      urlName="sources"
                      isGeneral
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label={t('evidence')} name="evidence" initialValue={queryObject?.evidence}>
                    <SimpleSelect keys="name" label="name" data={evidences} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label={t('reference')} name="references" initialValue={queryObject?.references}>
                    <MultiSelectPaginate
                      mode="multiple"
                      url="references/paginate"
                      keyValue="id"
                      keyLabel="name"
                      placeholder={t('all')}
                      urlName="references"
                      isGeneral
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="source_link" label={t('link')} initialValue={queryObject?.source_link}>
                    <Input dir="ltr" />
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="right">{t('general')}</Divider>
              <Row gutter={[16, 8]} className="w-full">
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={t('and_another_disease')}
                    name="and_diseases"
                    initialValue={queryObject?.and_diseases}>
                    <DrillDownSelectPaginate
                      title={t('and_another_disease')}
                      placeholder={t('all')}
                      mode="multiple"
                      notSelectParent
                      notSelectChild={false}
                      url="diseases/children"
                      urlName="diseases"
                      isGeneral
                      keyLabel="name"
                      keyValue="id"
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={t('except_disease')}
                    name="exclude_diseases"
                    initialValue={queryObject?.exclude_diseases}>
                    <DrillDownSelectPaginate
                      title={t('except_disease')}
                      placeholder={t('all')}
                      mode="multiple"
                      notSelectParent
                      notSelectChild={false}
                      url="diseases/children"
                      urlName="diseases"
                      isGeneral
                      keyLabel="name"
                      keyValue="id"
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label={t('related_disease')} name="diseases" initialValue={queryObject?.diseases}>
                    <DrillDownSelectPaginate
                      title={t('related_disease')}
                      placeholder={t('all')}
                      mode="multiple"
                      notSelectParent
                      notSelectChild={false}
                      url="diseases/children"
                      urlName="diseases"
                      isGeneral
                      keyLabel="name"
                      keyValue="id"
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label={t('subjects')} name="subjects" initialValue={queryObject?.subjects}>
                    <MultiSelectPaginate
                      url="subjects/paginate"
                      mode="multiple"
                      keyValue="id"
                      keyLabel="title"
                      placeholder={t('all')}
                      urlName="subjects"
                      isGeneral
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label={t('tag')} name="tags" initialValue={queryObject?.tags}>
                    <MultiSelectPaginate
                      mode="tags"
                      url="tags/paginate"
                      keyValue="id"
                      keyLabel="name"
                      placeholder={t('all')}
                      urlName="tags"
                      isGeneral
                      showSearch
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 8]} className="w-full">
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label={t('writer')} name="creator" initialValue={queryObject?.creator}>
                    <MultiSelectPaginate
                      url="users/doctors"
                      keyImage="avatar"
                      hasImage
                      defaultImage={defaultUser}
                      keyValue="id"
                      keyLabel="full_name"
                      urlName="doctors"
                      placeholder={t('all')}
                      isGeneral
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label={t('researcher')} name="researcher" initialValue={queryObject?.researcher}>
                    <MultiSelectPaginate
                      url="users/researchers"
                      keyValue="id"
                      placeholder={t('all')}
                      keyLabel="full_name"
                      urlName="researchers"
                      isGeneral
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label={t('status')} name="status" initialValue={queryObject?.status}>
                    <SimpleSelect
                      placeholder={t('all')}
                      keys="name"
                      label="name_fa"
                      data={map(recommendationStatus, (value) => ({...value, name_fa: t(value?.name)}))}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 8]} className="w-full">
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label={t('type_medicine')} name="categories" initialValue={queryObject?.categories}>
                    <MultiSelect
                      url="categories"
                      keyValue="id"
                      keyLabel="name"
                      mode="multiple"
                      placeholder={t('all')}
                      urlName="categories"
                      isGeneral
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label={t('level_surface')} name="harm_level" initialValue={queryObject?.harm_level}>
                    <SimpleSelect key="id" label="name" data={levelSurface} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label={t('send_priority')} name="priority_send" initialValue={queryObject?.priority_send}>
                    <Input min={1} max={10} className="w-full" />
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="right">{t('confirms')}</Divider>
              <Row gutter={[16, 8]} className="w-full">
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={t('confirmed_doctors')}
                    name="doctorsConfirmed"
                    initialValue={queryObject?.doctorsConfirmed}>
                    <MultiSelectPaginate
                      url="users/doctors"
                      keyValue="id"
                      keyLabel="full_name"
                      keyImage="avatar"
                      hasImage
                      defaultImage={defaultUser}
                      urlName="doctors"
                      placeholder={t('all')}
                      isGeneral
                      showSearch
                      dropDownWith
                      treeSelect
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={t('not_confirmed_doctors')}
                    name="doctorsNotConfirmed"
                    initialValue={queryObject?.doctorsNotConfirmed}>
                    <MultiSelectPaginate
                      url="users/doctors"
                      keyValue="id"
                      keyImage="avatar"
                      hasImage
                      defaultImage={defaultUser}
                      keyLabel="full_name"
                      urlName="doctors"
                      placeholder={t('all')}
                      isGeneral
                      showSearch
                      dropDownWith
                      treeSelect
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={t('recommendationStatusByDoctor')}
                    name="status_confirmed_doctors"
                    initialValue={queryObject?.status_confirmed_doctors}>
                    <SimpleSelect placeholder={t('all')} key="id" label="name" data={doctorConfirmStatus} />
                  </Form.Item>
                </Col>
              </Row>
              <Divider orientation="right">{t('filter')}</Divider>
              <Row gutter={[16, 8]} className="w-full">
                <Col xs={24} sm={12} md={8} className="flex justify-center">
                  <Form.Item
                    label={t('gender')}
                    name={['filters', 'gender']}
                    initialValue={queryObject?.filters?.gender}>
                    <Radio.Group className="flex">
                      <Radio value="male">{t('male')}</Radio>
                      <Radio value="female">{t('female')}</Radio>
                      <Radio value="all">{t('all')}</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={t('season')}
                    name={['filters', 'season']}
                    initialValue={queryObject?.filters?.season}>
                    <SimpleSelect
                      keys="name"
                      mode="tags"
                      hasAllOption
                      label="name_fa"
                      placeholder={t('all')}
                      data={seasonType?.map((value) => ({...value, name_fa: t(value?.name)}))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} className="flex justify-center">
                  <Form.Item
                    label={t('marital_status')}
                    name={['filters', 'marital_status']}
                    initialValue={queryObject?.filters?.marital_status}>
                    <Radio.Group className="flex">
                      <Radio value="single">{t('single')}</Radio>
                      <Radio value="married">{t('married')}</Radio>
                      <Radio value="all">{t('all')}</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 8]} className="w-full">
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    label={t('profession_info.weight_range')}
                    initialValue={queryObject?.filters?.weight_range?.min}>
                    <Input.Group className="w-full" compact>
                      <Form.Item name={['filters', 'weight_range', 'min']} noStyle>
                        <InputNumber
                          className="w-half"
                          placeholder={t('profession_info.from')}
                          minLength={1}
                          min={0}
                          max={200}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item
                        name={['filters', 'weight_range', 'max']}
                        noStyle
                        initialValue={queryObject?.filters?.weight_range?.max}>
                        <InputNumber
                          className="w-half"
                          placeholder={t('profession_info.to')}
                          minLength={1}
                          min={0}
                          max={200}
                          maxLength={3}
                        />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item label={t('profession_info.age_range')}>
                    <Input.Group className="w-full" compact>
                      <Form.Item
                        name={['filters', 'age_range', 'min']}
                        noStyle
                        initialValue={queryObject?.filters?.age_range?.min}>
                        <InputNumber
                          className="w-half"
                          placeholder={t('profession_info.from')}
                          minLength={1}
                          min={0}
                          max={1200}
                          maxLength={3}
                        />
                      </Form.Item>
                      <Form.Item
                        name={['filters', 'age_range', 'max']}
                        noStyle
                        initialValue={queryObject?.filters?.age_range?.max}>
                        <InputNumber
                          className="w-half"
                          placeholder={t('profession_info.to')}
                          minLength={1}
                          min={0}
                          max={1200}
                          maxLength={4}
                        />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name="has_image"
                    label={t('pictureStatus.title')}
                    className="w-full mb-1/2 label-p-0"
                    initialValue={queryObject?.has_image}>
                    <SimpleSelect keys="id" label="name" placeholder={t('all')} data={pictureStatus} allowClear />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 8]} className="w-full flex justify-end align-center">
                <Space size="small">
                  <Button
                    className="my-16 self-end"
                    type="primary"
                    onClick={(event) => {
                      event.stopPropagation();
                      history.replace({search: ''});
                    }}
                    icon={<ReloadOutlined />}
                    danger>
                    {t('report_section.delete')}
                  </Button>
                  <Button
                    className="my-16 self-end ant-btn-success"
                    type="primary"
                    htmlType="submit"
                    loading={getReportExcel?.isLoading}
                    onClick={() => {
                      isReportExcel.current = true;
                    }}
                    icon={<FileExcelOutlined />}>
                    {t('report_section.get_Excel')}
                  </Button>
                  <Button
                    className="my-16 self-end"
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      isReportExcel.current = false;
                    }}
                    icon={<FileSearchOutlined />}>
                    {t('report_section.show')}
                  </Button>
                </Space>
              </Row>
            </Form>
          </Collapse.Panel>
        </Collapse>
      </Col>
      <Col span={24}>
        <Card className="my-6" title={t('report_section.title')}>
          <RecommendationTable url="recommendations/report" urlName="recommendationsReport" />
        </Card>
      </Col>
    </Row>
  );
};

export default ReportRecommendation;
