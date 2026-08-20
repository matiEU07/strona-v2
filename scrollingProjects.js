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
        ["projects/ochotaThumb.png"]

  )
);
projects.push(
  new Project(
    "Hotel Forum",
    `A detailed 3D model of the exterior of one of the last and most innovative hotels built in the beautiful late Modernist architecture.`,
    "2025–now", 
        // ["projects/forum.png", "projects/forum-ehh.png"]
        ["projects/forum.png", "projects/forum2d.png", "projects/forumSide.png", "projects/forum-interior.png"]

  )
);
projects.push(
  new Project(
    "Kowloon Walled City",
    `A fairly detailed 3D model of my own interpretation of the kowloon walled city, focusing on Geometry Nodes for speeding up the modelling process.`,
    "2024–now", 
        ["projects/kowloon.png", "projects/kowloon2.png", "projects/kowloon3.png", "projects/kowloon4.png"]

  )
);
function openProject(projectName, projectID) {
    const project = projects.find((element) => element.name === projectName);
    if(!$(projectID).dataset.loaded){
      $(projectID).innerHTML += '<div class="sidebarText">'+project.desc+'<br><span class="galleryButton" onclick="gallery(\''+projectName+'\')">gallery</span>'+'</div>'
      $(projectID).classList.add("noPointer")
      $(projectID).dataset.loaded = true;
    }
    else
    {
      // $(projectID).children[0].innerHTML=""
    }
  }
  function gallery(projectName)
  {
    const project = projects.find((element) => element.name === projectName);
    if (!project) return;

    let container = document.querySelector(".gallery-container");

    if (!container) { //create new container
        container = document.createElement("div");
        container.classList.add("gallery-container");

        const prevBtn = document.createElement("div");
        prevBtn.classList.add("galleryArrow", "galleryArrowLeft");
        prevBtn.textContent = "‹";

        const img = document.createElement("img");

        const nextBtn = document.createElement("div");
        nextBtn.classList.add("galleryArrow", "galleryArrowRight");
        nextBtn.textContent = "›";

        container.appendChild(prevBtn);
        container.appendChild(img);
        container.appendChild(nextBtn);
        document.body.appendChild(container);

        container.dataset.index = "0";

        function render() {
            const index = parseInt(container.dataset.index, 10);
            img.src = project.images[index];
            img.alt = project.name;
        }

        function step(dir) {
          let index = parseInt(container.dataset.index, 10);
          index = (index + dir + project.images.length) % project.images.length;
          container.dataset.index = index.toString();
          render();
        }

        prevBtn.addEventListener("click", (e) => { e.stopPropagation(); step(-1); });
        nextBtn.addEventListener("click", (e) => { e.stopPropagation(); step(1); });

        function onKeyDown(e) {
          if (e.key === "ArrowRight") step(1);
          else if (e.key === "ArrowLeft") step(-1);
          else if (e.key === "Escape") {
            container.remove();
            document.removeEventListener("keydown", onKeyDown);
            window.__galleryKeyHandlerAttached = false;
          }
        }

        if (!window.__galleryKeyHandlerAttached) {
            document.addEventListener("keydown", onKeyDown);
            window.__galleryKeyHandlerAttached = true;
        }

        render();
    } else {
        // use existing container
        let index = parseInt(container.dataset.index || "0", 10);
        index = (index + 1) % project.images.length;
        container.dataset.index = index.toString();

        const img = container.querySelector("img");
        img.src = project.images[index];
        img.alt = project.name;
    }
  }