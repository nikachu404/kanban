import React, { useState } from 'react';
import { Issue } from './types/Issue';
import { Col, Container, Row, Button, Form, Alert } from 'react-bootstrap';
import { fetchIssues } from './api/fetchIssues';

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
  const [data, setData] = useState<Issue[]>([]);
  const [error, setError] = useState('');

  const todoIssues = data ? data.filter((issue) => issue.state === 'open') : [];
  const inProgressIssues = data ? data.filter((issue) => issue.state === 'open' && issue.assignee) : [];
  const doneIssues = data ? data.filter((issue) => issue.state === 'closed') : [];

  const handleLoadIssues = async () => {
    const normalizedRepoUrl = getIssuesLink(repoUrl);
  
    if (normalizedRepoUrl) {
      try {
        const issues = await fetchIssues(normalizedRepoUrl);
        if (!Array.isArray(issues)) {
          throw new Error;
        }
        setData(issues);
        setError('');

        console.log(normalizedRepoUrl);
      } catch (error) {
        setError('Error loading issues. Please check your repository URL.');
      }
    }
  };

  return (
    <div className="App">
      <Container>
        <Form.Group as={Row}>
          <Col sm={10}>
            <Form.Control type="text" placeholder="Enter repo URL" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
          </Col>
          <Col sm={2}>
            <Button variant="primary" onClick={handleLoadIssues}>Load Issues</Button>
          </Col>
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="mt-3">
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
      </Container>
    </div>
  );
};
