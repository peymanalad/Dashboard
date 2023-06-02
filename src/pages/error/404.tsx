import React, {FC, useEffect, useRef} from 'react';
import {Row, Typography} from 'antd';
import {useTranslation} from 'react-i18next';

const NotFoundError: FC = () => {
  const {t} = useTranslation('error');

  const visor = useRef<any | null>(null);
  const cord = useRef<any | null>(null);

  const {Title, Link} = Typography;

  useEffect(() => {
    const ctx = visor.current.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(5, 45);
    ctx.bezierCurveTo(15, 64, 45, 64, 55, 45);

    ctx.lineTo(55, 20);
    ctx.bezierCurveTo(55, 15, 50, 10, 45, 10);

    ctx.lineTo(15, 10);

    ctx.bezierCurveTo(15, 10, 5, 10, 5, 20);
    ctx.lineTo(5, 45);

    ctx.fillStyle = '#2f3640';
    ctx.strokeStyle = '#f5f6fa';
    ctx.fill();
    ctx.stroke();
  }, []);

  return (
    <Row className="errorContainer">
      <div className="moon" />
      <div className="moon__crater moon__crater1" />
      <div className="moon__crater moon__crater2" />
      <div className="moon__crater moon__crater3" />

      <div className="star star1" />
      <div className="star star2" />
      <div className="star star3" />
      <div className="star star4" />
      <div className="star star5" />
      <div className="star star6" />
      <div className="star star7" />
      <div className="star star8" />
      <div className="star star9" />
      <div className="star star10" />

      <div className="errorContent">
        <Title level={1} className="error__title">
          {t('404')}
        </Title>
        <Link href="/">{t('backToLoginPage')}</Link>
        <div className="error__description">{t('subTitle404')}</div>
      </div>

      <div className="astronaut">
        <div className="astronaut__backpack" />
        <div className="astronaut__body" />
        <div className="astronaut__body__chest" />
        <div className="astronaut__arm-left1" />
        <div className="astronaut__arm-left2" />
        <div className="astronaut__arm-right1" />
        <div className="astronaut__arm-right2" />
        <div className="astronaut__arm-thumb-left" />
        <div className="astronaut__arm-thumb-right" />
        <div className="astronaut__leg-left" />
        <div className="astronaut__leg-right" />
        <div className="astronaut__foot-left" />
        <div className="astronaut__foot-right" />
        <div className="astronaut__wrist-left" />
        <div className="astronaut__wrist-right" />

        <div className="astronaut__cord">
          <canvas ref={cord} id="cord" height="500px" width="500px" />
        </div>

        <div className="astronaut__head">
          <canvas ref={visor} id="visor" width="60px" height="60px" />
          <div className="astronaut__head-visor-flare1" />
          <div className="astronaut__head-visor-flare2" />
        </div>
      </div>
    </Row>
  );
};

export default NotFoundError;
