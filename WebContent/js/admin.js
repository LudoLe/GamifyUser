(function () {

  // main page container
  const container = $("#mainContainer");

  const showModal = function(title, content) {
	container.append(`<div class="modal" tabindex="-1" id="#mainModal">
	<div class="modal-dialog">
	  <div class="modal-content">
		<div class="modal-header">
		  <h5 class="modal-title">` + title + `</h5>
		  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		  </button>
		</div>
		<div class="modal-body">
		  <p>` + content + `</p>
		</div>
		<div class="modal-footer">
		  <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
		</div>
	  </div>
	</div>
  </div>`);
  $('.modal').modal('show');
  $('.modal').on('hidden.bs.modal', function() {
	container[0].removeChild($(".modal")[0]);
  });
  };

  

  // called whenever the current tab chanegs
  const onTabChange = function () {
    container.children().remove();
	sessionStorage.clear();
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
  }

  // onclick for inspection tab
  $("#inspectionNavbarLink").click(function (event) {
	onTabChange();
	const tempUrl = "https://run.mocky.io/v3/5f33c3de-8b3b-406e-9e1e-0294a9e0d35c";

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
	
	$.getJSON( tempUrl, function( data ) {
		$.each( data, function( key, val ) {
		  let tr = document.createElement("tr");
		  let td = document.createElement("td");
		  td.textContent = val.date;
		  tr.append(td);
		  td = document.createElement("td");
		  td.textContent = val.name;
		  tr.append(td);
		  td = document.createElement("td");
		  let button = document.createElement("button");
		  button.classList = "btn btn-primary";
		  button.addEventListener("click", ev => {
			$.ajax({
				url: tempUrl,
				success: function( data ) {
					showModal("TODO","TODO");
				  }
			  });
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
  });

  // onclick for deletion tab
  $("#deletionNavbarLink").click(function (event) {
	onTabChange();
	const tempUrl = "https://run.mocky.io/v3/5f33c3de-8b3b-406e-9e1e-0294a9e0d35c";

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
	
	$.getJSON( tempUrl, function( data ) {
		$.each( data, function( key, val ) {
		  let tr = document.createElement("tr");
		  let td = document.createElement("td");
		  td.textContent = val.date;
		  tr.append(td);
		  td = document.createElement("td");
		  td.textContent = val.name;
		  tr.append(td);
		  td = document.createElement("td");
		  let button = document.createElement("button");
		  button.classList = "btn btn-danger";
		  let i = document.createElement("i");
		  button.addEventListener("click", ev => {
			$.ajax({
				url: tempUrl,
				success: function( data ) {
					alert("TODO");
				  }
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
  });

  // onclick for creation tab
  $("#creationNavbarLink").click(function (event) {
	onTabChange();

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

	$("#addQuestionButton").click(addQuestion);
    container.append(form);
  });
  $("#addQuestionButton").click(addQuestion);

  // defines what to do when the form is submitted
  $(document).on('submit', 'form', function(e) {
	e.preventDefault();
	let date = new Date($(this)[0][2].value);
	let today = new Date();
	if(date == null || date == NaN || date < today) {
		showModal("Error", "Time travel doesn't exist yet, so please try entering a date that's not in the past.");
		return;
	}
	

	var formData = new FormData($(this)[0]);
	const url = "http://localhost:8080/admin/create";
    $.ajax({
		method: "POST",
		url: url,
		data: formData,
		processData: false,
		contentType: false,
		timeout: 20000,
		success: function( msg ) {
			showModal( "TODOOK","TODOOK");
		},
		error: function (request, status, error) {
			if(request.readyState == 0 || request.status == 0) 
              showModal("asd","asd");
		}
	});
});

  $("#logoutNavbarLink").click(function (event) {
	  showModal("TODO","TODO");
  });

})();
