import React, { memo } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Col, Row, Button, Form as BootstrapForm } from 'react-bootstrap';
import { setRepoUrl } from '../../redux/slices/repoUrlSlice';

import './Form.scss';

interface Props {
  handleLoadIssues: () => void;
}

export const Form: React.FC<Props> = memo(({ handleLoadIssues }) => {
  const dispatch = useAppDispatch();
  const repoUrl = useAppSelector(state => state.repoUrl);

  return (
    <BootstrapForm.Group as={Row} className="justify-content-between form">
      <Col sm={8} md={8} lg={10}>
        <BootstrapForm.Control
          type="text"
          placeholder="Enter repo URL"
          value={repoUrl}
          className='form__input'
          onChange={(e) => dispatch(setRepoUrl(e.target.value))}
        />
      </Col>

      <Col xs={6} sm={4} md={4} lg={2}>
        <Button
          variant="secondary"
          onClick={handleLoadIssues}
          className="w-100 form__button">
          Load Issues
        </Button>
      </Col>
    </BootstrapForm.Group>
  );
});
