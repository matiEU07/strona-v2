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
        ["projects/forum.png", "projects/forum-ehh.png"]

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

        const img = document.createElement("img");
        container.appendChild(img);
        document.body.appendChild(container);

        container.dataset.index = "0";

        function render() {
            const index = parseInt(container.dataset.index, 10);
            img.src = project.images[index];
            img.alt = project.name;
        }

        function onKeyDown(e) {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Escape") return;

            let index = parseInt(container.dataset.index, 10);

            if (e.key === "ArrowRight") {
                index = (index + 1) % project.images.length;
            } else if (e.key === "ArrowLeft") {
                index = (index - 1 + project.images.length) % project.images.length;
            } else if (e.key === "Escape"){
                container.remove()
                document.removeEventListener("keydown", onKeyDown);
                window.__galleryKeyHandlerAttached = false;
            }

            container.dataset.index = index.toString();
            render();
        }

        if (!window.__galleryKeyHandlerAttached) {
            document.addEventListener("keydown", onKeyDown);
            window.__galleryKeyHandlerAttached = true;
        }

        render();
    } else {
        // use exissting container
        let index = parseInt(container.dataset.index || "0", 10);
        index = (index + 1) % project.images.length;
        container.dataset.index = index.toString();

        const img = container.querySelector("img");
        img.src = project.images[index];
        img.alt = project.name;
    }
  }