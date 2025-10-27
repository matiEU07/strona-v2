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
    `A detailed 3D environment of the Warszawa Ochota + Warszawa Ochota WKD station and its surroundings.<br> 
    The project is almost entirely made in Blender and was divided into small parts, like the benches, platform clocks, and each and every building.<br>
    For the textures I used public domain assets, as well as Apple Keynote and Photoshop CS6 to make the clock faces or station signs. 
    The entire environment takes place in the 60s–70s and features Post-Modernist architecture in its prime,<br>
    though the neons that made it beautiful are still nowhere to be found.`,
    "2025–now", 
    []
  )
);

function openProject(projectName) {
    const project = projects.find((element) => element.name === projectName);
    console.log(project.desc);
}