/***
 * Contains the functions to create components used multiple times,
 * possibly by different tabs
 ***/
import { sort, default as init } from './sort_wasm.js';
// init WASM sorting module
// NOTE: if WASM is not available in the browser,
// an error will be thrown in the debug console
// ATM I can't figure out a way of calling this 
// init function inside and if 
init('js/sort_wasm_bg.wasm');
// creates the inspection user list tab
export const inspectionUserList = (questId) => {
    // this endpoint returns a JSON array with a list of users who completed the questionnaire
    const completedUsersUrl = "/GamifyUser/admin/listQuestionnaireCompletedUsers?start=0&size=100&id=" +
        questId;
    // this endpoint returns a JSON array with a list of users who canceled the questionnaire
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
        // lazy load script to handle inspection user list and user answers
        import(
        /* webpackChunkName: "inspectionUserPage" */ "./inspectionUserPage.js").then((module) => {
            module.default();
        });
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
// component to provide "search by date" functionality for inspection and deletion tabs
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
    input.addEventListener("change", (e) => {
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
            },
        });
    });
    return mainDiv;
};
// component to provide "search by name" functionality for inspection and deletion tabs
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
    input.addEventListener("input", (e) => {
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
            },
        });
    });
    mainDiv.addEventListener("keyup", (e) => {
        e.preventDefault();
        if (e.key === "Enter") {
            onSearchSubmit(input.value);
        }
    });
    return mainDiv;
};
export var TableOrder;
(function (TableOrder) {
    TableOrder[TableOrder["DATE"] = 0] = "DATE";
    TableOrder[TableOrder["NAME"] = 1] = "NAME";
})(TableOrder || (TableOrder = {}));
(function (TableOrder) {
    TableOrder.compare = (order, reverse = false) => (a, b) => {
        let result = false; // -1
        switch (order) {
            case TableOrder.DATE:
                result = new Date(a.datetime) < new Date(b.datetime);
                break;
            case TableOrder.NAME:
                result = a.name < b.name;
                break;
            default:
                return -1;
        }
        return !reverse === result ? 1 : -1;
    };
})(TableOrder || (TableOrder = {}));
export const sortTable = (sortParameter, th1, otherTableHeaders, currentOrder, isReverse, data, tbody) => {
    if (currentOrder != sortParameter) {
        th1.textContent += "↓";
        for (const theader of otherTableHeaders) {
            theader.textContent = theader.textContent.replace("↑", "");
            theader.textContent = theader.textContent.replace("↓", "");
        }
        currentOrder = sortParameter;
    }
    if (isReverse) {
        // table sorting function defaults to a very fast parallel
        // see https://github.com/darklamp/sort-table-wasm
        // sorting function written in Rust and deployed via WASM
        // takes 3 params: data to be sorted, flag for reversing order, flag for sorting by date
        // in case WASM is not available, it falls back to js sorting
        if (sessionStorage.getItem("WASMavailable") === "true") {
            data = sort(data, true, sortParameter === TableOrder.DATE);
        }
        else
            data = data.sort(TableOrder.compare(sortParameter));
        th1.textContent = th1.textContent.replace("↑", "↓");
        isReverse = false;
    }
    else {
        if (sessionStorage.getItem("WASMavailable") === "true") {
            data = sort(data, false, sortParameter === TableOrder.DATE);
        }
        else
            data = data.sort(TableOrder.compare(sortParameter, true));
        th1.textContent = th1.textContent.replace("↓", "↑");
        isReverse = true;
    }
    let currentIds = data.map((e) => e.questionnaireId);
    for (const i of currentIds) {
        let el = document.querySelector(`[data-table-id='${i}']`);
        tbody.insertAdjacentElement("afterbegin", el);
    }
    return currentOrder;
};
