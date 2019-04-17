# Beezniss <img src="https://user-images.githubusercontent.com/34467850/56313237-fcc55680-6106-11e9-964f-c06ab4abf105.png" alt="logo" width="48" />

Beezniss is a single-page business dashboard built with React and Node/Express/MySQL, incorporating many components of utility to businesses, including a task manager, a sales forecaster, live messaging and video conferencing.  

### team
I (Ehler Orngard) built this app along with 4 team members.  I was the lead developer

### Beezniss in action
![beeznissGif]()

#### [test Beezniss for yourself here!](https://beezniss.herokuapp.com/)

### Code excerpts

#### taskModel.js
The model definition for the tasks table in the database via the object-relational-mapper sequelize:
<img src="https://user-images.githubusercontent.com/34467850/56310826-a275c700-6101-11e9-8aad-a7aa803dc0eb.png" alt="taskModel.js" width="705" />

#### taskController.js
The controller filters the request data, sending validated request data to the database:
<img src="https://user-images.githubusercontent.com/34467850/56311125-1f08a580-6102-11e9-9bed-82f3be5e264c.png" alt="taskController.js" width="824" />

#### taskRouter.js
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
