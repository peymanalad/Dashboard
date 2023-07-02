import map from 'lodash/map';
import forEach from 'lodash/forEach';
import {DataNode} from 'antd/es/tree';
import type {PermissionProps} from 'types/permission';

const createChildren = (data: any) => {
  const newChildren: any[] = [];
  if (data?.children) {
    map(data?.children, (child: any) => {
      newChildren.push({
        title: child.title,
        key: `parent-${child.id}`,
        children: createChildren(child)
      });
    });
  }
  if (data?.questions) {
    map(data?.questions, (question: any) => {
      newChildren.push({
        title: question.title,
        key: question.id
      });
    });
  }
  return newChildren;
};

const CustomSelectData = (data: any, key: any = 'title') => {
  const newData: any[] = [];
  if (data) {
    for (let i = 0; i < data?.length; i++) {
      newData.push({
        key: `parent_top_${data[i].id}`,
        title: data[i][key],
        children: createChildren(data[i])
      });
    }
  }
  return newData;
};

function addChildToTreeNode(tree: DataNode[], key: string, newChild: DataNode): DataNode[] {
  // Helper function to traverse the tree recursively
  function traverse(nodes: DataNode[]): boolean {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.key === key) {
        // Add the new child to the found node
        node?.children?.push(newChild);
        return true;
      }
      if (node?.children?.length) {
        // Continue traversing if the current node has children
        if (traverse(node.children)) {
          return true;
        }
      }
    }
    return false;
  }

  // Start traversing from the root tree nodes
  traverse(tree);

  return tree;
}

export const convertPermissionsToTreeNode = (permissions: PermissionProps[]): DataNode[] => {
  const treeData: DataNode[] = [];
  forEach(permissions, (permission: PermissionProps) => {
    if (!permission?.parentName)
      treeData?.push({
        title: permission?.displayName,
        key: permission?.name,
        children: []
      });
    else
      addChildToTreeNode(treeData, permission?.parentName, {
        title: permission?.displayName,
        key: permission?.name,
        children: []
      });
  });
  return treeData;
};

export default CustomSelectData;
