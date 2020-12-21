/*
This script takes care of orchestrating the admin page's tabs (Creation, Inspection and Deletion).
*/
import { creationTab, inspectionTab, deletionTab } from "./tabs.js";
import { inspectionUserList } from "./components.js";
import { showModal } from "./utils.js";
let currentContainer = $("#mainContainer");
// called whenever the current tab changes
const onTabChange = (newPage, data) => {
    console.log("Changing tab to => " + newPage);
    let prevCont = currentContainer[0];
    if (newPage === sessionStorage.getItem("currentTab")) {
        document.body.removeChild(prevCont);
    }
    else {
        // adds the slide-out class to trigger the animation
        currentContainer.addClass("slide-out");
        // when the animation ends, destroy the container
        prevCont.addEventListener("animationend", (e) => {
            document.body.removeChild(prevCont);
        });
    }
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
        case "logout":
            window.location.pathname = "/GamifyUser/LogOut";
            break;
        case "inspectionUserList":
            div = inspectionUserList(data);
            break;
        default:
            return;
    }
    // create new page container
    let newContainer = document.createElement("div");
    newContainer.classList.add("container", "container-admin");
    newContainer.id = "mainContainer";
    newContainer.append(div);
    newContainer.classList.add("fade-in");
    newContainer.addEventListener("animationend", (e) => {
        newContainer.classList.remove("fade-in");
    });
    document.body.insertAdjacentElement('afterbegin', newContainer);
    currentContainer = $(newContainer);
    sessionStorage.clear();
    // save current tab's name to session storage, so that in case
    // the user reloads the page we keep track of the tab he was on
    if (newPage != "logout")
        sessionStorage.setItem("currentTab", newPage);
};
// changes page theme
const changeTheme = (newTheme, speed = 700) => {
    $("body").fadeOut(speed, function () {
        document
            .getElementById("darkModeCSSLink")
            .setAttribute("href", (newTheme === "dark" ? "css/dark-admin.css" : ""));
        $(this).fadeIn(speed);
    });
};
(function () {
    // list of sidenav buttons
    const tabElements = Array.from(document.getElementsByClassName("sidenav-button"));
    // binds left click on sidenav button to tab change callback
    document.addEventListener("mousedown", (event) => {
        let target = event.target;
        if (tabElements.includes(target)) {
            event.preventDefault();
            onTabChange(target.id, null);
        }
    });
    const gamifyLogo = document.getElementById("gamifyLogo");
    // creates protip to instruct user on how to change theme
    if (localStorage.getItem("protipOpened") === null) {
        let protipDiv = document.createElement("label");
        protipDiv.setAttribute("for", "sidenav");
        protipDiv.textContent = "↓ ~try clicking here!~ ↓";
        protipDiv.classList.add("protip-div");
        document.body.insertAdjacentElement("afterbegin", protipDiv);
    }
    const getTheme = () => localStorage.getItem("theme") || "dark";
    if (getTheme() === "light") {
        changeTheme("light", 0);
    }
    // adds listener on logo to change between dark and light modes
    gamifyLogo.addEventListener("click", (e) => {
        // contains current dark mode state
        let newTheme = getTheme() === "light" ? "dark" : "light";
        changeTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        // if it's the first time this has been clicked, remove protip div
        if (localStorage.getItem("protipOpened") === null) {
            localStorage.setItem("protipOpened", "true");
            document.getElementsByClassName("protip-div")[0].remove();
        }
    });
    // tab to be built
    const tab = sessionStorage.getItem("currentTab") || "creation";
    //handle first load / refresh
    if (tab === "creation") {
        onTabChange(tab, null);
        sessionStorage.setItem("currentTab", "creation");
    }
    else {
        onTabChange(tab, null);
    }
    // defines what to do when the creation form is submitted
    $(document).on("submit", "form", function (e) {
        e.preventDefault();
        let date = new Date($(this)[0][2].value);
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date == null || date < today) {
            showModal("Error", "Time travel doesn't exist yet, so please try entering a date that's not in the past.");
            return;
        }
        if (sessionStorage.getItem("imageUploaded") === null) {
            showModal("Error", "Please upload an image");
            return;
        }
        let formData = new FormData($(this)[0]);
        const url = "/GamifyUser/admin/create";
        $.ajax({
            method: "POST",
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            timeout: 20000,
            success: function (data) {
                if (data.redirect) {
                    window.location.href = data.redirect;
                }
                else {
                    showModal("Success", "Congrats! The questionnaire has been submitted successfully.");
                }
            },
            error: function (request, status, error) {
                showModal("Error", request.responseText);
            },
        });
    });
})();
export const inspectionTabChange = (data) => {
    onTabChange("inspectionUserList", data);
};
