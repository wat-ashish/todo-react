import React, { Component } from "react";
import { Button } from "reactstrap";
import TodoItem from "../TodoItem/TodoItem";

export default class TodoList extends Component {
  render() {
    const {
      showTaskData,
      handleDelete,
      handleComplete,
      todoDeleteMsg,
      editTodo
    } = this.props;
    let taskData = [];
    if (showTaskData.length) {
      taskData = showTaskData.map(task => {
        return (
          <TodoItem
            key={task.id}
            title={task.title}
            description={task.description}
            completed={task.completed}
            handleDelete={() => {
              handleDelete(task.id);
            }}
            handleComplete={() => {
              handleComplete(task.id);
            }}
            todoDeleteMsg={todoDeleteMsg}
            editTodo={() => {
              editTodo(task.id, task.title, task.description);
            }}
          />
        );
      });
    }
    return (
      <ul className="list-group my-2">
        <h3 className="text-capitalize">Todo List </h3>
        <div
          style={{
            border: "2px solid",
            width: "13%",
            marginBottom: "2%",
            color: "#2076d2"
          }}
        ></div>
        <div className="d-flex justify-content-between mb-5">
          Task, Description, Status, Edit and Delete
        </div>
        {taskData}
        <p className="text-danger">{todoDeleteMsg}</p>
      </ul>
    );
  }
}
