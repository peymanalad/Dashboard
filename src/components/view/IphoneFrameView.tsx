import React, {type FC} from 'react';

const IPhoneFrameView: FC = ({children}) => {
  return (
    <div
      style={{
        width: '375px',
        height: '700px',
        border: '1px solid #000',
        borderRadius: '40px',
        overflow: 'hidden',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
      }}>
      {/* Top notch */}
      <div
        style={{
          width: '100%',
          height: '44px',
          backgroundColor: '#000'
        }}
      />

      {/* Screen */}
      <div
        style={{
          width: '100%',
          height: '724px',
          backgroundColor: '#fff',
          padding: '16px',
          boxSizing: 'border-box',
          overflow: 'auto'
        }}>
        {children}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          width: '100%',
          height: '44px',
          backgroundColor: '#000'
        }}
      />
    </div>
  );
};

export default IPhoneFrameView;
