/*
This script takes care of orchestrating the admin page's tabs (Creation, Inspection and Deletion).
*/
import { creationTab, inspectionTab, deletionTab } from "./tabs.js";
import { inspectionUserList } from "./components.js";
import { showModal } from "./utils.js";
// convenience pointer to the current page container
let currentContainer = $("#mainContainer");
// get screen available height and set it into css variable
document.documentElement.style.setProperty("--screen-y", window.innerHeight + "px");
// check if browser supports WASM
// code from https://stackoverflow.com/questions/47879864/how-can-i-check-if-a-browser-supports-webassembly
const supported = (() => {
    try {
        if (typeof WebAssembly === "object"
            && typeof WebAssembly.instantiate === "function") {
            const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
            if (module instanceof WebAssembly.Module)
                return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
        }
    }
    catch (e) {
    }
    return false;
})();
sessionStorage.setItem("WASMavailable", supported.toString());
// when page is resized, resize main container and tables accordingly
window.onresize = () => {
    if (document.getElementsByClassName("col-table-8").length !== 0) {
        document.getElementsByClassName("col-table-8")[0].style.setProperty("max-height", window.innerHeight - 150 + "px");
    }
    document
        .getElementById("mainContainer")
        .style.setProperty("max-height", window.innerHeight - 150 + "px");
};
// true if a popstate event is triggered
// a popstate event is a back or forward button press
let isPopEvent = false;
// keeps track of back/forward button presses, to create the Full PWA Experience ™
window.addEventListener("popstate", (e) => {
    isPopEvent = true;
    if (e.state.url != null) {
        onTabChange(e.state.url, e.state.data);
    }
    else {
        onTabChange("logout");
    }
});
// handles tab change
const onTabChange = (newPage, data = null) => {
    console.log("Changing tab to => " + newPage);
    // contains previous tab name
    let prevTab = null;
    if (isPopEvent) {
        isPopEvent = false;
    }
    else {
        // pushes new state to history stack; the state element contains an 'url' element, which contains the
        // name of the tab, and a data element, which currently contains the questionnaire id if the tab is
        // inspectionUserList, or null otherwise.
        history.pushState({ url: newPage, data: data }, newPage);
    }
    document.title = "Admin: " + newPage;
    // prevCont = container to be dismissed
    let prevCont = currentContainer[0];
    // do not trigger animation if reloading the same tab
    if (newPage === prevTab) {
        document.body.removeChild(prevCont);
    }
    else {
        // adds the slide-out class to trigger the slide out animation
        currentContainer.addClass("slide-out");
        // when the animation ends, destroy the container
        prevCont.addEventListener("animationend", () => {
            document.body.removeChild(prevCont);
        });
    }
    let div = null;
    // get new page content
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
    if (newPage === "creation")
        newContainer.style.setProperty("overflow", "auto");
    newContainer.id = "mainContainer";
    newContainer.append(div);
    // add fade in animation to new container
    newContainer.classList.add("fade-in");
    newContainer.addEventListener("animationend", (e) => {
        newContainer.classList.remove("fade-in");
    });
    document.body.insertAdjacentElement("afterbegin", newContainer);
    currentContainer = $(newContainer);
};
// changes page theme (dark/light)
// works by swapping the dark css stylesheet link between empty and actual link
const changeTheme = (newTheme, speed = 700) => {
    $("body").fadeOut(speed, function () {
        document
            .getElementById("darkModeCSSLink")
            .setAttribute("href", newTheme === "dark" ? "css/dark-admin.css" : "");
        $(this).fadeIn(speed);
    });
};
// IIFE
(function () {
    // list of sidenav buttons
    const tabElements = Array.from(document.getElementsByClassName("sidenav-button"));
    // binds left click on sidenav button to tab change callback
    document.addEventListener("mousedown", (event) => {
        let target = event.target;
        if (tabElements.includes(target)) {
            event.preventDefault();
            onTabChange(target.id);
        }
    });
    // page logo in left-bottom corner
    const gamifyLogo = document.getElementById("gamifyLogo");
    // creates protip to instruct user on how to change theme
    if (localStorage.getItem("protipOpened") === null) {
        let protipDiv = document.createElement("label");
        protipDiv.setAttribute("for", "sidenav");
        protipDiv.textContent = "↓ ~try clicking here!~ ↓";
        protipDiv.classList.add("protip-div");
        document.body.insertAdjacentElement("afterbegin", protipDiv);
    }
    const getTheme = () => localStorage.getItem("theme") || "light";
    if (getTheme() === "dark") {
        changeTheme("dark", 0);
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
    //handle first load / refresh
    onTabChange("creation", null);
    // defines what to do when the creation form is submitted
    $(document).on("submit", "form", function (e) {
        e.preventDefault();
        let date = new Date($(this)[0][2].value);
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        // control that date isn't before today
        if (date == null || date < today) {
            showModal("Error", "Time travel doesn't exist yet, so please try entering a date that's not in the past.");
            return;
        }
        // checks that an image has been uploaded
        if (sessionStorage.getItem("imageUploaded") === null) {
            showModal("Error", "Please upload an image");
            return;
        }
        let formData = new FormData($(this)[0]);
        const url = "/GamifyUser/admin/create";
        // ajax call to create questionnaire
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
// this function is used by the inspection tah to switch to the users list page
export const inspectionTabChange = (data) => {
    onTabChange("inspectionUserList", data);
};
