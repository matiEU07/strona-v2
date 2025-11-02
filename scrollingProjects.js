class Project {
  constructor(name, desc, dates, images) {
    this.name = name;
    this.desc = desc;
    this.dates = dates;
    this.images = images;
  }
}

var projects = [];
projects.push(
  new Project(
    "Warszawa Ochota",
    `A detailed 3D environment of the Warszawa Ochota + Warszawa Ochota WKD station and its surroundings.<br> <br>
    The project is almost entirely made in Blender and was divided into small parts, like the benches, platform clocks, and each and every building.<br><br>
    Featuring Modernist architecture with windows that light up the entire enviroment.<br>
    ...the neons are still work in progress.`,
    "2025–now", 
    []
  )
);
projects.push(
  new Project(
    "Hotel Forum",
    `A detailed 3D model of the exterior of one of the last and most innovative hotels built in the beautiful late Modernist architecture.`,
    "2025–now", 
    []
  )
);
function openProject(projectName, projectID) {
    const project = projects.find((element) => element.name === projectName);
    document.getElementById(projectID).innerHTML += '<div class="sidebarText">'+project.desc+'</div>';
    document.getElementById(projectID).classList.add("noPointer")
  }