export const inspectionUserList = (questId) => {
    const completedUsersUrl = "/GamifyUser/admin/listQuestionnaireCompletedUsers?start=0&size=100&id=" +
        questId;
    const canceledUsersUrl = "/GamifyUser/admin/listQuestionnaireCanceledUsers?start=0&size=100&id=" +
        questId;
    // start page content
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("row");
    mainDiv.id = "mainRow";
    mainDiv.name = questId;
    let col1 = document.createElement("div");
    col1.classList.add("col-md-3");
    let ul1 = document.createElement("ul");
    ul1.classList.add("list-group");
    ul1.id = "completedUsersList";
    let col2 = document.createElement("div");
    col2.classList.add("col-md-3");
    let ul2 = document.createElement("ul");
    ul2.classList.add("list-group");
    ul2.id = "canceledUsersList";
    let col3 = document.createElement("div");
    col3.classList.add("col-md-6");
    col3.id = "answersColumn";
    let h31 = document.createElement("h3");
    h31.style.setProperty("text-align", "center");
    h31.style.setProperty("margin-bottom", "20px");
    h31.textContent = "Completed";
    let h32 = document.createElement("h3");
    h32.style.setProperty("text-align", "center");
    h32.style.setProperty("margin-bottom", "20px");
    h32.textContent = "Canceled";
    let h33 = document.createElement("h3");
    h33.style.setProperty("text-align", "center");
    h33.style.setProperty("margin-bottom", "20px");
    h33.textContent = "Answers";
    col1.append(h31);
    col2.append(h32);
    col1.append(ul1);
    col2.append(ul2);
    col3.append(h33);
    mainDiv.append(col1);
    mainDiv.append(col2);
    mainDiv.append(col3);
    // end page content
    // gets list of users who completed the questionnaire and
    // creates a clickable list element for each user;
    // when clicked, the user's answers to the questionnaire are loaded
    // via inpsectionUserList.js
    $.getJSON(completedUsersUrl, function (data) {
        let ul = document.getElementById("completedUsersList");
        ul.classList.add("optional-answers-scrollable");
        $.each(data, function (key, val) {
            let li = document.createElement("li");
            li.classList.add("list-group-item");
            li.textContent = val.username;
            li.id = val.userId;
            ul.append(li);
        });
        let script = document.createElement("script");
        script.src = "js/inspectionUserPage.js";
        mainDiv.append(script);
    });
    // gets list of users who canceled the questionnaire
    $.getJSON(canceledUsersUrl, function (data) {
        let ul = document.getElementById("canceledUsersList");
        ul.classList.add("optional-answers-scrollable");
        $.each(data, function (key, val) {
            let li = document.createElement("li");
            li.classList.add("list-group-item", "canceled-users");
            li.textContent = val.username;
            li.id = val.userId;
            ul.append(li);
        });
    });
    return mainDiv;
};
export const searchByDate = (ajaxURL, onSuccess, onError) => {
    let mainDiv = document.createElement("div");
    let h3 = document.createElement("h5");
    h3.textContent = "Search by Date";
    mainDiv.append(h3);
    let input = document.createElement("input");
    mainDiv.append(input);
    input.type = "date";
    input.name = "searchDate";
    input.classList.add("form-control");
    input.id = "searchDate";
    input.addEventListener('input', (e) => {
        e.preventDefault();
        if (input.value === "")
            return;
        $.ajax({
            method: "GET",
            url: ajaxURL + input.value,
            success: (data) => {
                onSuccess(data);
            },
            error: (res, err, stat) => {
                onError();
            }
        });
    });
    return mainDiv;
};
export const searchByName = (ajaxURL, onSuccess, onError, onSearchSubmit) => {
    let mainDiv = document.createElement("div");
    mainDiv.id = "containerSearchName";
    let h3 = document.createElement("h5");
    h3.textContent = "Search by Name";
    mainDiv.append(h3);
    mainDiv.style.setProperty("margin-top", "28px");
    let input = document.createElement("input");
    mainDiv.append(input);
    input.type = "text";
    input.name = "name";
    input.placeholder = "Fill me";
    input.autocomplete = "off";
    input.setAttribute("list", "datalistSearch");
    input.classList.add("form-control");
    input.id = "searchName";
    input.addEventListener('input', (e) => {
        e.preventDefault();
        if (input.value === "")
            return;
        $.ajax({
            method: "GET",
            url: ajaxURL + input.value,
            success: function (data) {
                onSuccess(data);
            },
            error: function (res, err, stat) {
                onError();
            }
        });
    });
    mainDiv.addEventListener('keyup', (e) => {
        e.preventDefault();
        if (e.key === "Enter") {
            onSearchSubmit(input.value);
        }
    });
    return mainDiv;
};
