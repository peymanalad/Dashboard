import React, {useRef, ElementRef, FC} from 'react';
import {Button, Card, Space, Tooltip} from 'antd';
import {FormOutlined, EditOutlined, DeleteOutlined, FilterOutlined, FileExcelOutlined} from '@ant-design/icons';
import {Graph} from 'react-d3-graph';
import {useTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import {CustomTable, Search} from 'components';
import {useDelete, usePost, useUser} from 'hooks';
import {getTempFileUrl} from 'utils/file';
import {queryStringToObject} from 'utils';
import type {simplePermissionProps} from 'types/common';

const ShowGraph: FC = () => {
  const {t} = useTranslation('organization');
  const searchRef = useRef<ElementRef<typeof Search>>(null);
  const location = useLocation();

  const fetchExcel = usePost({
    url: 'services/app/Organizations/GetOrganizationsToExcel',
    method: 'GET',
    onSuccess(data: any) {
      window.open(getTempFileUrl(data?.fileType, data?.fileToken, data?.fileName), '_self');
    }
  });

  // graph payload (with minimalist structure)

  // the graph configuration, just override the ones you need
  const myConfig = {
    automaticRearrangeAfterDropNode: true,
    collapsible: true,
    directed: true,
    focusAnimationDuration: 0.75,
    focusZoom: 1,
    freezeAllDragEvents: false,
    height: 400,
    highlightDegree: 1,
    highlightOpacity: 0.2,
    linkHighlightBehavior: true,
    maxZoom: 12,
    minZoom: 0.05,
    nodeHighlightBehavior: true,
    panAndZoom: false,
    staticGraph: false,
    staticGraphWithDragAndDrop: false,
    width: 800,
    d3: {
      alphaTarget: 0.05,
      gravity: -250,
      linkLength: 120,
      linkStrength: 2,
      disableLinkForce: false
    },
    node: {
      color: '#d3d3d3',
      fontColor: 'black',
      fontSize: 10,
      fontWeight: 'normal',
      highlightColor: 'blue',
      highlightFontSize: 14,
      highlightFontWeight: 'bold',
      highlightStrokeColor: 'red',
      highlightStrokeWidth: 1.5,
      mouseCursor: 'crosshair',
      opacity: 0.9,
      renderLabel: true,
      size: 200,
      strokeColor: 'none',
      strokeWidth: 1.5,
      svg: '',
      symbolType: 'circle'
    },
    link: {
      color: 'lightgray',
      fontColor: 'black',
      fontSize: 8,
      fontWeight: 'normal',
      highlightColor: 'red',
      highlightFontSize: 8,
      highlightFontWeight: 'normal',
      // labelProperty: 'label',
      mouseCursor: 'pointer',
      opacity: 1,
      renderLabel: false,
      semanticStrokeWidth: true,
      strokeWidth: 3,
      markerHeight: 6,
      markerWidth: 6,
      strokeDasharray: 0,
      strokeDashoffset: 0,
      strokeLinecap: 'butt'
    }
  };

  const onClickNode = (nodeId: string) => {
    window.alert(`Clicked node ${nodeId}`);
  };

  const onClickLink = (source: string, target: string) => {
    window.alert(`Clicked link between ${source} and ${target}`);
  };

  return (
    <Card
      title={t('title')}
      extra={
        <Space size="small">
          {/*<Button*/}
          {/*  className="ant-btn-success d-text-none md:d-text-unset"*/}
          {/*  type="primary"*/}
          {/*  icon={<FileExcelOutlined />}*/}
          {/*  loading={fetchExcel.isLoading}*/}
          {/*  onClick={() => {*/}
          {/*    fetchExcel.post({}, queryStringToObject(location.search));*/}
          {/*  }}>*/}
          {/*  {t('excel')}*/}
          {/*</Button>*/}
        </Space>
      }>
      <Graph
        id="graph-id" // id is mandatory
        data={data}
        config={myConfig}
        onClickNode={onClickNode}
        onClickLink={onClickLink}
      />
      ;
    </Card>
  );
};

export default ShowGraph;

// only with pure configuration it's easy to replicate graphs such as
// http://bl.ocks.org/eesur/be2abfb3155a38be4de4 using react-d3-graph
const data = {
  links: [
    // Groups
    {
      source: 'Marvel',
      target: 'Heroes'
    },
    {
      source: 'Marvel',
      target: 'Villains'
    },
    {
      source: 'Marvel',
      target: 'Teams'
    },
    // Heroes
    {
      source: 'Heroes',
      target: 'Spider-Man'
    },
    {
      source: 'Heroes',
      target: 'CAPTAIN MARVEL'
    },
    {
      source: 'Heroes',
      target: 'HULK'
    },
    {
      source: 'Heroes',
      target: 'Black Widow'
    },
    {
      source: 'Heroes',
      target: 'Daredevil'
    },
    {
      source: 'Heroes',
      target: 'Wolverine'
    },
    {
      source: 'Heroes',
      target: 'Captain America'
    },
    {
      source: 'Heroes',
      target: 'Iron Man'
    },
    {
      source: 'Heroes',
      target: 'THOR'
    },
    // Villains
    {
      source: 'Villains',
      target: 'Dr. Doom'
    },
    {
      source: 'Villains',
      target: 'Mystique'
    },
    {
      source: 'Villains',
      target: 'Red Skull'
    },
    {
      source: 'Villains',
      target: 'Ronan'
    },
    {
      source: 'Villains',
      target: 'Magneto'
    },
    {
      source: 'Villains',
      target: 'Thanos'
    },
    {
      source: 'Villains',
      target: 'Black Cat'
    },
    // Teams
    {
      source: 'Teams',
      target: 'Avengers'
    },
    {
      source: 'Teams',
      target: 'Guardians of the Galaxy'
    },
    {
      source: 'Teams',
      target: 'Defenders'
    },
    {
      source: 'Teams',
      target: 'X-Men'
    },
    {
      source: 'Teams',
      target: 'Fantastic Four'
    },
    {
      source: 'Teams',
      target: 'Inhumans'
    }
  ],
  nodes: [
    // Groups
    {
      id: 'Marvel',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/marvel.png',
      size: 500,
      fontSize: 18
    },
    {
      id: 'Heroes',
      symbolType: 'circle',
      color: 'red',
      size: 300
    },
    {
      id: 'Villains',
      symbolType: 'circle',
      color: 'red',
      size: 300
    },
    {
      id: 'Teams',
      symbolType: 'circle',
      color: 'red',
      size: 300
    },
    // Heroes
    {
      id: 'Spider-Man',
      name: 'Peter Benjamin Parker',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_spiderman.png',
      size: 400
    },
    {
      id: 'CAPTAIN MARVEL',
      name: 'Carol Danvers',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_captainmarvel.png',
      size: 400
    },
    {
      id: 'HULK',
      name: 'Robert Bruce Banner',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_hulk.png',
      size: 400
    },
    {
      id: 'Black Widow',
      name: 'Natasha Alianovna Romanova',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_blackwidow.png',
      size: 400
    },
    {
      id: 'Daredevil',
      name: 'Matthew Michael Murdock',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_daredevil.png',
      size: 400
    },
    {
      id: 'Wolverine',
      name: 'James Howlett',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_wolverine.png',
      size: 400
    },
    {
      id: 'Captain America',
      name: 'Steven Rogers',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_captainamerica.png',
      size: 400
    },
    {
      id: 'Iron Man',
      name: 'Tony Stark',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_ironman.png',
      size: 400
    },
    {
      id: 'THOR',
      name: 'Thor Odinson',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/top_thor.png',
      size: 400
    },
    // Villains
    {
      id: 'Dr. Doom',
      name: 'Victor von Doom',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/drdoom.png',
      size: 400
    },
    {
      id: 'Mystique',
      name: 'Unrevealed',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/mystique.png',
      size: 400
    },
    {
      id: 'Red Skull',
      name: 'Johann Shmidt',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/redskull.png',
      size: 400
    },
    {
      id: 'Ronan',
      name: 'Ronan',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/ronan.png',
      size: 400
    },
    {
      id: 'Magneto',
      name: 'Max Eisenhardt',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/magneto.png',
      size: 400
    },
    {
      id: 'Thanos',
      name: 'Thanos',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/thanos.png',
      size: 400
    },
    {
      id: 'Black Cat',
      name: 'Felicia Hardy',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/blackcat.png',
      size: 400
    },
    // Teams
    {
      id: 'Avengers',
      name: '',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/avengers.png',
      size: 400
    },
    {
      id: 'Guardians of the Galaxy',
      name: '',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/gofgalaxy.png',
      size: 400
    },
    {
      id: 'Defenders',
      name: '',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/defenders.png',
      size: 400
    },
    {
      id: 'X-Men',
      name: '',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/xmen.png',
      size: 400
    },
    {
      id: 'Fantastic Four',
      name: '',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/fantasticfour.png',
      size: 400
    },
    {
      id: 'Inhumans',
      name: '',
      svg: 'http://marvel-force-chart.surge.sh/marvel_force_chart_img/inhumans.png',
      size: 400
    }
  ]
};
