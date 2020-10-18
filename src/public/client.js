let store = Immutable.Map({
  user: "To Mars Rover DashBoard",
  apod: "",
  rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
  rover: "",
});

const flag = false;
// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
    const newStore = store.merge(store, newState);
    render(root, newStore);
}

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = (state) => {
  let rovers = state.get('rovers');
  let roverInfo = [];

  if(state.get('rover') !== "") {
    roverInfo = state.getIn(['rover','images','photos']);
  }

  return `
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              ${Greeting(store.get('user'))}
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
                ${showTabs(rovers.toJS())}
            </div>
          </div>
          <div class="row">
             ${roverInfo.size > 0 ? showRoverDetails(roverInfo.toJS()) : ''}
          </div>
        </div>
    `
};


// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  return `
        <p class="text-center font-italic text-monospace">Welcome to Mars Rover DashBoard checkout the 
            most recent images taken by that rover and also some important information  about the rover and its mission
        </p>
    `
};

const showTabs = (rovers) => {
  return `<ul class="nav nav-tabs">
            ${rovers.map((rover) => {
              return `<div class="col-md-3">
                        <li class="nav-item">
                          <a class="nav-link active" href="#${rover}" onclick="getRoverDetails('${String(rover)}')">${rover}</a>
                        </li>
                      </div>
                    `
            })} 
          </ul>`
};

const showRoverDetails = (roverInfo) => {
  if(roverInfo.length > 0) {

    return `<div class="card" style="width: 60rem;display:inline-block;">
            ${roverInfo.map((info) => {
              return `    <div class="card" style="width: 18rem;display:inline-block;">
                            <div class="card-body">
                              <img src="${info.img_src}" class="card-img-top" width="200" height="200" alt="...">
                              <h5 class="card-title">Name :${info.camera.name}x</h5>
                              <h6 class="card-subtitle mb-2 text-muted">Launch Date: ${info.rover.launch_date}</h6>
                              <h6 class="card-subtitle mb-2 text-muted">Landing Date: ${info.rover.landing_date}</h6>
                              <h6 class="card-subtitle mb-2 text-muted">Earth Date: ${info.earth_date}</h6>
                              <h6 class="card-subtitle mb-2 text-muted">Rover Id: ${info.id}</h6>
                            </div>
                          </div>
                    `
            })} 
          </div>
          `
  }
}


// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.media_type === "video") {
    return `
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `
  } else {
    return `
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `
  }
};

// ------------------------------------------------------  API CALLS
const getRoverDetails = (roverName) => {
  fetch(`http://localhost:3000/rovers?name=${roverName}`)
    .then((res) => res.json())
    .then((rover) => updateStore(store, { rover }));
};

// Example API call
const getImageOfTheDay = (state) => {
  let { apod } = state;
  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));
  
  return data;
};