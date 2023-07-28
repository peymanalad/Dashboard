import React, {type FC} from 'react';

const IPhone8FrameView: FC = ({children}) => {
  return (
    <div className="smartphone">
      <div className="smartphone-content">
        <div>{children}</div>
      </div>
    </div>
  );
};

export default IPhone8FrameView;
