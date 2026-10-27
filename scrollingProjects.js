function $(id) {
  return document.getElementById(id);
}

function Project(name, desc, dates, images) {
  this.name = name;
  this.desc = desc;
  this.dates = dates;
  this.images = images;
}

var projects = [];

projects.push(new Project(
  "Warszawa Ochota",
  "A detailed 3D environment of the Warszawa Ochota + Warszawa Ochota WKD station and its surroundings.<br> <br>" +
  "The project is almost entirely made in Blender and was divided into small parts, like the benches, platform clocks, and each and every building.<br><br>" +
  "Featuring Modernist architecture with windows that light up the entire enviroment.<br>" +
  "...the neons are still work in progress.",
  "2025\u2013now",
  ["projects/ochotaThumb.png"]
));

projects.push(new Project(
  "Hotel Forum",
  "A detailed 3D model of the exterior of one of the last and most innovative hotels built in the beautiful late Modernist architecture.",
  "2025\u2013now",
  ["projects/forum.png", "projects/forum2d.png", "projects/forumSide.png", "projects/forum-interior.png"]
));

projects.push(new Project(
  "Kowloon Walled City",
  "A fairly detailed 3D model of my own interpretation of the kowloon walled city, focusing on Geometry Nodes for speeding up the modelling process.",
  "2024\u2013now",
  ["projects/kowloon.png", "projects/kowloon2.png", "projects/kowloon3.png", "projects/kowloon4.png"]
));

function findProject(name) {
  for (var i = 0; i < projects.length; i++) {
    if (projects[i].name === name) return projects[i];
  }
  return null;
}

function openProject(projectName, projectID) {
  var project = findProject(projectName);
  var el = $(projectID);
  if (!project || !el) return;

  if (!el.getAttribute("data-loaded")) {
    el.innerHTML += '<div class="sidebarText">' + project.desc +
      '<br><span class="galleryButton" onclick="gallery(\'' + projectName + '\')">gallery</span></div>';
    el.className += " noPointer";
    el.setAttribute("data-loaded", "true");
  }
}

function gallery(projectName) {
  var project = findProject(projectName);
  if (!project) return;

  var container = document.querySelector(".gallery-container");

  if (!container) {
    // create new container
    container = document.createElement("div");
    container.className = "gallery-container";

    var prevBtn = document.createElement("div");
    prevBtn.className = "galleryArrow galleryArrowLeft";
    prevBtn.innerHTML = "&lsaquo;";

    var img = document.createElement("img");

    var nextBtn = document.createElement("div");
    nextBtn.className = "galleryArrow galleryArrowRight";
    nextBtn.innerHTML = "&rsaquo;";

    container.appendChild(prevBtn);
    container.appendChild(img);
    container.appendChild(nextBtn);
    document.body.appendChild(container);

    container.index = 0;

    var render = function () {
      img.src = project.images[container.index];
      img.alt = project.name;
    };

    var step = function (dir) {
      container.index = (container.index + dir + project.images.length) % project.images.length;
      render();
    };

    prevBtn.onclick = function (e) {
      if (e && e.stopPropagation) e.stopPropagation();
      step(-1);
    };
    nextBtn.onclick = function (e) {
      if (e && e.stopPropagation) e.stopPropagation();
      step(1);
    };

    var onKeyDown = function (e) {
      var key = e.key || e.keyCode;
      if (key === "ArrowRight" || key === 39) step(1);
      else if (key === "ArrowLeft" || key === 37) step(-1);
      else if (key === "Escape" || key === 27) {
        container.parentNode.removeChild(container);
        document.removeEventListener("keydown", onKeyDown, false);
      }
    };

    document.addEventListener("keydown", onKeyDown, false);

    render();
  } else {
    // use existing container
    container.index = (container.index + 1) % project.images.length;
    var existing = container.getElementsByTagName("img")[0];
    existing.src = project.images[container.index];
    existing.alt = project.name;
  }
}