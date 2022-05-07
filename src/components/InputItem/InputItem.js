import React, { Component } from "react";
import { Button, Container } from "reactstrap";
import TextField from "@material-ui/core/TextField";
import { Navigate } from "react-router-dom";
import TodoList from "../TodoList/TodoList";
import Header from "../Header/Header";
import "./style.css";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import EditTodo from "../EditTodo/EditTodo";
const theme = createTheme({
  palette: {
    primary: {
      main: "#2076D2"
    }
  }
});

export default class InputItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskData: {
        title: "",
        description: "",
        status: ""
      },
      showTaskData: [],
      successAlertMsg: "",
      todoDeleteMsg: "",
      editTaskDataModal: false,
      editTaskData: {
        title: "",
        description: ""
      },
      successTodoUpdatedMsg: ""
    };
  }
  componentDidMount() {
    this.getTaskData();
  }

  addItem = () => {
    let token = sessionStorage.getItem("token");
    var formdata = new FormData();
    formdata.append("title", this.state.taskData.title);
    formdata.append("description", this.state.taskData.description);
    var requestOptions = {
      method: "POST",
      body: formdata,
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    fetch("http://127.0.0.1:8000/api/user/todos", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === "success") {
          this.setState({ successAlertMsg: result.message }, () =>
            this.getTaskData()
          );
          setTimeout(() => {
            this.setState({ successAlertMsg: "" });
          }, 1000);
        }
        if (result.error === false) {
          this.setState({
            taskData: {
              title: "",
              description: ""
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  getTaskData() {
    let token = sessionStorage.getItem("token");
    var requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    fetch("http://127.0.0.1:8000/api/user/todos", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === "success") {
          this.setState({
            showTaskData: result.data
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  onChangehandler = e => {
    const { taskData } = this.state;
    taskData[e.target.name] = e.target.value;
    console.log((taskData[e.target.name] = e.target.value));
    this.setState({ taskData });
  };
  handleDelete = id => {
    let token = sessionStorage.getItem("token");
    var requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    fetch("http://127.0.0.1:8000/api/user/todos/" + id, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === "success") {
          this.setState(
            {
              todoDeleteMsg: result.message
            },
            () => this.getTaskData()
          );
          setTimeout(() => {
            this.setState({ todoDeleteMsg: "" });
          }, 1000);
        }
      });
  };
  handleComplete = id => {
    let token = sessionStorage.getItem("token");
    var requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    fetch("http://127.0.0.1:8000/api/user/updateStatus/" + id, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === "success") {
          this.setState(
            {
              todoDeleteMsg: result.message
            },
            () => this.getTaskData()
          );
          setTimeout(() => {
            this.setState({ todoDeleteMsg: "" });
          }, 1000);
        }
      });
  };
  toggleEditTaskModal = () => {
    this.setState({
      editTaskDataModal: !this.state.editTaskDataModal
    });
  };
  onChangeEditTodoHandler = e => {
    let { editTaskData } = this.state;
    editTaskData[e.target.name] = e.target.value;
    this.setState({ editTaskData });
  };

  editTodo = (id, title, description) => {
    this.setState({
      editTaskData: { id, title, description },
      editTaskDataModal: !this.state.editTaskDataModal
    });
  };

  updateTodo = () => {
    let { id, title, description } = this.state.editTaskData;
    let token = sessionStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("title", title);
    urlencoded.append("description", description);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: urlencoded
    };

    fetch("http://127.0.0.1:8000/api/user/todos/" + id, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status === "success") {
          this.setState(
            {
              editTaskDataModal: false,
              editTaskData: { title, description }
            },
            () => this.getTaskData()
          );
          setTimeout(() => {
            this.setState({ editTaskDataModal: false });
          }, 1000);
        }
        if (result.errors === false) {
          this.setState({
            successTodoUpdatedMsg: result.message
          });
        }
      })
      .catch(error => console.log("error", error));
  };
  render() {
    const { title, description } = this.state.taskData;
    if (this.state.isLoggedIn === false) {
      return <Navigate to="/log-in" />;
    }
    return (
      <>
        <Header />
        <Container className="themed-container mt-5" fluid="sm">
          <h3 className="text-capitalize">Create task </h3>
          <div
            style={{
              border: "2px solid",
              width: "13%",
              marginBottom: "2%",
              color: "#2076d2"
            }}
          ></div>
          <div className="input-field-container">
            <ThemeProvider theme={theme}>
              <TextField
                type="text"
                name="title"
                placeholder="Task Title"
                value={title}
                onChange={this.onChangehandler}
                color="primary"
              />
              <TextField
                type="text"
                name="description"
                placeholder="Task description"
                value={description}
                onChange={this.onChangehandler}
                color="primary"
                style={{ width: "50%" }}
              />
              <Button
                color="primary"
                className="font-weight-bold add-task"
                onClick={this.addItem}
              >
                Save Task
              </Button>
            </ThemeProvider>
          </div>
          <div className="text-success p-4 mt-2">
            {this.state.successAlertMsg}
          </div>
          {/*TODO list  */}
          <TodoList
            showTaskData={this.state.showTaskData}
            handleDelete={this.handleDelete}
            handleComplete={this.handleComplete}
            todoDeleteMsg={this.state.todoDeleteMsg}
            editTodo={this.editTodo}
            toggleEditTaskModal={this.toggleEditTaskModal}
          />
          {/* Model for Edit Todo */}
          <EditTodo
            toggleEditTaskModal={this.toggleEditTaskModal}
            editTaskDataModal={this.state.editTaskDataModal}
            onChangeEditTodoHandler={this.onChangeEditTodoHandler}
            editTodo={this.editTodo}
            editTaskData={this.state.editTaskData}
            updateTodo={this.updateTodo}
            successTodoUpdatedMsg={this.state.successTodoUpdatedMsg}
          />
        </Container>
      </>
    );
  }
}
