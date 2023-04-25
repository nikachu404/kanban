import React, { memo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Col } from 'react-bootstrap';

import { Issue } from '../index';
import { Column as ColumnType } from '../../types';

import './Column.scss';

interface Props {
  column: ColumnType;
}

export const Column: React.FC<Props> = memo(({ column }) => {
  return (
    <Droppable droppableId={column.id} key={column.id}>
      {(provided) => (
        <Col
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="col-12 col-md-6 col-lg-4"
        >
          <h1 className="text-center">{column.title}</h1>

          <div className="column mx-3">
            {column.issues && column.issues.map((issue, index) => (
              <Issue issue={issue} index={index} key={issue.id} />
            ))}
            {provided.placeholder}
          </div>
        </Col>
      )}
    </Droppable>
  );
});