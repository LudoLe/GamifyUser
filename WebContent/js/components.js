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
        script.src = "js/inspectionUserList.js";
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
