import React, {FC} from 'react';
import {Col, Row, Table} from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import {numberToWords} from '@persian-tools/persian-tools';
import {ColumnsType} from 'antd/lib/table';
import toNumber from 'lodash/toNumber';
import replace from 'lodash/replace';
import random from 'lodash/random';
import {useTranslation} from 'react-i18next';
import {convertUtcTimeToLocal} from 'utils';

type Props = {
  financeInfo: any;
};

const TaxPrint: FC<Props> = ({financeInfo}) => {
  const {t}: {t: any} = useTranslation('factor');

  const parcelColumns: ColumnsType<Array<object>> = [
    {
      title: t('row'),
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: () => 1
    },
    {
      title: t('product_code'),
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      render: () => 1
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: () => t('deedServices')
    },
    {
      title: t('numberOrAmount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      render: () => 1
    },
    {
      title: t('unit_measurement'),
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
      render: () => 'عدد'
    },
    {
      title: t('unit_price'),
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price: string) => toNumber(price)?.toLocaleString()
    },
    {
      title: t('full_price'),
      dataIndex: 'price',
      key: 'total',
      align: 'center',
      render: (price: string) => toNumber(price)?.toLocaleString()
    },
    {
      title: t('discount_amount'),
      dataIndex: 'off_price',
      key: 'off_price',
      align: 'center',
      render: () => 0
    },
    {
      title: t('price_after_discount'),
      dataIndex: 'discount',
      key: 'discount',
      align: 'center',
      render: () => 0
    },
    {
      title: t('total_fee_and_discount'),
      dataIndex: 'tax',
      key: 'tax',
      align: 'center',
      render: (price: string) => toNumber(price)?.toLocaleString()
    },
    {
      title: t('final_price_with_fee'),
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      render: (price: string) => toNumber(price)?.toLocaleString(),
      width: 150
    }
  ];

  return (
    <Row
      className="w-full print-break flex flex-col factor_print bg-white text-black"
      style={{border: '1px solid black'}}>
      <Row className="d-flex w-full items-center" style={{borderBottom: '1px solid black'}}>
        <Col span={4} className="flex flex-center">
          <span className="font-bold"> {t('finance_print.officeName')}</span>
        </Col>
        <Col span={16} style={{fontSize: 24, fontWeight: 'bold'}} className="flex justify-center">
          <span> {t('finance_print.invoice_products_sells')}</span>
        </Col>
        <Col span={4} className="flex flex-col">
          <p className="px-1 py-2">{t('finance_print.number', {number: financeInfo?.order_id || ''})}</p>
          <p className="px-1 py-2">
            {t('finance_print.date', {
              date: financeInfo?.created_at ? convertUtcTimeToLocal(financeInfo?.created_at, 'jYYYY/jMM/jDD') : ''
            })}
          </p>
        </Col>
      </Row>
      <Row className="w-full d-flex flex-col">
        <Row
          className="w-full justify-center"
          style={{fontSize: '26px', fontWeight: 'bold', borderBottom: '1px solid rgba(0,0,0,0.2)', padding: '8px'}}>
          {t('finance_print.sellers_info')}
        </Row>
        <Row className="w-full" style={{borderBottom: '1px solid rgba(0,0,0,0.2)'}}>
          <Col className="p-1 justify-center" span={12}>
            {t('finance_print.name', {name: financeInfo?.seller?.name || ''})}
            {/* نام شخص حقیقی/ حقوقی: همراه زندگی سلامت(سهامی خاص) */}
          </Col>
          <Col className="p-1" span={6}>
            {t('finance_print.national_id', {
              code: financeInfo?.seller?.national_id || ''
            })}
            {/* شناسه ملی : 14007668310 */}
          </Col>
          <Col className="p-1" span={6}>
            {t('finance_print.registration_number', {number: financeInfo?.seller?.registration_number || ''})}
            {/* شماره ثبت: 527612 */}
          </Col>
        </Row>
        <Row className="w-full" style={{borderBottom: '1px solid rgba(0,0,0,0.2)'}}>
          <Col className="p-1" span={6}>
            {t('finance_print.full_address_state', {state: financeInfo?.seller?.state || ''})}
          </Col>
          <Col className="p-1" span={6}>
            {t('finance_print.city', {city: financeInfo?.seller?.city || ''})}
          </Col>
          <Col className="p-1" span={6}>
            {t('finance_print.economical_number', {number: financeInfo?.seller?.economical_number || ''})}
          </Col>
          <Col className="p-1" span={6}>
            {t('finance_print.phone', {number: replace(financeInfo?.seller?.phone, '-', '') || ''})}
          </Col>
        </Row>
        <Row className="w-full" style={{borderBottom: '1px solid rgba(0,0,0,1)'}}>
          <Col className="p-1" span={18}>
            {t('finance_print.address', {address: financeInfo?.seller?.address || ''})}
          </Col>
          <Col className="p-1 text-right" span={6}>
            {t('finance_print.postal_code', {code: financeInfo?.seller?.postal_code || ''})}
          </Col>
        </Row>
      </Row>
      <Row className="w-full d-flex flex-col">
        <Row
          className="w-full justify-center"
          style={{
            fontSize: '26px',
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(0,0,0,0.2)',
            padding: '8px',
            textAlign: 'center'
          }}>
          {t('finance_print.costumer_info')}
        </Row>
        <Row className="w-full" style={{borderBottom: '1px solid rgba(0,0,0,0.2)'}}>
          <Col className="p-1 justify-center" span={12}>
            {t('finance_print.name', {name: financeInfo?.user?.name || ''})}
          </Col>
          <Col className="p-1" span={6}>
            {t('finance_print.national_id', {
              code: financeInfo?.user?.national_code || random(1000000000, 9999999999)
            })}
          </Col>
          <Col className="p-1" span={6}>
            {t('finance_print.registration_number', {number: financeInfo?.user?.registration_number || ''})}
          </Col>
        </Row>
        <Row className="w-full" style={{borderBottom: '1px solid rgba(0,0,0,0.2)'}}>
          <Col className="p-1" span={6}>
            {t('finance_print.full_address_state', {state: financeInfo?.user?.province || ''})}
          </Col>
          <Col className="p-1" span={6}>
            {t('finance_print.city', {city: financeInfo?.user?.city || ''})}
          </Col>
          <Col className="p-1" span={6}>
            {t('finance_print.economical_number', {number: financeInfo?.user?.economical_number || ''})}
          </Col>
          <Col className="p-1" span={6}>
            {t('finance_print.phone', {number: financeInfo?.user?.phone || ''})}
          </Col>
        </Row>
        <Row className="w-full" style={{borderBottom: '1px solid rgba(0,0,0,1)'}}>
          <Col className="p-1" span={18}>
            {t('finance_print.address', {address: financeInfo?.user?.address || ''})}
          </Col>
          <Col className="p-1 text-right" span={6}>
            {t('finance_print.postal_code', {code: financeInfo?.user?.postal_code || ''})}
          </Col>
        </Row>
      </Row>
      <Row className="w-full" style={{borderBottom: '1px solid black'}}>
        <Col span={24}>
          <Table
            className="show-parcel-table"
            title={() => (
              <Row
                className="w-full justify-center"
                style={{
                  fontSize: '26px',
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(0,0,0,0.2)',
                  padding: '8px'
                }}>
                {t('finance_print.parcel_info')}
              </Row>
            )}
            columns={parcelColumns}
            pagination={false}
            dataSource={[financeInfo]}
            bordered
            summary={() => (
              <Table.Summary.Row style={{borderTop: '1px solid black'}}>
                <Table.Summary.Cell align="center" index={0} className="d-none md:d-block">
                  #
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={10}>
                  {t('final_price')}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="center" index={11}>
                  {toNumber(financeInfo?.total).toLocaleString() || ''}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </Col>
      </Row>
      <Row
        className="w-full items-center"
        style={{borderBottom: '1px solid black', borderTop: '1px solid black', padding: '8px'}}>
        <Col span={8}>
          {t('finance_print.sell_terms')}:
          <Checkbox className="ltr text-black" checked>
            {t('finance_print.cash')}
          </Checkbox>
          <Checkbox className="ltr text-black">{t('finance_print.non_cash')}</Checkbox>
        </Col>
        <Col span={16}>{t('finance_print.total_in_char', {number: numberToWords(financeInfo?.total)})}</Col>
      </Row>
      <Row className="w-full" style={{borderBottom: '1px solid black', padding: '8px'}}>
        <Col span={24}>{t('finance_print.description')} </Col>
      </Row>
      <Row className="w-full" style={{padding: '10px 8px 200px 8px'}}>
        <Col span={12}>{t('finance_print.seller_stamp_signature')}</Col>
        <Col span={12}> {t('finance_print.costumer_stamp_signature')}</Col>
      </Row>
    </Row>
  );
};

export default TaxPrint;
