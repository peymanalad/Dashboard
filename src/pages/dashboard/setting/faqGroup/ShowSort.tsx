import React from 'react';
import {useTranslation} from 'react-i18next';
import {SortItems} from 'components';
import {useParams} from 'react-router-dom';

function ShowSort() {
  const {t} = useTranslation('setting');
  const {parent_id} = useParams<{parent_id?: string}>();

  return (
    <SortItems
      titleKey="sort_faq"
      query={{parent_id}}
      name={parent_id ? ['faqs', 'sort', parent_id] : ['faqs', 'sort']}
      fetchUrl="faqs"
      sendKey="faqs_id"
      sendUrl="faqs/priority"
      showData={[
        {key: 'question', span: 7},
        {key: 'group', span: 3, render: (value) => value?.title},
        {key: 'answer', span: 10}
      ]}
      t={t}
    />
  );
}

export default ShowSort;
