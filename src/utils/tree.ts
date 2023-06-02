import map from 'lodash/map';

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

export default CustomSelectData;
