interface Link {
  name?: string;
  url: string;
}

export interface ProjectItem {
  name: string;
  thumbnail?: string;
  description?: string;
  links?: Link[];
}

export function buildProjectItem(item: ProjectItem): HTMLDivElement {
  let div = document.createElement("div");
  div.classList.add("project-item");

  let title = document.createElement("h3");
  title.innerText = item.name;
  div.appendChild(title);

  let content = document.createElement("div");
  content.classList.add("project-item-content");
  div.appendChild(content);

  if (item.thumbnail) {
    let img = document.createElement("img");
    img.classList.add("project-item-thumbnail");
    img.src = item.thumbnail;
    content.appendChild(img);
  }

  if (item.description) {
    let description = document.createElement("p");
    description.classList.add("project-item-description");
    description.innerText = item.description;
    content.appendChild(description);
  }

  if (item.links) {
    let links = document.createElement("ul");
    links.classList.add("project-item-links");
    item.links.forEach((link: Link) => {
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.innerText = link.name ? link.name : link.url;
      a.setAttribute("href", link.url);
      li.appendChild(a);
      links.appendChild(li);
    });
    content.appendChild(links);
  }

  return div;
}
