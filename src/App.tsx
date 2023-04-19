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
        setRepoUrl('');
        setError('Error loading issues. Please check your repository URL.');
      }
    }
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

        <Row className="mt-3">
          <Col>
            <h1 className="text-center">ToDo</h1>
            <div className="column mx-3">
              {todoIssues.map((item) => (
                <div className='issue my-3 align-left' key={item.id}>
                  <div className="title">{item.title}</div>

                  <div>
                    {`#${item.number} opened ${Math.floor((new Date().getTime() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago`}
                  </div>

                  <div>
                    {`#${item.user.login} | Comments: ${item.comments}`}
                  </div>
                </div>
              ))}
            </div>
          </Col>

          <Col>
            <h1 className="text-center">In Progress</h1>
            <div className="column mx-3">
              {inProgressIssues.map((item) => (
                <div className='issue my-3 align-left' key={item.id}>
                  <div className="title">{item.title}</div>

                  <div>
                    {`#${item.number} opened ${Math.floor((new Date().getTime() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago`}
                  </div>
                </div>
              ))}
            </div>
          </Col>

          <Col>
            <h1 className="text-center">Done</h1>
            <div className="column mx-3">
              {doneIssues.map((item) => (
                <div className='issue my-3 align-left' key={item.id}>
                  <div className="title">{item.title}</div>

                  <div>
                    {`#${item.number} opened ${Math.floor((new Date().getTime() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago`}
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
