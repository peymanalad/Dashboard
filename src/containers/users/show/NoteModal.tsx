import {Button, Form, Modal, Row} from 'antd';
import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import {useTranslation} from 'react-i18next';
import DatePicker from 'react-datepicker2';
import TextArea from 'antd/lib/input/TextArea';
import {convertTimeToUTC} from 'utils';
import {usePost} from 'hooks';
import {DateTimePicker} from 'components';

interface refProps {
  open: (id: any, calls: any) => void;
  close: () => void;
}

interface Props {
  ref: RefObject<refProps>;
  tableRef: RefObject<any>;
}

const NoteModal: ForwardRefRenderFunction<refProps, Props> = (props: Props, forwardedRef: ForwardedRef<refProps>) => {
  const {t}: {t: any} = useTranslation('user-show');
  const [form] = Form.useForm();
  const [userId, setUserId] = useState<any>(undefined);

  const sendCallData = usePost({
    url: 'users/{userId}/calls',
    onSuccess: () => {
      form.resetFields();
      setUserId(undefined);
      props.tableRef.current.refresh();
    }
  });

  useImperativeHandle(forwardedRef, () => ({
    open(id: any) {
      setUserId(id);
    },
    close() {
      setUserId(undefined);
    }
  }));

  const onFinish = (data: any) => {
    data.date = convertTimeToUTC(data.date, 'YYYY-MM-DD');
    sendCallData.post(data, {}, {userId});
  };

  return (
    <Modal title={t('call')} visible={!!userId} width={700} footer={null} onCancel={() => setUserId(undefined)}>
      <Form form={form} requiredMark={false} layout="vertical" className="w-full" onFinish={onFinish}>
        <Form.Item name="date" label={t('date')} rules={[{required: true, message: t('validation.required_date')}]}>
          <DateTimePicker />
        </Form.Item>
        <Form.Item name="note" label={t('note')} rules={[{required: true, message: t('validation.required_note')}]}>
          <TextArea />
        </Form.Item>
        <Row className="justify-end">
          <Button type="primary" htmlType="submit" loading={sendCallData.isLoading}>
            {t('save')}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

export default forwardRef(NoteModal);
