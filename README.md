# Beezniss <img src="https://user-images.githubusercontent.com/34467850/56313237-fcc55680-6106-11e9-964f-c06ab4abf105.png" alt="logo" width="96" />

Beezniss is a single-page business dashboard built with React and Node/Express/MySQL, incorporating many components of utility to businesses and their employees, including a task manager, a sales forecaster, a marketing performance grapher, live messaging, a social media feed, & videoconferencing capability. j 

Leader and chief contributor of a 5-member team;  
Sole builder of the backend for the app, including db models with Sequelize (models for project, task, user, et al.), routes with Express and Axios;  built entire Task Manager component, including frontend in React
* Description:  A business management dashboard displaying to employees a 
task manager, a sales forecaster, 


## building the app
I (Ehler) built this app along with 4 team members.  

As the lead developer and chief contributor, I worked on most facets of the app, 
but I _alone_ **built**
* the **backend**, including db models, routes, and controllers
* the **Task Manager component** _(à la Trello / Jira)_, including frontend in React/SemanticUI

## Beezniss in action
![beeznissTaskManager](https://user-images.githubusercontent.com/34467850/56338322-72a8dc80-615e-11e9-958b-1818c70136d3.gif)

## [test Beezniss for yourself here!](https://beezniss.herokuapp.com/)

## Code excerpts

### taskModel.js
The model definition for the tasks table in the database via the object-relational-mapper sequelize:
<img src="https://user-images.githubusercontent.com/34467850/56310826-a275c700-6101-11e9-8aad-a7aa803dc0eb.png" alt="taskModel.js" width="705" />

### taskController.js
The controller filters the request data, sending validated request data to the database:
<img src="https://user-images.githubusercontent.com/34467850/56311125-1f08a580-6102-11e9-9bed-82f3be5e264c.png" alt="taskController.js" width="824" />

### taskRouter.js
The taskRouter funnels requests from the frontend (Task Manager panel) to the appropriate controller:
<img src="https://user-images.githubusercontent.com/34467850/56311180-40699180-6102-11e9-99ec-899f70595d4e.png" alt="taskRouter.js" width="806" />


## Technologies utilized 
* React
* Express
* Node
* Semantic-UI
* Sequelize / MySQL
* Firebase *(for live messaging)*
* Axios
* Chart.js
