import React, { useState } from 'react';
import { Issue } from './types/Issue';
import { Col, Container, Row, Button, Form, Alert } from 'react-bootstrap';
import { fetchIssues } from './api/fetchIssues';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import './App.scss';

const getIssuesLink = (githubLink: string) => {
  const parts = githubLink.split('/');
  const username = parts[3];
  const repository = parts[4];
  const issuesLink = `https://api.github.com/repos/${username}/${repository}/issues`;
  return issuesLink;
};

export const App: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');

  type Column = {
    id: string;
    title: string;
    items: Issue[];
  }

  const [boardsState, setBoardsState] = useState<Column[]>([
    { id: 'todo', title: 'To Do', items: [] },
    { id: 'in-progress', title: 'In Progress', items: [] },
    { id: 'done', title: 'Done', items: [] }
  ]);

  const handleLoadIssues = async () => {
    const normalizedRepoUrl = getIssuesLink(repoUrl);

    if (normalizedRepoUrl) {
      try {
        const issues = await fetchIssues(normalizedRepoUrl);
        if (!Array.isArray(issues)) {
          throw new Error();
        }
        setError('');
        const todoIssues = issues.filter((issue) => issue.state === 'open');
        const inProgressIssues = issues.filter((issue) => issue.state === 'open' && issue.assignee);
        const doneIssues = issues.filter((issue) => issue.state === 'closed');
        setBoardsState([
          { id: 'todo', title: 'To Do', items: todoIssues },
          { id: 'in-progress', title: 'In Progress', items: inProgressIssues },
          { id: 'done', title: 'Done', items: doneIssues }
        ]);
      } catch (error) {
        setRepoUrl('');
        setError('Error loading issues. Please check your repository URL.');
      }
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const sourceColumn = boardsState.find((column) => column.id === source.droppableId);
    const destinationColumn = boardsState.find((column) => column.id === destination.droppableId);
    const item = sourceColumn && sourceColumn.items.find((item) => item.id === +result.draggableId);
    if (!item) return;
    sourceColumn.items.splice(source.index, 1);
    destinationColumn && destinationColumn.items.splice(destination.index, 0, item);
    setBoardsState([...boardsState]);
  };
  
  return (
    <div className="App">
      <Container>
        <Form.Group as={Row} className="justify-content-between">
          <Col sm={8} md={8} lg={10}>
            <Form.Control type="text" placeholder="Enter repo URL" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
          </Col>
          <Col xs={6} sm={4} md={4} lg={2}>
            <Button variant="primary" onClick={handleLoadIssues} className="w-100">Load Issues</Button>
          </Col>
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Row className="mt-3">
            {
              boardsState.map(column => (
                <Droppable droppableId={column.id} key={column.id}>
                  {(provided) => (
                    <Col {...provided.droppableProps} ref={provided.innerRef}>
                      <h1 className="text-center">{column.title}</h1>
                      <div className="column mx-3">
                        {column.items.length && column.items.map((item, index) => (
                          <Draggable draggableId={item.id.toString()} index={index} key={item.id}>
                            {(provided) => (
                              <div
                                className="issue my-3 align-left"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="title">{item.title}</div>
                                <div>
                                  {`#${item.number} opened ${Math.floor((new Date().getTime() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago`}
                                </div>
                                <div>
                                  {`${item.user.login} | Comments: ${item.comments}`}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </Col>
                  )}
                </Droppable>
              ))
            }
          </Row>
        </DragDropContext>
      </Container>
    </div>
  );
};
