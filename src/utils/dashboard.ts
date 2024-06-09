import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import flatMap from 'lodash/flatMap';
import sumBy from 'lodash/sumBy';
import type {
  DashboardOrganizationData,
  DashboardTransformedValues,
  DashboardTransformedData,
  DashboardPercentData
} from 'types/dashboard';

export function transformOrganizationData(data: DashboardOrganizationData[]): DashboardTransformedData | null {
  if (!data?.length) return null;
  // Flatten the countInfo to get a list of all counts with their respective dates and organizationIds
  const flattenedData = flatMap(data, (org) =>
    org.countInfo.map((info) => ({
      organizationId: org.organizationId,
      organizationName: org.organizationName,
      dateOfCount: info.dateOfCount,
      count: info.count
    }))
  );

  // Group by dateOfCount
  const groupedByDate = groupBy(flattenedData, 'dateOfCount');

  // Transform the grouped data into the desired format
  const transformedData = map(groupedByDate, (values, date) => {
    const record: DashboardTransformedValues = {dateOfCount: date};
    values.forEach((item) => {
      record[item.organizationName] = item.count;
    });
    return record;
  });

  return {labels: map(data, 'organizationName'), values: transformedData};
}

export function calculatePercentages(data: DashboardOrganizationData[]): DashboardPercentData[] | null {
  if (!data?.length) return null;
  // Calculate total count for each organization
  const totalCounts = data.map((org) => {
    const totalCount = sumBy(org.countInfo, 'count');
    return {
      organizationId: org.organizationId,
      organizationName: org.organizationName,
      totalCount
    };
  });

  // Calculate the grand total count
  const grandTotal = sumBy(totalCounts, 'totalCount');

  // Calculate percentages
  const percentages = totalCounts.map((org) => {
    const percent = ((org.totalCount / grandTotal) * 100).toFixed(2); // Rounded to 2 decimal places
    return {
      name: org.organizationName,
      percent
    };
  });

  return percentages;
}
