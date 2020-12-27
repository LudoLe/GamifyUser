/*
 * Exports the functions that create the tab elements
 */
import { showModal } from "./utils.js";
import { inspectionTabChange } from "./admin.js";
import { TableOrder as TableOrder, searchByDate, searchByName, sortTable } from "./components.js";
// takes a data array and provides a datalist element, to be used to give autofill suggestions
const dataListCreator = (data) => {
    let datalist = document.getElementById("datalistSearch");
    if (datalist == null) {
        datalist = document.createElement("datalist");
        datalist.id = "datalistSearch";
    }
    else {
        while (datalist.lastElementChild) {
            datalist.removeChild(datalist.lastElementChild);
        }
    }
    $.each(data, (key, val) => {
        let opt = document.createElement("option");
        opt.value = val.name;
        datalist.append(opt);
    });
    return datalist;
};
export const deletionTab = () => {
    const deleteUrl = "/GamifyUser/admin/delete?id=";
    // called when a questionnaire has to be deleted
    const deleteFunction = (val) => {
        $.ajax({
            url: deleteUrl + val.questionnaireId,
            success: function (data) {
                showModal("Success!", "Questionnaire deleted correctly", [
                    () => location.reload(),
                ]);
            },
            error: function (request, status, error) {
                showModal("Error", request.responseText);
            },
        });
    };
    const pastListUrl = "/GamifyUser/admin/listQuestionnaires?start=0&size=100&past=true";
    // start page content
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("row");
    let col8 = document.createElement("div");
    col8.classList.add("col-md-8", "col-table-8-red");
    let col4 = document.createElement("div");
    col4.classList.add("col-md-4");
    col4.classList.add("col-search");
    let table = document.createElement("table");
    table.classList.add("table", "table-borderless");
    mainDiv.append(col8);
    mainDiv.append(col4);
    let currentFillData = null;
    col4.append(searchByDate("/GamifyUser/admin/getQuestionnaire?mode=3&date=", (data) => {
        deleteFunction(data);
    }, () => showModal("No result", "Got nothing on that date.")));
    col4.append(searchByName("/GamifyUser/admin/getQuestionnaire?mode=4&name=", (data) => {
        currentFillData = data;
        col4.append(dataListCreator(data));
    }, () => showModal("Error", "Error"), (value) => {
        for (const elem of currentFillData) {
            if (elem.name === value) {
                deleteFunction(elem);
                return;
            }
        }
    }));
    col8.append(table);
    let thead = document.createElement("thead");
    thead.classList.add("thead");
    table.append(thead);
    let tr = document.createElement("tr");
    let th1 = document.createElement("th");
    th1.textContent = "Date ↓";
    let th2 = document.createElement("th");
    th2.textContent = "Product ";
    let th3 = document.createElement("th");
    th3.textContent = "Detail";
    thead.append(tr);
    tr.append(th1);
    tr.append(th2);
    tr.append(th3);
    let tbody = document.createElement("tbody");
    table.append(tbody);
    // end page content
    let currentData = null;
    // gets a list of questionnaires which are deletable, meaning they are in the past
    // creates a table row for each questionnaire
    $.getJSON(pastListUrl, function (data) {
        currentData = data;
        $.each(data, function (key, val) {
            //start row element
            let tr = document.createElement("tr");
            tr.setAttribute("data-table-id", val.questionnaireId);
            let td = document.createElement("td");
            td.textContent = val.datetime.slice(0, 12).replaceAll(",", "");
            tr.append(td);
            td = document.createElement("td");
            td.textContent = val.name;
            tr.append(td);
            td = document.createElement("td");
            let button = document.createElement("button");
            button.classList.add("btn", "btn-outline-danger");
            let i = document.createElement("i");
            // adds listener to click on deletion button; when clicked, a call
            // to deleteUrl happens, which if successful deletes the questionnaire
            button.addEventListener("click", () => deleteFunction(val));
            i.style.setProperty("font-weight", "lighter");
            i.classList.add("fas", "fa-newspaper");
            i.textContent = " Delete";
            button.append(i);
            td.append(button);
            tr.append(td);
            tbody.append(tr);
            //end row element
        });
    });
    let reverseDate = false, reverseName = false;
    let currentOrder = TableOrder.DATE;
    th1.onclick = () => {
        currentOrder = sortTable(TableOrder.DATE, th1, [th2], currentOrder, reverseDate, currentData, tbody);
        reverseDate = !reverseDate;
    };
    th2.onclick = () => {
        currentOrder = sortTable(TableOrder.NAME, th2, [th1], currentOrder, reverseName, currentData, tbody);
        reverseName = !reverseName;
    };
    return mainDiv;
};
export const inspectionTab = () => {
    const listUrl = "/GamifyUser/admin/listQuestionnaires?start=0&size=100";
    // start page content
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("row");
    let col8 = document.createElement("div");
    col8.classList.add("col-md-8", "col-table-8");
    let col4 = document.createElement("div");
    col4.classList.add("col-md-4");
    col4.classList.add("col-search");
    let table = document.createElement("table");
    table.classList.add("table", "table-borderless");
    mainDiv.append(col8);
    mainDiv.append(col4);
    let currentFillData = null;
    col4.append(searchByDate("/GamifyUser/admin/getQuestionnaire?mode=1&date=", (data) => {
        inspectionTabChange(data.questionnaireId);
    }, () => showModal("No result", "Got nothing on that date.")));
    col4.append(searchByName("/GamifyUser/admin/getQuestionnaire?mode=2&name=", (data) => {
        currentFillData = data;
        col4.append(dataListCreator(data));
    }, () => showModal("Error", "Error"), (value) => {
        for (const elem of currentFillData) {
            if (elem.name === value) {
                inspectionTabChange(elem.questionnaireId);
                return;
            }
        }
    }));
    col8.append(table);
    let thead = document.createElement("thead");
    thead.classList.add("thead");
    table.append(thead);
    let tr = document.createElement("tr");
    let th1 = document.createElement("th");
    th1.textContent = "Date ↓";
    let th2 = document.createElement("th");
    th2.textContent = "Product ";
    let th3 = document.createElement("th");
    th3.textContent = "Detail";
    thead.append(tr);
    tr.append(th1);
    tr.append(th2);
    tr.append(th3);
    let tbody = document.createElement("tbody");
    table.append(tbody);
    // end page content
    let currentData = null;
    // gets a list of questionnaires
    // the json contains the questionnaireId, datetime and name of each questionnaire
    $.getJSON(listUrl, function (data) {
        currentData = data;
        $.each(data, function (key, val) {
            let tr = document.createElement("tr");
            tr.setAttribute("data-table-id", val.questionnaireId);
            let td = document.createElement("td");
            td.textContent = val.datetime.slice(0, 12).replaceAll(",", "");
            tr.append(td);
            td = document.createElement("td");
            td.textContent = val.name;
            tr.append(td);
            td = document.createElement("td");
            let button = document.createElement("button");
            button.classList.add("btn", "btn-outline-primary");
            button.addEventListener("click", (ev) => {
                inspectionTabChange(val.questionnaireId);
            });
            let i = document.createElement("i");
            i.classList.add("fas", "fa-newspaper");
            i.textContent = " Open";
            i.style.setProperty("font-weight", "lighter");
            button.append(i);
            td.append(button);
            tr.append(td);
            tbody.append(tr);
        });
    });
    let reverseDate = false, reverseName = false;
    let currentOrder = TableOrder.DATE;
    th1.onclick = () => {
        currentOrder = sortTable(TableOrder.DATE, th1, [th2], currentOrder, reverseDate, currentData, tbody);
        reverseDate = !reverseDate;
    };
    th2.onclick = () => {
        currentOrder = sortTable(TableOrder.NAME, th2, [th1], currentOrder, reverseName, currentData, tbody);
        reverseName = !reverseName;
    };
    return mainDiv;
};
export const creationTab = () => {
    // takes care of adding a question row to the creation page
    const addQuestion = function () {
        let questionNumber = +sessionStorage.getItem("questionNumber") || 1;
        let input = document.createElement("input");
        input.id = "inputQuestion" + questionNumber;
        input.type = "text";
        input.name = "Question" + questionNumber;
        input.className = "form-control question";
        input.placeholder = "Question";
        document.getElementById("questionFormGroup").appendChild(input);
        questionNumber++;
        sessionStorage.setItem("questionNumber", questionNumber.toString());
        return false;
    };
    //start form
    let form = document.createElement("form");
    form.id = "mainForm";
    //start first form group
    let div1 = document.createElement("div");
    div1.classList.add("form-group");
    form.append(div1);
    let div2 = document.createElement("div");
    div2.classList.add("form-row");
    div1.append(div2);
    let col1 = document.createElement("div");
    col1.classList.add("col-md-6");
    div2.append(col1);
    let label1 = document.createElement("label");
    label1.for = "inputName";
    label1.textContent = "Name";
    col1.append(label1);
    let input1 = document.createElement("input");
    input1.type = "text";
    input1.name = "name";
    input1.classList.add("form-control");
    input1.id = "inputName";
    input1.placeholder = "Enter product name";
    input1.required = true;
    col1.append(input1);
    let col2 = document.createElement("div");
    col2.classList.add("col-md-6");
    col2.style.setProperty("text-align", "center");
    div2.append(col2);
    let label2 = document.createElement("label");
    label2.for = "inputImageRow";
    label2.textContent = "Image";
    col2.append(label2);
    let div22 = document.createElement("div");
    div22.classList.add("row", "justify-content-center");
    div22.id = "inputImageRow";
    col2.append(div22);
    let label22 = document.createElement("label");
    label22.for = "inputImage";
    label22.id = "imageFakeLabel";
    label22.classList.add("btn", "btn-outline-primary");
    label22.textContent = "Browse for an image";
    label22.style.setProperty("position", "absolute");
    label22.style.setProperty("bottom", "0");
    label22.style.setProperty("margin", "0 0 0 0");
    div22.append(label22);
    let input2 = document.createElement("input");
    input2.type = "file";
    input2.classList.add("form-control");
    input2.addEventListener("change", (e) => {
        sessionStorage.setItem("imageUploaded", "true");
    });
    input2.id = "inputImage";
    input2.name = "image";
    input2.required = true;
    input2.hidden = true;
    label22.append(input2);
    // close first form group
    //start second form group
    let div3 = document.createElement("div");
    div3.classList.add("form-group");
    form.append(div3);
    let label3 = document.createElement("label");
    label3.for = "inputDate";
    label3.textContent = "Date";
    div3.append(label3);
    let input3 = document.createElement("input");
    input3.type = "date";
    input3.name = "date";
    input3.classList.add("form-control");
    input3.id = "inputDate";
    input3.required = true;
    div3.append(input3);
    // close second form group
    //start third form group
    let label4 = document.createElement("label");
    label4.for = "inputQuestion0";
    label4.textContent = "Questions";
    form.append(label4);
    let div4 = document.createElement("div");
    form.append(div4);
    div4.classList.add("form-group");
    div4.id = "questionFormGroup";
    let input4 = document.createElement("input");
    input4.type = "text";
    input4.name = "Question0";
    input4.classList.add("form-control", "question");
    input1.id = "inputQuestion0";
    input4.placeholder = "Question";
    input4.required = true;
    div4.append(input4);
    // close third form group
    let newQuestionButton = document.createElement("button");
    newQuestionButton.classList.add("btn", "btn-outline-primary");
    newQuestionButton.addEventListener("click", (e) => {
        e.preventDefault();
        addQuestion();
    });
    newQuestionButton.id = "addQuestionButton";
    newQuestionButton.textContent = "Add Question";
    newQuestionButton.style.setProperty("margin-right", "10px");
    form.append(newQuestionButton);
    let submitButton = document.createElement("button");
    submitButton.classList.add("btn", "btn-outline-success");
    submitButton.type = "submit";
    submitButton.textContent = "Create!";
    submitButton.addEventListener("click", (e) => {
        if (sessionStorage.getItem("imageUploaded") === null) {
            showModal("Error", "Please upload an image");
            return;
        }
    });
    form.append(submitButton);
    $("#addQuestionButton").on("click", addQuestion);
    return form;
};
