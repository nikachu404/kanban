import React, { memo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Issue } from '../Issue/Issue';
import { Column as ColumnType } from '../../types/Column';
import { Col } from 'react-bootstrap';

import './Column.scss';

interface Props {
  column: ColumnType;
}

export const Column: React.FC<Props> = memo(({ column }) => {
  return (
    <Droppable droppableId={column.id} key={column.id}>
      {(provided) => (
        <Col {...provided.droppableProps} ref={provided.innerRef}>
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
  )
})
