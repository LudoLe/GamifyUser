//TODO:
// mettere absolute url invece che localhost
// collegare parametri negli url

(function () {
  // main page container
  let currentContainer = $("#mainContainer");

  const tabElements = Array.from(
    document.getElementsByClassName("sidenav-button")
  );

  document.addEventListener("mousedown", (event) => {
    if (tabElements.includes(event.target)) {
      event.preventDefault();
      onTabChange(event.target.id, null);
    }
  });

  const showModal = function (title, content) {
    currentContainer.append(
      `<div class="modal" tabindex="-1" id="#mainModal">
	<div class="modal-dialog">
	  <div class="modal-content">
		<div class="modal-header">
		  <h5 class="modal-title">` +
        title +
        `</h5>
		  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		  </button>
		</div>
		<div class="modal-body">
		  <p>` +
        content +
        `</p>
		</div>
		<div class="modal-footer">
		  <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
		</div>
	  </div>
	</div>
  </div>`
    );
    $(".modal").modal("show");
    $(".modal").on("hidden.bs.modal", function () {
      currentContainer[0].removeChild($(".modal")[0]);
    });
  };

  // called when a question is added
  const addQuestion = function () {
    var questionNumber = sessionStorage.getItem("questionNumber") || 1;
    var input = document.createElement("input");
    input.id = "inputQuestion" + questionNumber;
    input.type = "text";
    input.name = "Question" + questionNumber;
    input.className = "form-control question";
    input.placeholder = "Question";
    document.getElementById("questionFormGroup").appendChild(input);
    questionNumber++;
    sessionStorage.setItem("questionNumber", questionNumber);
    return false;
  };

  const inspectionTab = function () {
    const listUrl =
      "http://localhost:8080/GamifyUser/admin/listQuestionnaires?start=0&size=100";

    let table = document.createElement("table");
    table.classList = "table table-striped";

    let thead = document.createElement("thead");
    thead.classList = "thead";
    table.append(thead);

    let tr = document.createElement("tr");
    let th1 = document.createElement("th");
    th1.textContent = "Date";
    let th2 = document.createElement("th");
    th2.textContent = "Product";
    let th3 = document.createElement("th");
    th3.textContent = "Detail";
    thead.append(tr);
    tr.append(th1);
    tr.append(th2);
    tr.append(th3);

    let tbody = document.createElement("tbody");
    table.append(tbody);

    $.getJSON(listUrl, function (data) {
      $.each(data, function (key, val) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.textContent = val.datetime;
        tr.append(td);
        td = document.createElement("td");
        td.textContent = val.name;
        tr.append(td);
        td = document.createElement("td");
        let button = document.createElement("button");
        button.classList = "btn btn-primary";
        button.addEventListener("click", (ev) => {
          onTabChange("inspectionUserList", val.questionnaireId);
        });
        let i = document.createElement("i");
        i.classList = "fas fa-newspaper";
        i.textContent = " Open";
        button.append(i);
        td.append(button);
        tr.append(td);
        tbody.append(tr);
      });
    });
    return table;
  };

  // onclick for deletion tab
  const deletionTab = function () {
    const pastListUrl =
      "http://localhost:8080/GamifyUser/admin/listQuestionnaires?start=0&size=100&past=true";
    const deleteUrl = "http://localhost:8080/GamifyUser/admin/delete?id=";

    let table = document.createElement("table");
    table.classList = "table table-striped";

    let thead = document.createElement("thead");
    thead.classList = "thead";
    table.append(thead);

    let tr = document.createElement("tr");
    let th1 = document.createElement("th");
    th1.textContent = "Date";
    let th2 = document.createElement("th");
    th2.textContent = "Product";
    let th3 = document.createElement("th");
    th3.textContent = "Detail";
    thead.append(tr);
    tr.append(th1);
    tr.append(th2);
    tr.append(th3);

    let tbody = document.createElement("tbody");
    table.append(tbody);

    $.getJSON(pastListUrl, function (data) {
      $.each(data, function (key, val) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.textContent = val.datetime;
        tr.append(td);
        td = document.createElement("td");
        td.textContent = val.name;
        tr.append(td);
        td = document.createElement("td");
        let button = document.createElement("button");
        button.classList = "btn btn-danger";
        let i = document.createElement("i");
        button.addEventListener("click", (ev) => {
          $.ajax({
            url: deleteUrl + val.questionnaireId,
            success: function (data) {
              showModal("Success!", "Questionnaire deleted correctly");
              location.reload();
            },
          });
        });
        i.classList = "fas fa-newspaper";
        i.textContent = " Delete";
        button.append(i);
        td.append(button);
        tr.append(td);
        tbody.append(tr);
      });
    });

    return table;
  };

  // onclick for deletion tab
  const inspectionUserList = function (questId) {
    const completedUsersUrl =
      "http://localhost:8080/GamifyUser/admin/listQuestionnaireCompletedUsers?start=0&size=100&id=" +
      questId;
    const canceledUsersUrl =
      "http://localhost:8080/GamifyUser/admin/listQuestionnaireCanceledUsers?start=0&size=100&id=" +
      questId;

    let mainDiv = document.createElement("div");
    mainDiv.classList = "row";
    mainDiv.id = "mainRow";
    let col1 = document.createElement("div");
    col1.classList = "col-md-3";
    let ul1 = document.createElement("ul");
    ul1.classList = "list-group";
    ul1.id = "completedUsersList";
    let col2 = document.createElement("div");
    col2.classList = "col-md-3";
    let ul2 = document.createElement("ul");
    ul2.classList = "list-group";
    ul2.id = "canceledUsersList";
    let col3 = document.createElement("div");
    col3.classList = "col-md-6";
    let h31 = document.createElement("h3");
    h31.style = "text-align: center; margin-bottom: 20px";
    h31.textContent = "Completed";
    let h32 = document.createElement("h3");
    h32.style = "text-align: center; margin-bottom: 20px";
    h32.textContent = "Canceled";
    let h33 = document.createElement("h3");
    h33.style = "text-align: center; margin-bottom: 20px";
    h33.textContent = "Answers";

    col1.append(h31);
    col2.append(h32);
    col1.append(ul1);
    col2.append(ul2);
    col3.append(h33);
    mainDiv.append(col1);
    mainDiv.append(col2);
    mainDiv.append(col3);
    $.getJSON(completedUsersUrl, function (data) {
      let ul = document.getElementById("completedUsersList");
      $.each(data, function (key, val) {
        let li = document.createElement("li");
        li.classList = "list-group-item";
        li.textContent = val.username;
        li.id = val.userId;
        ul.append(li);
      });
      let script = document.createElement("script");
      script.src = "js/inspectionUserList.js";
      mainDiv.append(script);
    });

    return mainDiv;
  };

  // onclick for creation tab
  const creationTab = function () {
    //start form
    let form = document.createElement("form");
    form.id = "mainForm";

    //start first form group
    let div1 = document.createElement("div");
    div1.classList = "form-group";
    form.append(div1);
    let div2 = document.createElement("div");
    div2.classList = "form-row";
    div1.append(div2);
    let col1 = document.createElement("div");
    col1.classList = "col-md-6";
    div2.append(col1);
    let label1 = document.createElement("label");
    label1.for = "inputName";
    label1.textContent = "Name";
    col1.append(label1);
    let input1 = document.createElement("input");
    input1.type = "text";
    input1.name = "name";
    input1.classList = "form-control";
    input1.id = "inputName";
    input1.placeholder = "Enter product name";
    input1.required = true;
    col1.append(input1);
    let col2 = document.createElement("div");
    col2.classList = "col-md-6";
    div2.append(col2);
    let label2 = document.createElement("label");
    label2.for = "inputImage";
    label2.textContent = "Image";
    col2.append(label2);
    let input2 = document.createElement("input");
    input2.type = "file";
    input2.classList = "form-control";
    input2.id = "inputImage";
    input2.name = "image";
    input2.required = true;
    col2.append(input2);
    // close first form group

    //start second form group
    let div3 = document.createElement("div");
    div3.classList = "form-group";
    form.append(div3);
    let label3 = document.createElement("label");
    label3.for = "inputDate";
    label3.textContent = "Date";
    div3.append(label3);
    let input3 = document.createElement("input");
    input3.type = "date";
    input3.name = "date";
    input3.classList = "form-control";
    input3.id = "inputDate";
    input3.required = true;
    div3.append(input3);
    // close second form group

    //start third form group
    let div4 = document.createElement("div");
    form.append(div4);
    div4.classList = "form-group";
    div4.id = "questionFormGroup";
    let input4 = document.createElement("input");
    input4.type = "text";
    input4.name = "Question0";
    input4.classList = "form-control question";
    input1.id = "inputQuestion0";
    input4.placeholder = "Question";
    input4.required = true;
    div4.append(input4);
    // close third form group

    let newQuestionButton = document.createElement("button");
    newQuestionButton.classList = "btn btn-primary";
    newQuestionButton.addEventListener("click", (e) => {
      e.preventDefault();
      addQuestion();
    });
    newQuestionButton.id = "addQuestionButton";
    newQuestionButton.textContent = "Add Question";
    newQuestionButton.style = "margin-right: 10px";
    form.append(newQuestionButton);
    let submitButton = document.createElement("button");
    submitButton.classList = "btn btn-success";
    submitButton.type = "submit";
    submitButton.textContent = "Create!";
    form.append(submitButton);
    return form;
  };

  $("#addQuestionButton").click(addQuestion);

  const logoutTab = function () {
    showModal("TODO", "TODO");
  };

  // called whenever the current tab changes
  const onTabChange = function (newPage, data) {
    console.log("Changing tab to => " + newPage);
    currentContainer.addClass("slide-out");
    let prevCont = currentContainer[0];
    prevCont.addEventListener("animationend", (e) => {
      document.body.removeChild(prevCont);
    });
    let div = null;
    switch (newPage) {
      case "creation":
        div = creationTab();
        break;
      case "inspection":
        div = inspectionTab();
        break;
      case "deletion":
        div = deletionTab();
        break;
      case "inspectionUserList":
        div = inspectionUserList(data);
        break;
      default:
        return;
    }
    let newContainer = document.createElement("div");
    newContainer.classList = "container container-admin";
    newContainer.id = "mainContainer";
    newContainer.append(div);
    newContainer.classList.add("fade-in");
    newContainer.addEventListener("animationend", (e) => {
      newContainer.classList.remove("fade-in");
    });
    document.body.append(newContainer);
    currentContainer = $(newContainer);
    sessionStorage.clear();
    sessionStorage.setItem("currentTab", newPage);
  };

  const tab = sessionStorage.getItem("currentTab") || "creation";

  //handle first load / refresh
  if (tab === "creation") {
    onTabChange(tab, null);
    sessionStorage.setItem("currentTab", "creation");
  } else {
    onTabChange(tab, null);
  }

  // defines what to do when the form is submitted
  $(document).on("submit", "form", function (e) {
    e.preventDefault();
    let date = new Date($(this)[0][2].value);
    let today = new Date();
    if (date == null || date == NaN || date < today) {
      showModal(
        "Error",
        "Time travel doesn't exist yet, so please try entering a date that's not in the past."
      );
      return;
    }

    var formData = new FormData($(this)[0]);
    const url = "http://localhost:8080/GamifyUser/admin/create";
    $.ajax({
      method: "POST",
      url: url,
      data: formData,
      processData: false,
      contentType: false,
      timeout: 20000,
      success: function (msg) {
        location.href("/greetings.html");
      },
      error: function (request, status, error) {
        showModal(
          "Error",
          "Questionnaire submission failed. Please try again."
        );
      },
    });
  });
})();
