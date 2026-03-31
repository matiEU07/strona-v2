const $ = (id) => document.getElementById(id);

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
        ["projects/test1.png", "projects/test2.webp"]

  )
);
projects.push(
  new Project(
    "Hotel Forum",
    `A detailed 3D model of the exterior of one of the last and most innovative hotels built in the beautiful late Modernist architecture.`,
    "2025–now", 
        ["projects/forum.png", "projects/forum-ehh.webp"]

  )
);
function openProject(projectName, projectID) {
    const project = projects.find((element) => element.name === projectName);
    if(!$(projectID).dataset.loaded){
      $(projectID).innerHTML += '<div class="sidebarText">'+project.desc+'<br><span class="galleryButton" onclick="gallery('+projectID+')">gallery</span>'+'</div>'
      $(projectID).classList.add("noPointer")
      $(projectID).dataset.loaded = true;
    }
    else
    {
      // $(projectID).children[0].innerHTML=""
    }
  }
  function gallery(projectID)
  {
    $("body").append()

    ["projects/test1.png", "projects/test2.webp"]

    
    // <div class="gallery-container">

    //     <img src="projects/forum-ehh.png" alt="hotel forum, river side, rendered in cycles.">

    // </div>        
  }