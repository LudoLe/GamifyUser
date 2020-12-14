//TODO:
// mettere absolute url invece che localhost
// collegare parametri negli url

(function () {
  const baseUrl =
    "/GamifyUser/admin/getAnswers?questionnaireId=" +
    document.getElementById("mainRow").name +
    "&userId=";
  document
    .getElementById("mainRow")
    .setAttribute("style", "max-height: " + window.screen.height + "px");
  let answersColumn = document.getElementById("answersColumn");

  let listItems = document.getElementsByClassName("list-group-item");
  let currentItem = null;
  for (let item of listItems) {
    item.addEventListener("click", (e) => {
      if (currentItem !== null) currentItem.classList.remove("active");
      currentItem = e.target;
      currentItem.classList.add("active");
      $.getJSON(baseUrl + currentItem.id, function (data) {
        let statistics = data.stats;
        if (answersColumn.childNodes.length > 1) {
          document.getElementById("btnGroupStatistics").remove();
          document.getElementById("divOptionalAnswers").remove();
        }

        let row = document.createElement("div");
        row.classList = "row";
        row.style = "max-height: 100px";
        answersColumn.append(row);
        let btn1 = document.createElement("button");
        btn1.classList = "btn btn-outline-primary btn-stats";
        row.append(btn1);
        let btn2 = document.createElement("button");
        btn2.classList = "btn btn-stats btn-stats-md";
        row.append(btn2);
        let btn3 = document.createElement("button");
        btn3.classList = "btn btn-stats btn-stats-md";
        row.append(btn3);
        btn1.id = "btnAge";
        btn2.id = "btnSex";
        btn3.id = "btnExp";
        btn1.textContent = "Age: ";
        btn2.textContent = "Sex: ";
        btn3.textContent = "Exp: ";

        if (statistics[0] === null) {
          btn1.textContent += "N/A";
          btn1.classList.add("btn-outline-danger");
        } else {
          btn1.textContent += statistics[0];
          btn1.classList.add("btn-outline-primary");
        }
        if (statistics[1] === null) {
          btn2.textContent += "N/A";
          btn2.classList.add("btn-outline-danger");
        } else {
          btn2.textContent += statistics[1];
          switch (statistics[1]) {
            case "male":
              btn2.classList.add("btn-outline-primary");
              break;
            case "female":
              btn2.classList.add("btn-female");
              break;
            default:
              btn2.classList.add("btn-outline-danger");
          }
        }
        if (statistics[2] === null) {
          btn3.textContent += "N/A";
          btn3.classList.add("btn-outline-danger");
        } else {
          btn3.textContent += statistics[2];
          switch (statistics[2]) {
            case "low":
              btn3.classList.add("btn-outline-warning");
              break;
            case "medium":
              btn3.classList.add("btn-outline-primary");
              break;
            default:
              btn3.classList.add("btn-outline-danger");
          }
        }
        let optional = data.opt;
        let divOptional = document.createElement("div");
        divOptional.id = "divOptionalAnswers";
        answersColumn.append(divOptional);
        $.each(optional, function (key, val) {
            let card = document.createElement("div");
            card.classList = "card answers-card";
            let cardHeader = document.createElement("div");
            cardHeader.classList = "card-header";
            cardHeader.textContent = val.question;
            card.append(cardHeader);
            let cardBody = document.createElement("div");
            cardBody.classList = "card-body";
            card.append(cardBody);
            let blockQuote = document.createElement("blockquote");
            blockQuote.classList = "blockQuote mb-0";
            cardBody.append(blockQuote);
            let p = document.createElement("p");
            p.textContent = val.content;
            blockQuote.append(p);
            answersColumn.append(card);
          });
      });
    });
  }
})();
