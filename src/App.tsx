import React, { useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Container, Row } from 'react-bootstrap';
import { clearRepoUrl } from './redux/slices/repoUrlSlice';
import { selectColumns } from './redux/slices/columnsSlice';
import { setColumns } from './redux/slices/columnsSlice';
import { fetchIssues } from './redux/slices/IssuesSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { getIssuesApiLink } from './helpers/getIssuesApiLink';
import { filterIssues } from './helpers/filterIssues';
import { Column as ColumnType } from './types/Column';
import { Column } from './components/Column/Column';
import { Form } from './components/Form/Form';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const columns: ColumnType[] = useAppSelector(selectColumns);
  const { repoUrl } = useAppSelector(state => state);

  const updateColumns = useCallback((newColumns: ColumnType[]) => {
    dispatch(setColumns(newColumns));
    localStorage.setItem(repoUrl, JSON.stringify(newColumns));
  }, [dispatch, repoUrl]);

  const handleLoadIssues = async () => {
    const normalizedRepoUrl = getIssuesApiLink(repoUrl);

    const storedState = localStorage.getItem(repoUrl);
    if (storedState) {
      const columnsFromStorage: ColumnType[] = JSON.parse(storedState);

      updateColumns(columnsFromStorage);
      return;
    }

    try {
      const action = await dispatch(fetchIssues(normalizedRepoUrl));
      const issues = action.payload;

      if (!Array.isArray(issues)) {
        throw new Error();
      }

      const { todoIssues, inProgressIssues, doneIssues } = filterIssues(issues);

      updateColumns([
        { id: 'todo', title: 'To Do', issues: todoIssues },
        { id: 'in-progress', title: 'In Progress', issues: inProgressIssues },
        { id: 'done', title: 'Done', issues: doneIssues },
      ]);
    } catch (error) {
      dispatch(clearRepoUrl());

      dispatch(setColumns([
        { id: 'todo', title: 'To Do', issues: [] },
        { id: 'in-progress', title: 'In Progress', issues: [] },
        { id: 'done', title: 'Done', issues: [] }
      ]));

      toast.error('Error loading issues. Please check your repository URL.')
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newColumns = columns.map(column => {
      return { ...column, issues: [...column.issues] };
    });
    const { source, destination } = result;
    console.log(destination.droppableId);
    const sourceColumn = newColumns.find((column) => column.id === source.droppableId);
    const destinationColumn = newColumns.find((column) => column.id === destination.droppableId);
    const item = sourceColumn && sourceColumn.issues.find((item) => item.id === +result.draggableId);
    if (!item) return;
    sourceColumn.issues.splice(source.index, 1);
    destinationColumn && destinationColumn.issues.splice(destination.index, 0, item);
    dispatch({ type: 'columns/setColumns', payload: newColumns });

    localStorage.setItem(repoUrl, JSON.stringify(newColumns));
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

        <DragDropContext
          onDragEnd={handleDragEnd}
        >
          <Row className="mt-3">
            {
              columns.map(column => (
                <Column column={column} key={column.id} />
              ))
            }
          </Row>
        </DragDropContext>
      </Container>
    </div>
  );
};
