import React, { useCallback, useState } from 'react';

import { Breadcrumbs } from './components/Breadcrumbs/Breadcrumbs';
import { Column } from './components/Column/Column';
import { Form } from './components/Form/Form';

import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Container, Row } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import axios from 'axios';

import { useAppDispatch, useAppSelector } from './redux/hooks';
import { setIsBreadcrumbsVisible } from './redux/slices/breadcrumbsSlice';
import { clearRepoUrl } from './redux/slices/repoUrlSlice';
import { selectColumns } from './redux/slices/columnsSlice';
import { setColumns } from './redux/slices/columnsSlice';

import { getIssuesApiLink } from './helpers/getIssuesApiLink';
import { getRepoApiLink } from './helpers/getRepoApiLink';
import { filterIssues } from './helpers/filterIssues';
import { Column as ColumnType } from './types/Column';

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const columns: ColumnType[] = useAppSelector(selectColumns);
  const { repoUrl } = useAppSelector(state => state);
  const { isBreadcrumbsVisible } = useAppSelector(state => state.isBreadcrumbsVisible);

  const [owner, setOwner] = useState('');
  const [repoName, setRepoName] = useState('');
  const [stars, setStars] = useState(0);

  const updateColumns = useCallback((newColumns: ColumnType[]) => {
    dispatch(setColumns(newColumns));
    localStorage.setItem(repoUrl, JSON.stringify(newColumns));
  }, [dispatch, repoUrl]);

  const handleLoadIssues = async () => {
    const normalizedIssueApiUrl = getIssuesApiLink(repoUrl);
    const normalizedRepoApiUrl = getRepoApiLink(repoUrl);

    const storedState = localStorage.getItem(repoUrl);
    if (storedState) {
      const columnsFromStorage: ColumnType[] = JSON.parse(storedState);

      const repoResponse = await axios.get(normalizedRepoApiUrl);

      setOwner(repoResponse.data.owner.login);
      setRepoName(repoResponse.data.name);
      setStars(repoResponse.data.stargazers_count);

      updateColumns(columnsFromStorage);
      dispatch(setIsBreadcrumbsVisible(true));
      return;
    }

    try {
      const issuesResponse = await axios.get(normalizedIssueApiUrl);
      const issues = issuesResponse.data;

      if (!Array.isArray(issues)) {
        throw new Error();
      }

      const { todoIssues, inProgressIssues, doneIssues } = filterIssues(issues);

      const repoResponse = await axios.get(normalizedRepoApiUrl);

      setOwner(repoResponse.data.owner.login);
      setRepoName(repoResponse.data.name);
      setStars(repoResponse.data.stargazers_count);

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

    const newColumns = columns.map(column => {
      return { ...column, issues: [...column.issues] };
    });

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
