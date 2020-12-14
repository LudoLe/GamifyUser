//TODO:
// mettere absolute url invece che localhost
// collegare parametri negli url

(function () {
  document
    .getElementById("mainRow")
    .setAttribute("style", "max-height: " + window.screen.height + "px");
  let listItems = document.getElementsByClassName("list-group-item");
  let currentItem = null;
  for (let item of listItems) {
    item.addEventListener("click", (e) => {
      if (currentItem !== null) currentItem.classList.remove("active");
      currentItem = e.target;
      currentItem.classList.add("active");
    });
  }
})();
