import React, {FC, Fragment, ReactNode} from 'react';
import {Col, Space, Typography} from 'antd';
import {Link} from 'react-router-dom';

interface props {
  title: string;
  count: string | number;
  color: string;
  unit?: string;
  link?: string;
  onClick?: () => void;
  outline?: boolean;
  wrapper?: boolean;
  wrapperContent?: ReactNode;
  icon?: ReactNode;
}

const {Text} = Typography;

const CountCard: FC<props> = ({
  color,
  title,
  count = 0,
  wrapper,
  wrapperContent,
  icon,
  outline,
  unit,
  onClick,
  link = ''
}) => {
  return (
    <Fragment>
      <Link
        to={link}
        style={{backgroundColor: outline ? color : undefined}}
        type="button"
        className={`relative d-block h-20 bg-white rounded-lg cursor-pointer w-full overflow-hidden border-0 ${
          outline && 'mt-2'
        }`}
        onClick={onClick}>
        <Space
          direction="vertical"
          align="center"
          className="flex-center h-full w-full md:w-8/10 p-1 z-60 relative text-center">
          <Text className={`text-md ${outline ? 'text-white' : 'text-black'}`} strong>
            {title}
          </Text>
          <Text className={`text-md ${outline ? 'text-white' : 'text-black'}`} strong>
            {count}
          </Text>
          {unit && <Text className={`text-md ${outline ? 'text-white' : 'text-black'}`}>{unit}</Text>}
        </Space>
        <span
          style={{left: -20, bottom: -50, backgroundColor: !outline ? color : 'white'}}
          className="opacity-50 rounded-full absolute h-24 w-20"
        />
        <span
          style={{left: -45, top: -50, backgroundColor: !outline ? color : 'white'}}
          className="opacity-25 absolute rounded-full h-32 w-24"
        />
        <span
          style={{right: 10, bottom: 10, backgroundColor: !outline ? color : 'white'}}
          className="opacity-10 absolute rounded-full h-5 w-5"
        />
        <span
          style={{right: 38, bottom: 25, backgroundColor: !outline ? color : 'white'}}
          className="opacity-10 absolute rounded-full h-2 w-2"
        />
        <span
          style={{right: 45, bottom: 15, backgroundColor: !outline ? color : 'white'}}
          className="opacity-10 absolute rounded-full h-1 w-1"
        />
        {!outline && (
          <Col style={{left: 25, bottom: 15}} className="absolute text-white">
            {icon}
          </Col>
        )}
        {wrapper && (
          <Col className="absolute h-8 rounded flex-center text-white w-full h-full l-0 bottom-0 glass-morphism">
            {wrapperContent}
          </Col>
        )}
      </Link>
      {outline && (
        <Col
          style={{top: '1rem', left: 35, backgroundColor: outline ? color : 'white'}}
          className="absolute h-8 rounded flex-center text-white">
          {icon}
        </Col>
      )}
    </Fragment>
  );
};

export default CountCard;
