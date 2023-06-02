import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {Maintenance, MaintenanceSpinner} from 'components';
import packageJson from '../package.json';

const buildDateGreaterThan = (latestDate: any, currentDate: any) => {
  const momLatestDateTime = moment(latestDate);
  const momCurrentDateTime = moment(currentDate);

  if (momLatestDateTime.isAfter(momCurrentDateTime)) {
    return true;
  }
  return false;
};

function withClearCache(Component: any) {
  function ClearCacheComponent(props: any) {
    const [isLatestBuildDate, setIsLatestBuildDate] = useState<boolean | undefined>(undefined);

    useEffect(() => {
      if (process.env.NODE_ENV === 'production') {
        fetch('/meta.json')
          .then((response) => response.json())
          .then((meta) => {
            const latestVersionDate = meta.buildDate;
            const currentVersionDate = packageJson.buildDate;

            const shouldForceRefresh = buildDateGreaterThan(latestVersionDate, currentVersionDate);
            if (shouldForceRefresh) {
              setIsLatestBuildDate(false);
              setTimeout(refreshCacheAndReload, 10000);
            } else {
              setIsLatestBuildDate(true);
            }
          });
      }
    }, []);

    const refreshCacheAndReload = () => {
      if (caches) {
        // Service worker cache should be cleared with caches.delete()
        caches.keys().then((names) => {
          names.forEach((name: string) => {
            caches.delete(name);
          });
        });
      }
      // delete browser cache and hard reload
      window.location.reload();
    };

    return (
      <React.Fragment>
        {isLatestBuildDate || process.env.NODE_ENV === 'development' ? (
          <Component {...props} />
        ) : isLatestBuildDate === undefined ? (
          <MaintenanceSpinner />
        ) : (
          <Maintenance />
        )}
      </React.Fragment>
    );
  }

  return ClearCacheComponent;
}

export default withClearCache;
