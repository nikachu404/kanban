import React, { useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Container, Row } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import axios from 'axios';

import { Breadcrumbs, Column, Form } from './components';

import { useAppDispatch, useAppSelector } from './redux/hooks';
import {
  setIsBreadcrumbsVisible, setOwner, setRepoName, setStars, clearRepoUrl, selectColumns,
  setColumns, selectRepoUrl, selectBreadcrumbsInfo, selectIsBreadcrumbsVisible
} from './redux/slices';

import { getIssuesApiLink, getRepoApiLink, filterIssues } from './helpers';

import { Column as ColumnType } from './types';

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const columns: ColumnType[] = useAppSelector(selectColumns);
  const repoUrl = useAppSelector(selectRepoUrl);
  const isBreadcrumbsVisible = useAppSelector(selectIsBreadcrumbsVisible);
  const { owner, repoName, stars } = useAppSelector(selectBreadcrumbsInfo);

  const updateColumns = useCallback((newColumns: ColumnType[]) => {
    dispatch(setColumns(newColumns));
    localStorage.setItem(repoUrl, JSON.stringify(newColumns));
  }, [dispatch, repoUrl]);

  const handleLoadIssues = async () => {
    const normalizedIssueApiUrl = getIssuesApiLink(repoUrl);
    const normalizedRepoApiUrl = getRepoApiLink(repoUrl);

    const storedState = localStorage.getItem(repoUrl);
    if (storedState) {
      try {
        const columnsFromStorage: ColumnType[] = JSON.parse(storedState);

        const repoResponse = await axios.get(normalizedRepoApiUrl);

        dispatch(setOwner(repoResponse.data.owner.login));
        dispatch(setRepoName(repoResponse.data.name));
        dispatch(setStars(repoResponse.data.stargazers_count));

        updateColumns(columnsFromStorage);
        dispatch(setIsBreadcrumbsVisible(true));
        return;
      } catch (error) {
        dispatch(clearRepoUrl());

        dispatch(setColumns([
          { id: 'todo', title: 'To Do', issues: [] },
          { id: 'in-progress', title: 'In Progress', issues: [] },
          { id: 'done', title: 'Done', issues: [] }
        ]));

        dispatch(setIsBreadcrumbsVisible(false));

        toast.error('Error loading issues. Please check your repository URL.');
      }
    }

    try {
      const issuesResponse = await axios.get(normalizedIssueApiUrl);
      const issues = issuesResponse.data;

      if (!Array.isArray(issues)) {
        throw new Error();
      }

      const { todoIssues, inProgressIssues, doneIssues } = filterIssues(issues);

      const repoResponse = await axios.get(normalizedRepoApiUrl);

      dispatch(setOwner(repoResponse.data.owner.login));
      dispatch(setRepoName(repoResponse.data.name));
      dispatch(setStars(repoResponse.data.stargazers_count));

      updateColumns([
        { id: 'todo', title: 'To Do', issues: todoIssues },
        { id: 'in-progress', title: 'In Progress', issues: inProgressIssues },
        { id: 'done', title: 'Done', issues: doneIssues },
      ]);

      dispatch(setIsBreadcrumbsVisible(true));
    } catch (error) {
      dispatch(clearRepoUrl());

      dispatch(setColumns([
        { id: 'todo', title: 'To Do', issues: [] },
        { id: 'in-progress', title: 'In Progress', issues: [] },
        { id: 'done', title: 'Done', issues: [] }
      ]));

      dispatch(setIsBreadcrumbsVisible(false));

      toast.error('Error loading issues. Please check your repository URL.');
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newColumns = columns.map(column => ({ ...column, issues: [...column.issues] }));

    const { source, destination } = result;

    const sourceColumn = newColumns.find((column) => column.id === source.droppableId);
    const destinationColumn = newColumns.find((column) => column.id === destination.droppableId);

    const item = sourceColumn && sourceColumn.issues.find((item) => item.id === +result.draggableId);

    if (!item) return;

    sourceColumn.issues.splice(source.index, 1);
    destinationColumn && destinationColumn.issues.splice(destination.index, 0, item);

    updateColumns(newColumns);
  };

  return (
    <div className="App">
      <ToastContainer
        theme="light"
        position="bottom-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover={false}
      />

      <Container>
        <Form handleLoadIssues={handleLoadIssues} />

        {isBreadcrumbsVisible && <Breadcrumbs owner={owner} repoName={repoName} stars={stars.toString()} />}

        <DragDropContext onDragEnd={handleDragEnd} >
          <Row className="mt-3">
            {columns.map(column => (
              <Column column={column} key={column.id} />
            ))}
          </Row>
        </DragDropContext>
      </Container>
    </div>
  );
};
