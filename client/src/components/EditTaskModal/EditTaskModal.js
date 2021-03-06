import React, { Component } from "react";
import "../CSS/Modal.css";
import DeleteLight from '../../images/deleteLite.png';
import DeleteCharcoal from '../../images/deleteCharcoal.png';
import { Grid, Image, Button, Form, Label, List, Header, Modal, Input, Checkbox } from 'semantic-ui-react';
import API from "../../utils/API";

class EditTaskModal extends Component {

  state = {
    modalOpen: false,
    heading: this.props.heading,
    description: this.props.description,
    due_date: this.props.task.due_date.slice(0, 10),
    changesMade: false,
    possible_users: [],
    task_users: [],
    openOptions: [],
    userMap: {},
    invalidHeading: 0,
    headingAsInput: false,
    descriptionAsInput: false,
    dateAsInput: false,
    item1AsInput: false,
    item2AsInput: false,
    checklist_items: [],
    confirmOpen: false,
    checklist_item_text: "",
    isAddChecklistMostRecent: false,
    altered: [],
  }

  componentDidMount() {
    this.loadUsers();
  }

  handleEditTaskModalOpen = () => {
    this.loadUsers();
    this.setState({ modalOpen: true });
    document.addEventListener('mousedown', this.handleClick, false);
    document.addEventListener("keyup", this.handleStrike, false);
  }
  handleEditTaskModalClose = () => {
    this.props.onClose();
    this.setState({ 
      modalOpen: false,
      changesMade: false,
      confirmOpen: false,
      headingAsInput: false,
      descriptionAsInput: false,
      invalidHeading: 0,
      altered: [],
    });
    document.removeEventListener('mousedown', this.handleClick, false);
    document.removeEventListener("keyup", this.handleStrike, false);
  }
  openConfirm = () => this.setState({ confirmOpen: true })
  closeConfirm = () => this.setState({ confirmOpen: false })

  checkForChanges = () => {
    if (this.state.changesMade) this.openConfirm();
    else this.handleEditTaskModalClose();
  }

  loadUsers = async () => {
    await this.updateUsers();
    this.updateOpenOptions();
  }

  updateUsers = () => {
    this.setState({
      heading: this.props.task.heading,
      description: this.props.task.description,
      due_date: this.props.task.due_date.slice(0, 10),
    });
    let potentialUsers = [];  let usermap = {};  let taskUsers = [];
    this.props.project.Users.map(user => {
      potentialUsers.push(user.id);
      usermap[user.id] = user.first_name;
    });
    this.props.task.Users.map(uzer => {
      taskUsers.push(uzer.id);
    });
    this.setState({ 
      possible_users: potentialUsers,
      task_users: taskUsers,
      userMap: usermap,
    });
    this.loadChecklistItems();
  }

  updateOpenOptions = () => {
    let opens = [];
    this.state.possible_users.map(possuser => {
      if (this.state.task_users.indexOf(possuser) === -1) opens.push(possuser);
    });
    this.setState({openOptions: opens});
  }

  loadChecklistItems = () => {
    this.setState({ checklist_items: [...this.props.task.Checklist_Items] });

    this.props.task.Checklist_Items.map(item => {
      let key = item.id + "AsInput";
      this.setState({ [item.id]: item, [key]: false });
    });
  }

  addCollaborator = id => {
    this.setState({ task_users: [...this.state.task_users, id] });

    let unselected = [...this.state.openOptions];
    unselected.splice(unselected.indexOf(id), 1);
    this.setState({ openOptions: unselected, changesMade: true });
  }

  removeCollaborator = id => {
    let stillAssigenedToTask = [...this.state.task_users];
    stillAssigenedToTask.splice(stillAssigenedToTask.indexOf(id), 1);
    this.setState({
      task_users: stillAssigenedToTask,
      openOptions: [...this.state.openOptions, id],
      changesMade: true,
    });
  }

  handleClick = event => {
    const name = event.target.attributes.name ? event.target.attributes.name.nodeValue : null;

    if (name) {
      this.setState({ [name + "AsInput"]: true });
      this.textify(name);
    }
    else this.textify(null);

    if (name === "checklist_item_text") {
       this.setState({ isAddChecklistMostRecent: true });
    }
    else this.setState({ isAddChecklistMostRecent: false });
  }

  handleStrike = event => {
    if (event.keyCode === 13) {
      this.textify(null);
      if (this.state.confirmOpen === true) this.saveAll();
      else if (this.state.isAddChecklistMostRecent === true && this.state.checklist_item_text.trim() !== "") {
        this.saveNewChecklistItem();
      }
    }
  }

  textify = (exception) => {
    if (exception !== "heading") this.setState({ headingAsInput: false });
    if (exception !== "description") this.setState({ descriptionAsInput: false });
    if (exception !== "date") this.setState({ dateAsInput: false });
    this.state.checklist_items.map(item => {
      if (item.id != exception) {
        this.setState({ [item.id + "AsInput"]: false });
      }
    });
    if (exception !== "heading" && this.state.changesMade === true && this.state.heading.trim() === "") {
      this.setState({ heading: this.state.heading.trim() });
    }
    if (exception !== "description" && this.state.changesMade === true && this.state.description.trim() === "") {
      this.setState({ description: this.state.description.trim() });
    }
  }

  saveAll = () => {
    this.state.altered.forEach(item_id => {
      this.editChecklistItem(item_id);
    });
    this.saveTaskEdits();
  }

  saveTaskEdits = () => {
    this.closeConfirm();

    // make sure the task heading is more than just spaces, otherwise show flag:
    if (this.state.heading.trim() === "") {
      this.setState({ invalidHeading: 1 });

      const modals = document.getElementsByClassName("theModal");

      for (let i = 0; i < modals.length; i++) {
        modals[i].parentElement.scrollTop = 0;
      }
    }
    // Else heading valid, save edits to the database
    else {
      const task_object = {
        due_date: this.state.due_date,
        heading: this.state.heading,
        description: this.state.description,
        users: this.state.task_users  // <–––– [5, 3, 4, ...]
      };

      API.editTask(this.props.task.id, task_object)
        .then(res => {
          this.props.onClose();
        })
        .catch(err => console.log(err));

      this.handleEditTaskModalClose();
      this.setState({ invalidHeading: 0 });
    }
  }

  deleteTask = () => {
    this.handleEditTaskModalClose();
    API.deleteTask(this.props.task.id)
      .then(res => {
        this.props.onClose();
      })
      .catch(err => console.log(err));
  }

  saveNewChecklistItem = () => {
    const list_item = {
      task_id: this.props.task.id,
      text: this.state.checklist_item_text
    }
    // console.log('NEW checklist list_item = ', list_item);
    API.createChecklistItem(list_item)
      .then(res => {
        res.data.Checklist_Items.map(item => {
          this.setState({
            [item.id]: item,
            [item.id + "AsInput"]: false
          });
        });
        this.setState({ 
          checklist_items: res.data.Checklist_Items,
          checklist_item_text: "" 
        }, () => this.props.onClose());
      })
      .catch(err => console.log(err));
  }

  editChecklistItem = (item_id) => {
    API.editChecklistItem(item_id, this.state[item_id])
      .then(res => {
        this.props.onClose();
      })
      .catch(err => console.log('error during attempted item update: ', err));
  }

  deleteChecklistItem = (item_id) => {
    API.deleteChecklistItem(item_id)
      .then(res => {
          this.setState(state => ({ checklist_items: res.data.Checklist_Items }), 
            () => console.log('updated state: ', this.state)
          );
        })
      .catch(err => console.log("error during attempted deletion: ", err));
  }

  updateAltered = item_id => {
    if (this.state.altered.indexOf(item_id) === -1) {
      this.setState({ altered: [...this.state.altered, item_id] });
    }
  }

  toggleCheckbox = (item_id) => {
    this.setState(state => ({
      [item_id]: { ...state[item_id], completed: !state[item_id].completed }
    }), 
    () => this.editChecklistItem(item_id));
  }

  renderHeading = () => {
    if (this.state.headingAsInput === true) {
      return (
        <Form.Field 
            required 
            control={Input}
            name="heading"
            className="headingAsInput"
            type="text"
            value={ (this.state.heading !== "") ?
                        this.state.heading
                        :
                        <div className="italicized descriptionAsText"
                          name="heading">add a heading...</div>
                      }
            onChange={event => this.setState({ heading: event.target.value, changesMade: true })} 
        />
      )
    }
    else {
      // console.log('should be returning the heading text div... ');
      return (
        <Form.Field 
          control={Form.Field}
          className="headingAsText"
          name="heading"
          size="big"
        >{this.state.heading}
        </Form.Field>
      )
    }
  }

  renderDate = () => {
    const date = this.state.due_date;
    if (this.state.dateAsInput) {
      return (
        <Form.Input 
          required
          name='date' 
          type='date'
          className="dateAsInput"
          value={this.state.due_date}
          onChange={event => this.setState({ due_date: event.target.value, changesMade: true })}
        /> )
    }
    else {
      return (
        <Form.Field 
          name='date'
          control={Form.Field}
          className='dateAsText'
          size="big"
        >{date.slice(5, 7) + "/" + date.slice(8, 10) + "/" + date.slice(0, 4)}
        </Form.Field> )
    }
  }

  isThereEllipsis = (which) => {
    if (which === "heading") {
      if (this.props.task.heading.length < 14) return null;
      else return "...";
    }
    else if (which === "description") {
      if (this.props.task.heading.length < 18) return null;
      else return "...";
    }
  }

  render() {

    const wellStyles = { maxWidth: 400, margin: '0 auto 10px'};
    const headingValidation = { opacity: this.state.invalidHeading, transition: "opacity 1.8s" };

    return (

      <div className="well" style={wellStyles}>

      <Modal 
        trigger={
          <List animated verticalAlign='middle'
            onClick={this.handleEditTaskModalOpen}>
            <List.Item className="projectTaskListItem">
              <div className="topRow">
                <div className="arrows">>></div>
                <List.Header content={this.props.task.heading} className='sideMargin taskHeading' />
                <div className="ellipsis">{this.isThereEllipsis("heading")}</div>
              </div>
              <List.Content className='sideMargin taskDescription' >{this.props.task.description}</List.Content>
              <div className="ellipsis2">{this.isThereEllipsis("description")}</div>
            </List.Item>
          </List>}
        centered={false}
        open={this.state.modalOpen}
        onClose={this.checkForChanges}
        className="theModal"
        size='large'
        key={this.props.task.id}
      >
        <Modal.Content >
          <Grid divided="vertically">
            <Grid.Row className="modalRow">
              <Grid.Column width={3} className="labels">
                <div >Project:</div>
              </Grid.Column>
              <Grid.Column width={9}>
                <Header className="projectHeader">{this.props.project.name}</Header>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className="modalRow">
              <Grid.Column width={3} className="labels">
                Task:
              </Grid.Column>
              <Grid.Column width={7}>
                { (this.state.headingAsInput === true) ?
                    <Input 
                      fluid
                      className="headingAsInput"
                      name="heading"
                      value={this.state.heading}
                      onChange={event => this.setState({ heading: event.target.value, changesMade: true })}
                    />
                    :
                    <div 
                      className="headingAsText"
                      name="heading"
                    >
                    { (this.state.heading !== "") ?
                      this.state.heading
                      :
                      <div className="addAHeading"
                        name="heading">add a task heading...</div>
                    }
                    </div>
                }
                <Label 
                  pointing 
                  color='orange' 
                  className="validationTag"
                  style={headingValidation}>Task must have a heading
                </Label>
              </Grid.Column>
              <Grid.Column width={2} className="labels">
                Due date:
              </Grid.Column>
              <Grid.Column width={4}>
                {this.renderDate()}
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className="modalRow">
              <Grid.Column width={3} className="labels">Description:</Grid.Column>
              <Grid.Column width={11}>
                { (this.state.descriptionAsInput === true) ?
                      <Input 
                        fluid
                        className="descriptionAsInput"
                        name="description"
                        value={this.state.description}
                        onChange={event => this.setState({ description: event.target.value, changesMade: true })}
                      />
                      :
                      <div 
                        className="descriptionAsText"
                        name="description"
                      >
                      { (this.state.description !== "") ?
                        this.state.description
                        :
                        <div className="italicized descriptionAsText"
                          name="description">add a description...</div>
                      }
                      </div>
                }
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className='usersBox modalRow'>
              <Grid.Column 
                width={3}
                className="labels">
                Current task collaborators: 
              </Grid.Column>
              <Grid.Column width={9} className='userChipsBox'>
                {this.state.task_users.map(userid => (
                  <div 
                    key={userid}
                    value={userid}
                    className='modal_users inline'>
                      <div className='userChipText'><div>{this.state.userMap[userid]}</div></div>
                      <div className="xboxMargin">
                        <div 
                          className='x-box'
                          onClick={() => this.removeCollaborator(userid)}
                        ><div><Image src={DeleteCharcoal} className="theX" /></div></div>
                      </div>
                  </div>
                ))}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className='usersBox modalRow'>
              <Grid.Column 
                width={3}
                className="labels">
                Add collaborators: 
              </Grid.Column>
              <Grid.Column width={9} className="userChipsBox">
                {this.state.openOptions.map(userid => (
                  <div
                    key={`${userid}two`}
                    value={userid}
                    className="inline openOptionUsers"
                    onClick={(event) => this.addCollaborator(userid)}
                    ><div className="userChipText optionChipText">{this.state.userMap[userid]}</div>
                  </div>
                  ))}
              </Grid.Column>
            </Grid.Row>

            <Grid.Row className="modalRow">
              <Grid.Column width={3} className="labels">
                Checklist:
              </Grid.Column>
              <Grid.Column width={9}>
                <div className="scrollboxForChecklistItems">
                {this.state.checklist_items.map(item => (
                  <div key={item.id} className="itemBox">
                    <Checkbox 
                      label={null}
                      className="checklistItemInline checkbox"
                      checked={this.state[item.id].completed}
                      onChange={() => this.toggleCheckbox(item.id)}
                      // onClick={() => this.toggleCheckbox(item.id)} }
                    />
                    <div className="checklistItemInline textDiv">
                      { this.state[item.id + "AsInput"] === false ?
                        <div className='checklistItemText'>
                          <label className={"completed" + this.state[item.id].completed}>
                            {this.state[item.id].text}
                          </label>
                        </div>
                        :
                        <Input 
                          className="checklistItemInput" 
                          name={item.id} 
                          value={this.state[item.id].text} 
                          onChange={event => {
                            this.setState({ [item.id]: {
                                text: event.target.value,
                                completed: this.state[item.id].completed,
                              }, 
                              changesMade: true,
                            });
                            this.updateAltered(item.id);
                            }
                          }
                        />
                      } 
                    </div>
                    <div className="deleteMargin checklistItemInline">
                    <div 
                      className="checklistItemDelete"
                      onClick={() => this.deleteChecklistItem(item.id)}
                    ><Image src={DeleteLight} /></div>
                    </div>
                  </div>

                ))}
                </div>
                <div className="ui action input addChecklistItemBar">
                  <input type="text"
                      placeholder="get something done..."
                      value={this.state.checklist_item_text}
                      onChange={event => this.setState({ checklist_item_text: event.target.value, changesMade: true, isAddChecklistMostRecent: true })}
                      name='checklist_item_text' 
                  />
                  <div className="ui button" color='olive' onClick={() => this.saveNewChecklistItem()}>add checklist item</div>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>

        <Modal.Actions>       
            <Modal 
              trigger={<Button 
                color='grey' 
                icon='undo' 
                content='Go Back' 
                onClick={() => this.checkForChanges()} />}
              open={this.state.confirmOpen}
            >
              <Modal.Content >
                <div className="projectNameBar">{this.props.project.name}</div>
                <div className="taskHeadingBar">{this.state.heading}</div>
                <div className="confirmText">Looks like you've made changes... would you like to save them?</div> 
              </Modal.Content>
              <Modal.Actions>
                <Button 
                  color="green"
                  onClick={() => this.saveAll()}
                >Yes, save the changes
                </Button>
                <Button 
                  color="black"
                  onClick={() => this.handleEditTaskModalClose()}
                >Nah, let 'em go
                </Button>
              </Modal.Actions>
            </Modal>

            <Button color='red' icon='window close' content='Delete Task' onClick={() => this.deleteTask()} />
            <Button color='olive' icon='checkmark' content='Save Task' onClick={() => this.saveAll()} />
        </Modal.Actions>
      </Modal> 
    </div>
       
    );
  }
}


export default EditTaskModal;
