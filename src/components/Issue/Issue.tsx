import React, { memo } from 'react';
import { Issue as IssueType } from '../../types/Issue';
import { getIssueCreationTime } from '../../helpers/getIssueCreationTime';
import { Draggable } from 'react-beautiful-dnd';

import './Issue.scss';

interface Props {
  issue: IssueType;
  index: number;
}

export const Issue: React.FC<Props> = memo(({ issue, index }) => {
  return (
    <Draggable draggableId={issue.id.toString()} index={index} key={issue.id}>
      {(provided) => (
        <div
          draggable={true}
          className="issue my-3 align-left"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="issue__title">{issue.title}</div>
          <div>
            {getIssueCreationTime(issue)}
          </div>
          <div>
            {`${issue.user.login} | Comments: ${issue.comments}`}
          </div>
        </div>
      )}
    </Draggable>
  )
})
