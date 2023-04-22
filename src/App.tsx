import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Col, Container, Row, Button, Form, Alert } from 'react-bootstrap';
import { clearRepoUrl, setRepoUrl } from './redux/slices/repoUrlSlice';
import { selectColumns } from './redux/slices/columnsSlice';
import { fetchIssues } from './redux/slices/IssuesSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { getIssuesApiLink } from './helpers/getIssuesApiLink';
import { filterIssues } from './helpers/filterIssues';
import { Column } from './types/Column';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const columns: Column[] = useAppSelector(selectColumns);
  const repoUrl = useAppSelector(state => state.repoUrl);

  const handleLoadIssues = async () => {
    const normalizedRepoUrl = getIssuesApiLink(repoUrl);

    const storedState = localStorage.getItem(repoUrl);
    if (storedState) {
      const columnsFromStorage = JSON.parse(storedState);

      dispatch({
        type: 'columns/setColumns',
        payload: columnsFromStorage,
      });
      return;
    }

    try {
      const action = await dispatch(fetchIssues(normalizedRepoUrl));
      const issues = action.payload;

      if (!Array.isArray(issues)) {
        throw new Error();
      }

      const { todoIssues, inProgressIssues, doneIssues } = filterIssues(issues);
      dispatch({
        type: 'columns/setColumns',
        payload: [
          { id: 'todo', title: 'To Do', items: todoIssues },
          { id: 'in-progress', title: 'In Progress', items: inProgressIssues },
          { id: 'done', title: 'Done', items: doneIssues },
        ]
      });

      localStorage.setItem(repoUrl, JSON.stringify([
        { id: 'todo', title: 'To Do', items: todoIssues },
        { id: 'in-progress', title: 'In Progress', items: inProgressIssues },
        { id: 'done', title: 'Done', items: doneIssues },
      ]));
    } catch (error) {
      dispatch(clearRepoUrl());
      dispatch({
        type: 'columns/setColumns',
        payload: [
          { id: 'todo', title: 'To Do', items: [] },
          { id: 'in-progress', title: 'In Progress', items: [] },
          { id: 'done', title: 'Done', items: [] }
        ],
      });
      toast.error('Error loading issues. Please check your repository URL.')
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newColumns = columns.map(column => {
      return { ...column, items: [...column.items] };
    });
    const { source, destination } = result;
    console.log(destination.droppableId);
    const sourceColumn = newColumns.find((column) => column.id === source.droppableId);
    const destinationColumn = newColumns.find((column) => column.id === destination.droppableId);
    const item = sourceColumn && sourceColumn.items.find((item) => item.id === +result.draggableId);
    if (!item) return;
    sourceColumn.items.splice(source.index, 1);
    destinationColumn && destinationColumn.items.splice(destination.index, 0, item);
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
        <Form.Group as={Row} className="justify-content-between">
          <Col sm={8} md={8} lg={10}>
            <Form.Control
              type="text"
              placeholder="Enter repo URL"
              value={repoUrl}
              className='input'
              onChange={(e) => dispatch(setRepoUrl(e.target.value))}
            />
          </Col>
          <Col xs={6} sm={4} md={4} lg={2}>
            <Button
              variant="secondary"
              onClick={handleLoadIssues}
              className="w-100 button">
              Load Issues
            </Button>
          </Col>
        </Form.Group>

        <DragDropContext
          onDragEnd={handleDragEnd}
        >
          <Row className="mt-3">
            {
              columns.map(column => (
                <Droppable droppableId={column.id} key={column.id}>
                  {(provided) => (
                    <Col {...provided.droppableProps} ref={provided.innerRef}>
                      <h1 className="text-center">{column.title}</h1>
                      <div className="column mx-3">
                        {column.items.map((item, index) => (
                          <Draggable draggableId={item.id.toString()} index={index} key={item.id}>
                            {(provided) => (
                              <div
                                draggable={true}
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
