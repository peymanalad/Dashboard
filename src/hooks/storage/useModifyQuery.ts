import {useQueryClient} from 'react-query';
import findIndex from 'lodash/findIndex';
import cloneWith from 'lodash/cloneWith';
import forEach from 'lodash/forEach';
import merge from 'lodash/merge';
import update from 'lodash/update';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import concat from 'lodash/concat';
import compact from 'lodash/compact';
import without from 'lodash/without';
import get from 'lodash/get';
import toNumber from 'lodash/toNumber';
import isNumber from 'lodash/isNumber';
import remove from 'lodash/remove';
import pullAt from 'lodash/pullAt';
import isNull from 'lodash/isNull';
import {ListIterateeCustom, PropertyPath} from 'lodash';
import {updatePathList} from 'types/general';

interface Props {
  queryName: Array<string | number | undefined | null> | string;
}

const useModifyQuery = ({queryName}: Props) => {
  const query = useQueryClient();

  const updateList = (
    listData: Array<any>,
    predicate: ListIterateeCustom<object, boolean> | number,
    updateValue: any,
    path?: PropertyPath | any
  ): boolean => {
    const itemIndex: number = toNumber(!isObject(predicate) ? predicate : findIndex(listData, predicate));
    if (itemIndex > -1) {
      if (isNull(updateValue) && !path) {
        if (isObject(predicate)) remove(listData, predicate);
        else if (isNumber(predicate)) pullAt(listData, predicate);
      } else
        update(listData, without(flatten([itemIndex, path]), null, undefined), (value: any) =>
          isObject(value) ? merge(value, updateValue) : updateValue
        );
      return true;
    }
    return false;
  };

  const insertList = (
    listData: Array<any>,
    predicate: ListIterateeCustom<object, boolean>,
    path: PropertyPath,
    insertValue: any,
    isPush: boolean = true
  ): boolean => {
    const itemIndex = findIndex(listData, predicate);
    if (itemIndex > -1) {
      update(listData, flatten([itemIndex, path]), (value: any) =>
        isPush ? concat(value || [], insertValue) : concat(insertValue, value || [])
      );
      return true;
    }
    return false;
  };

  const updateQuery = (
    path: updatePathList,
    updateValue: any,
    predicate?: ListIterateeCustom<object, boolean> | number
  ) => {
    query.setQueryData(queryName, (oldData: any) =>
      cloneWith(oldData, (values: any) => {
        if (!isEmpty(values?.pages)) {
          forEach(values.pages, (page: any) => {
            if (predicate) {
              if (
                updateList(
                  path?.objectPath ? get(page?.data, path?.objectPath) : page?.data,
                  predicate,
                  updateValue,
                  path?.listPath
                )
              )
                return;
            } else {
              update(page, compact(concat(['data'], path?.objectPath)), (value: any) =>
                isObject(value) ? merge(value, updateValue) : updateValue
              );
              return;
            }
          });
        } else if (isArray(values?.data) && (predicate || isNumber(predicate)))
          updateList(values?.data, predicate, updateValue, path?.objectPath);
        else
          update(values, compact(concat(['data'], path?.objectPath)), (value: any) =>
            isObject(value) ? merge(value, updateValue) : updateValue
          );
        return values;
      })
    );
  };

  const pushQuery = (insertValue: any, path?: updatePathList, predicate?: ListIterateeCustom<object, boolean>) => {
    query.setQueryData(queryName, (oldData: any) =>
      cloneWith(oldData, (values: any) => {
        if (!isEmpty(values?.pages)) {
          forEach(values.pages, (page: any) => {
            if (path?.listPath && predicate) {
              if (
                insertList(
                  path?.objectPath ? get(page?.data, path?.objectPath) : page?.data,
                  predicate,
                  path?.listPath,
                  insertValue
                )
              )
                return;
            } else {
              update(page, compact(concat(['data'], path?.objectPath)), (value: any) =>
                concat(value || [], insertValue)
              );
              return;
            }
          });
        } else if (path?.listPath && predicate) {
          if (
            insertList(
              path?.objectPath ? get(values?.data, path?.objectPath) : values?.data,
              predicate,
              path?.listPath,
              insertValue
            )
          )
            return;
        } else {
          update(values, compact(concat(['data'], path?.objectPath)), (value: any) => concat(value || [], insertValue));
          return;
        }
        return values;
      })
    );
  };

  const unshiftQuery = (insertValue: any, path?: updatePathList, predicate?: ListIterateeCustom<object, boolean>) => {
    query.setQueryData(queryName, (oldData: any) =>
      cloneWith(oldData, (values: any) => {
        if (!isEmpty(values?.pages)) {
          forEach(values.pages, (page: any) => {
            if (path?.listPath && predicate) {
              if (
                insertList(
                  path?.objectPath ? get(page?.data, path?.objectPath) : page?.data,
                  predicate,
                  path?.listPath,
                  insertValue,
                  false
                )
              )
                return;
            } else {
              update(page, compact(concat(['data'], path?.objectPath)), (value: any) =>
                concat(insertValue, value || [])
              );
              return;
            }
          });
        } else if (path?.listPath && predicate) {
          if (
            insertList(
              path?.objectPath ? get(values?.data, path?.objectPath) : values?.data,
              predicate,
              path?.listPath,
              insertValue,
              false
            )
          )
            return;
        } else {
          update(values, compact(concat(['data'], path?.objectPath)), (value: any) => concat(insertValue, value || []));
          return;
        }
        return values;
      })
    );
  };

  const deleteQuery = (path: updatePathList, predicate?: ListIterateeCustom<object, boolean> | number) => {
    updateQuery(path, null, predicate);
  };

  const removeQuery = () => {
    query.removeQueries(queryName);
  };

  const setQuery = (insertValue: any) => {
    query.setQueryData(queryName, insertValue);
  };

  return {updateQuery, removeQuery, pushQuery, unshiftQuery, deleteQuery, setQuery};
};

export default useModifyQuery;
