//TODO:
// mettere absolute url invece che localhost
// collegare parametri negli url

(function () {
  // main page container
  const container = $("#mainContainer");

  const tabElements = Array.from(
    document.getElementsByClassName("sidenav-button")
  );

  document.addEventListener("mousedown", (event) => {
    if (tabElements.includes(event.target)) {
      event.preventDefault();
      onTabChange(event.target.id);
    }
  });

  const showModal = function (title, content) {
    container.append(
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
      container[0].removeChild($(".modal")[0]);
    });
  };

  // called when a question is added
  const addQuestion = function (event) {
    event.preventDefault();
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
    container.append(table);

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
          onTabChange("inspectionUserId");
          inspectionUserList(val.questionnaireId);
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
  };

  // onclick for deletion tab
  const deletionTab = function () {
    const pastListUrl =
      "http://localhost:8080/GamifyUser/admin/listQuestionnaires?start=0&size=100&past=true";
    const deleteUrl = "http://localhost:8080/GamifyUser/admin/delete?id=";

    let table = document.createElement("table");
    table.classList = "table table-striped";
    container.append(table);

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
  };

  // onclick for deletion tab
  const inspectionUserList = function (questId) {
    const completedUsersUrl =
      "http://localhost:8080/GamifyUser/admin/listQuestionnaireCompletedUsers?start=0&size=100&id=" +
      questId;
    const canceledUsersUrl =
      "http://localhost:8080/GamifyUser/admin/listQuestionnaireCanceledUsers?start=0&size=100&id=" +
      questId;

    /*   let backButtonDiv = document.createElement("div"); backButtonDiv.classList = "row"; backButtonDiv.style = "heigth: 35px";
    let backButton = document.createElement("button"); backButton.classList = "btn btn-outline-primary"; backButton.style = "margin: 10px 0 20px 30px";
    backButton.textContent = "Go Back";
    backButtonDiv.append(backButton);
    document.getElementById("mainContainer").append(backButtonDiv);*/

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

    document.getElementById("mainContainer").append(mainDiv);

    $.getJSON(completedUsersUrl, function (data) {
      let ul = document.getElementById("completedUsersList");
      $.each(data, function (key, val) {
        let li = document.createElement("li");
        li.classList = "list-group-item";
        li.textContent = val.username;
        li.id = val.userId;
        ul.append(li);
      });
    });
  };

  // onclick for creation tab
  const creationTab = function () {
    const form = `
		<form id="mainForm">
		<div class="form-group">
		<div class="form-row">
		<div class="col-md-6">
		  <label for="inputName">Name</label>
		  <input type="text" class="form-control" id="inputName" placeholder="Enter product name" required>
		  </div>
		  <div class="col-md-6">
								  <label for="inputImage">Image</label>
								  <input type="file" class="form-control" name="image" id="inputImage" required/>
							  </div>
		</div>
		</div>
			
		<div class="form-group">
		  <label for="inputDate">Date</label>
		  <input type="date" class="form-control" name="inputDate" required>
		</div>
		<div class="form-group" id="questionFormGroup">
				  <input type="text" class="form-control question" id="inputQuestion0" placeholder="Question" required>
	  
		</div>
		<button class="btn btn-primary" id="addQuestionButton">Add Question</button>
		<button type="submit" class="btn btn-success">Create!</button>
		
	 	 </form>`;
    container.append(form);
    $("#addQuestionButton").click(addQuestion);
  };

  $("#addQuestionButton").click(addQuestion);

  const logoutTab = function () {
    showModal("TODO", "TODO");
  };

  // called whenever the current tab changes
  const onTabChange = function (newPage) {
    console.log("Changing tab to => " + newPage);
    container.children().remove();
    switch (newPage) {
      case "creation":
        creationTab();
        break;
      case "inspection":
        inspectionTab();
        break;
      case "deletion":
        deletionTab();
        break;
      default:
    }
    sessionStorage.clear();
    sessionStorage.setItem("currentTab", newPage);
  };

  const tab = sessionStorage.getItem("currentTab") || "creation";

  //handle first load / refresh
  if (tab === "creation") {
    creationTab();
    sessionStorage.setItem("currentTab", "creation");
  } else {
    onTabChange(tab);
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
