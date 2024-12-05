export interface PostGroupProps {
  groupFile?: string | null;
  groupFileFileName?: string | null;
  id: number;
  color?: string;
  ordering: number;
  organizationGroupId?: null;
  postGroupDescription: string;
}

export enum PostStatusEnum {
  Pending = 0,
  Revised = 1,
  Published = 2,
  Rejected = 3
}
