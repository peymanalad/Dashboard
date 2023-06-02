import React, {useRef, ElementRef, FC, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {CustomTable} from 'components';
import {TaxPrint, SearchTax} from 'containers';
import {usePost} from 'hooks';
import {Card, Space, Button, Popover, Typography, Form, Row} from 'antd';
import {PrinterOutlined, FilterOutlined} from '@ant-design/icons';
import {useReactToPrint} from 'react-to-print';
import {userProps} from 'types/user';
import toString from 'lodash/toString';
import map from 'lodash/map';
import {convertUtcTimeToLocal, queryStringToObject} from 'utils';

const {Text} = Typography;

const ShowList: FC = () => {
  const {t} = useTranslation('factor');
  const searchRef = useRef<ElementRef<typeof SearchTax>>(null);
  const factorRef = useRef<HTMLDivElement>(null);
  const queryObject = queryStringToObject(useLocation().search);
  const [form] = Form.useForm();

  const cssPagedMedia = (() => {
    const style = document.createElement('style');
    document.head.appendChild(style);
    return (rule: any) => {
      style.innerHTML = rule;
    };
  })();

  const fetchTaxOrders = usePost({
    method: 'GET',
    url: 'orders/tax',
    onSuccess: () => {
      cssPagedMedia('@page { size: A4 landscape; }');
      setTimeout(handleFactorPrint, 1000);
    }
  });

  const handleFactorPrint = useReactToPrint({
    content: () => factorRef.current,
    pageStyle: '@page { size: auto;  margin: 8px; }'
  });

  useEffect(() => {
    return () => {
      cssPagedMedia('@page {size: A4;}');
    };
  }, []);

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      responsive: ['md']
    },
    {
      title: t('user'),
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (user: userProps) => (
        <Popover content={() => <div>{user?.mobile}</div>}>
          <Text>{user?.full_name || user?.username}</Text>
        </Popover>
      )
    },
    {
      title: t('doctor'),
      dataIndex: 'doctor',
      key: 'doctor',
      align: 'center',
      render: (user: userProps) => (
        <Popover content={() => <div>{user?.mobile}</div>}>
          <Text>{user?.full_name || user?.username}</Text>
        </Popover>
      )
    },
    {
      title: t('total_price'),
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      responsive: ['sm'],
      render: (price: string) => toString(price)?.toLocaleString()
    },
    {
      title: t('tax'),
      dataIndex: 'tax',
      key: 'tax',
      align: 'center',
      responsive: ['md'],
      render: (price: string) => toString(price)?.toLocaleString()
    },
    {
      title: t('final_price'),
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      render: (price: string) => toString(price)?.toLocaleString()
    },
    {
      title: t('created_at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      responsive: ['md'],
      render: (dateTime: string) => convertUtcTimeToLocal(dateTime)
    }
  ];

  const showSearch = () => {
    if (searchRef.current) searchRef.current.open();
  };

  const onFinish = (values: any) => {
    if (values?.orders?.length) {
      cssPagedMedia('@page { size: A4 landscape; }');
      handleFactorPrint();
    } else fetchTaxOrders.post({}, {...queryObject, per_page: undefined});
  };

  return (
    <Form form={form} layout="vertical" requiredMark={false} className="w-full" name="ParcelList" onFinish={onFinish}>
      <Card
        title={t('tax')}
        extra={
          <Space size="small">
            <Button
              className="bg-orange d-none md:d-block"
              type="default"
              htmlType="submit"
              loading={fetchTaxOrders?.isLoading}
              icon={<PrinterOutlined />}>
              {t('print')}
            </Button>
            <Button
              type="primary"
              className="d-text-none md:d-text-unset"
              icon={<FilterOutlined />}
              onClick={showSearch}>
              {t('filter')}
            </Button>
          </Space>
        }>
        <SearchTax ref={searchRef} />
        <Form.Item name="orders" noStyle>
          <CustomTable fetch="orders/tax" dataName="tax" columns={columns} isRowSelection />
        </Form.Item>
      </Card>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, nextValues) => prevValues?.orders?.length !== nextValues?.orders?.length}>
        {(fields) => (
          <Row className="d-none w-full factor_print_area">
            <Row className="w-full print-break" ref={factorRef}>
              {map(fields?.getFieldValue('orders') || fetchTaxOrders.data?.data, (order: any, index: number) => (
                <TaxPrint financeInfo={order} key={index} />
              ))}
            </Row>
          </Row>
        )}
      </Form.Item>
    </Form>
  );
};

export default ShowList;
