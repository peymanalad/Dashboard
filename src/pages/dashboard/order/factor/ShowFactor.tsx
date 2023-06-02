import React, {FC, useCallback, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {useFetch} from 'hooks';
import {Row, Col, Card, Typography, Table, Button, Divider, Space} from 'antd';
import {convertUtcTimeToLocal, getLangSearchParam} from 'utils';
import {useParams, useHistory, Link} from 'react-router-dom';
import {FileSearchOutlined, MessageOutlined, PrinterOutlined, EyeOutlined} from '@ant-design/icons';
import {useReactToPrint} from 'react-to-print';
import Hotkeys from 'react-hot-keys';
import {DropDownMenu} from 'components';
import toString from 'lodash/toString';
import toNumber from 'lodash/toNumber';
import map from 'lodash/map';
import type {ColumnsType} from 'antd/lib/table';
import type {userProps} from 'types/user';

const ShowFactor: FC = () => {
  const {t} = useTranslation('factor');
  const {Text} = Typography;
  const {id} = useParams<{id?: string}>();
  const history = useHistory();

  const factorRef = useRef<any | null>(null);
  const buttonRef = useRef<any | null>(null);

  const fetchFactor = useFetch({
    name: ['order', id],
    url: 'orders/{id}',
    params: {id},
    enabled: true
  });

  const handlePrint = useReactToPrint({
    content: () => factorRef.current,
    documentTitle: 'Factor',
    pageStyle: 'mt-5'
  });

  const orderColumns: ColumnsType<any[]> = [
    {
      title: '#',
      dataIndex: 'number',
      key: 'number',
      align: 'center'
    },
    {
      title: t('name'),
      dataIndex: ['service', 'name'],
      key: 'service'
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center'
    },
    {
      title: t('fee'),
      dataIndex: 'fee',
      key: 'fee',
      align: 'center',
      render: (price: string) => toString(price)?.toLocaleString()
    },
    {
      title: t('discount'),
      dataIndex: 'discount',
      key: 'discount',
      align: 'center',
      render: (price: string) => toString(price)?.toLocaleString()
    },
    {
      title: t('total_price'),
      dataIndex: 'total_price',
      key: 'total_price',
      align: 'center',
      render: (price: string) => toString(price)?.toLocaleString()
    }
  ];

  const creditsColumns: ColumnsType<any[]> = [
    {
      title: '#',
      dataIndex: 'number',
      key: 'number',
      align: 'center'
    },
    {
      title: t('name'),
      dataIndex: 'user',
      key: 'user',
      render: (user: userProps) => user?.full_name || user?.username || '-'
    },
    {
      title: t('status_cumulative.title'),
      dataIndex: 'is_confirm',
      key: 'is_confirm',
      align: 'center',
      render: (value: boolean) => t(`status_cumulative.${value}`)
    },
    {
      title: t('cumulative_status.title'),
      dataIndex: 'is_cumulative',
      key: 'is_cumulative',
      align: 'center',
      render: (value: any) => t(`cumulative_status.${value === 1}`)
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      align: 'center',
      render: (price: string) => toString(price)?.toLocaleString()
    }
  ];

  const creditsDiscountColumns: ColumnsType<any[]> = [
    {
      title: '#',
      dataIndex: 'number',
      key: 'number',
      align: 'center'
    },
    {
      title: t('name'),
      dataIndex: 'user',
      key: 'user',
      render: (value: any) => value?.full_name
    },
    {
      title: t('status_cumulative.title'),
      dataIndex: 'is_confirm',
      key: 'is_confirm',
      align: 'center',
      render: (value: boolean) => t(`status_cumulative.${value}`)
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      align: 'center',
      render: (price: string) => toString(price)?.toLocaleString()
    }
  ];

  const cumulativeColumns: ColumnsType<any[]> = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: t('info'),
      dataIndex: 'data',
      key: 'data',
      align: 'center',
      render: (value: object) => {
        try {
          return JSON.stringify(value);
        } catch (e) {
          return '-';
        }
      }
    }
  ];

  const newTableData = useCallback((orderItems: any[]) => {
    if (orderItems) {
      let newOrderItem: any[] = [...orderItems];
      newOrderItem = map(newOrderItem, (order: any, index: number) => ({...order, number: index + 1}));
      return newOrderItem;
    }
  }, []);
  return (
    // @ts-ignore
    <Hotkeys
      keyName="ctrl+p"
      onKeyDown={(keyName, e) => {
        e.preventDefault();
        if (buttonRef.current) buttonRef.current.click();
      }}>
      <Row ref={factorRef}>
        <Card
          title={t('factor')}
          bordered={false}
          className="w-full print:header-d-none"
          loading={fetchFactor.isFetching && !fetchFactor.data}
          extra={
            <Space size="small">
              <Link to={`/user/show/${fetchFactor?.data?.user?.id}`}>
                <Button
                  type="primary"
                  className="d-none sm:d-block ant-btn-warning d-text-none md:d-text-unset not-show-factor"
                  icon={<EyeOutlined />}>
                  {t('show_user')}
                </Button>
              </Link>
              <Button
                className="not-show-factor d-none lg:d-block"
                type="primary"
                icon={<PrinterOutlined />}
                ref={buttonRef}
                onClick={handlePrint}>
                {t('print')}
              </Button>
              <DropDownMenu
                items={[
                  fetchFactor?.data?.visit_id && {
                    name: t('visit_show'),
                    onClick: () => {
                      history.push(getLangSearchParam(`/visit/show/${fetchFactor?.data?.user?.id}`));
                    },
                    icon: <FileSearchOutlined />
                  },
                  {
                    name: t('visit_list_show'),
                    onClick: () => {
                      history.push(getLangSearchParam(`/visits/list/?id=&user_id=${fetchFactor?.data?.user?.id}`));
                    },
                    icon: <FileSearchOutlined />
                  },
                  {
                    name: t('support_message'),
                    onClick: () => {
                      history.push(getLangSearchParam(`/message/support/chat/${fetchFactor?.data?.user?.id}`));
                    },
                    icon: <MessageOutlined />
                  }
                ]}
              />
            </Space>
          }>
          <Row gutter={[16, 8]} className="w-full">
            <Col md={11} xs={23} className="print:col-11">
              <div className="flex justify-between">
                <h4>{t('full_name')}</h4>
                <Text type="secondary">
                  {fetchFactor?.data?.user?.full_name || fetchFactor?.data?.user?.name || '-'}
                </Text>
              </div>
            </Col>
            <Col xs={0} md={1}>
              <Divider type="vertical" orientation="center" className="h-30-px" />
            </Col>
            <Col md={11} xs={23} className="print:col-11">
              <div className="flex justify-between">
                <h4>{t('factor_number')}</h4>
                <Text type="secondary">{fetchFactor?.data?.id}</Text>
              </div>
            </Col>
            <Col md={11} xs={23} className="print:col-11">
              <div className="flex justify-between ">
                <h4>{t('user_id')}</h4>
                <Text type="secondary">{fetchFactor?.data?.user?.id || '-'}</Text>
              </div>
            </Col>
            <Col xs={0} md={1}>
              <Divider type="vertical" orientation="center" className="h-30-px" />
            </Col>
            <Col md={11} xs={23} className="print:col-11">
              <div className="flex justify-between ">
                <h4>{t('user_name')}</h4>
                <Text type="secondary">{fetchFactor?.data?.user?.username || '-'}</Text>
              </div>
            </Col>
            <Col md={11} xs={23} className="print:col-11">
              <div className="flex justify-between">
                <h4>{t('status.title')}</h4>
                <Text type="secondary">{t(`status.${fetchFactor?.data?.status || 'cardToCard'}`)}</Text>
              </div>
            </Col>
            <Col xs={0} md={1}>
              <Divider type="vertical" orientation="center" className="h-30-px" />
            </Col>
            <Col md={11} xs={23} className="print:col-11">
              <div className="flex justify-between">
                <h4>{t('history')}</h4>
                <Text type="secondary">{convertUtcTimeToLocal(fetchFactor?.data?.created_at)}</Text>
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 8]} className="w-full pt-8">
            <Col span={24}>
              <Table
                title={() => t('order_items_table')}
                columns={orderColumns}
                pagination={false}
                dataSource={newTableData(fetchFactor?.data?.order_items)}
                bordered
                summary={() => (
                  <>
                    <Table.Summary.Row style={{background: '#FAFAFA'}}>
                      <Table.Summary.Cell align="center" index={0}>
                        {(fetchFactor?.data?.order_items.length || 0) + 1}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={4}>
                        {t('total_price')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell align="center" index={2}>
                        <Text>{toNumber(fetchFactor?.data?.total_price)?.toLocaleString()}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row style={{background: '#FAFAFA'}}>
                      <Table.Summary.Cell align="center" index={0}>
                        {(fetchFactor?.data?.order_items?.length || 0) + 2}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={4}>
                        {t('tax_deed')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell align="center" index={2}>
                        <Text>{toNumber(fetchFactor?.data?.tax)?.toLocaleString()}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row style={{background: '#FAFAFA'}}>
                      <Table.Summary.Cell align="center" index={0}>
                        {(fetchFactor?.data?.order_items.length || 0) + 3}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={4}>
                        {t('discount')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell align="center" index={2}>
                        <Text>{toNumber(fetchFactor?.data?.discount)?.toLocaleString()}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row style={{background: '#FAFAFA'}}>
                      <Table.Summary.Cell align="center" index={0}>
                        {(fetchFactor?.data?.order_items.length || 0) + 4}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={4}>
                        {t('final_price')}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell align="center" index={2}>
                        <Text>{toNumber(fetchFactor?.data?.final_price)?.toLocaleString()}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )}
              />
            </Col>
          </Row>
          <Row gutter={[16, 8]} className="w-full pt-8">
            <Col span={24}>
              <Table
                title={() => t('credits_table')}
                columns={creditsColumns}
                pagination={false}
                dataSource={newTableData(fetchFactor?.data?.credits)}
                bordered
              />
            </Col>
          </Row>
          {fetchFactor?.data?.discounts?.lenght && (
            <Row gutter={[16, 8]} className="w-full pt-8">
              <Col span={24}>
                <Table
                  title={() => t('credits_discount_table')}
                  columns={creditsDiscountColumns}
                  pagination={false}
                  dataSource={newTableData(fetchFactor?.data?.discounts)}
                  bordered
                />
              </Col>
            </Row>
          )}
          <Row gutter={[16, 8]} className="w-full pt-8 not-show-factor">
            <Col span={24}>
              <Table
                title={() => t('cumulative_logs')}
                columns={cumulativeColumns}
                pagination={false}
                dataSource={newTableData(fetchFactor?.data?.cumulative_logs)}
                bordered
              />
            </Col>
          </Row>
        </Card>
      </Row>
    </Hotkeys>
  );
};

export default ShowFactor;
