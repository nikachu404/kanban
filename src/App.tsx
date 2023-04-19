import React from 'react';
import { Issue } from './types/Issue';
import { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { fetchIssues } from './api/fetchIssues';

import './App.css';

export const App: React.FC = () => {
  const repoUrl = 'https://api.github.com/repos/facebook/react/issues';

  const [data, setData] = useState<Issue[]>([]);

  useEffect(() => {
    fetchIssues(repoUrl)
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);

  const todoIssues = data.filter((issue) => issue.state === 'open');
  const inProgressIssues = data.filter((issue) => issue.state === 'open' && issue.assignee);
  const doneIssues = data.filter((issue) => issue.state === 'closed');

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <h3>ToDo</h3>
            {todoIssues.map((item) => (
              <p key={item.id}>{item.title}</p>
            ))}
          </Col>

          <Col>
            <h3>In Progress</h3>
            {inProgressIssues.map((item) => (
              <p key={item.id}>{item.title}</p>
            ))}
          </Col>

          <Col>
            <h3>Done</h3>
            {doneIssues.map((item) => (
              <p key={item.id}>{item.title}</p>
            ))}
          </Col>
        </Row>
      </Container >
    </div>
  );
};
