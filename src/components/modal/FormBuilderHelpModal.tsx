import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefRenderFunction,
  RefObject,
  useImperativeHandle,
  useState
} from 'react';
import {Collapse, Modal} from 'antd';
import {SelectOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';
import map from 'lodash/map';
import {configHelp} from 'assets';
import {JsonEditor} from 'components';

interface refProps {
  open: () => void;
  close: () => void;
}

export interface props {
  ref?: RefObject<refProps>;
  onSelectHelp: (schema: object) => void;
}

const {Panel} = Collapse;

const FormBuilderHelpModal: ForwardRefRenderFunction<refProps, props> = (
  {onSelectHelp}: props,
  forwardedRef: ForwardedRef<refProps>
) => {
  const {t} = useTranslation('general');

  const [openHelp, setOpenHelp] = useState<boolean>(false);

  useImperativeHandle(forwardedRef, () => ({
    open() {
      setOpenHelp(true);
    },
    close() {
      setOpenHelp(false);
    }
  }));

  return (
    <Modal title={t('schema_help')} visible={openHelp} width={700} footer={null} onCancel={() => setOpenHelp(false)}>
      <Collapse accordion>
        {map(configHelp, (help: any, index: number) => (
          <Panel
            header={help?.title}
            key={index}
            className={index === 0 ? 'rtl' : ''}
            extra={
              index !== 0 && (
                <SelectOutlined
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectHelp(help?.content);
                    setOpenHelp(false);
                  }}
                />
              )
            }>
            <JsonEditor
              style={{padding: 0, border: 'none'}}
              displayDataTypes={index !== 0}
              disableClipboard
              disable
              value={help?.content}
            />
          </Panel>
        ))}
      </Collapse>
    </Modal>
  );
};

export default forwardRef(FormBuilderHelpModal);
