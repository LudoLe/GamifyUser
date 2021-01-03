(()=>{"use strict";var e,t={632:(e,t,n)=>{function a(e,t,n=null){$("#mainContainer").append('<div class="modal" tabindex="-1" id="#mainModal">\n\t<div class="modal-dialog">\n\t  <div class="modal-content">\n\t\t<div class="modal-header">\n\t\t  <h5 class="modal-title">'+e+'</h5>\n\t\t  <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n\t\t\t<span aria-hidden="true">&times;</span>\n\t\t  </button>\n\t\t</div>\n\t\t<div class="modal-body">\n\t\t  <p>'+t+'</p>\n\t\t</div>\n\t\t<div class="modal-footer">\n\t\t  <button type="button" class="btn btn-outline-primary" data-dismiss="modal">Close</button>\n\t\t</div>\n\t  </div>\n\t</div>\n  </div>'),$(".modal").modal("show"),$(".modal").on("hidden.bs.modal",(function(){if(document.getElementById("mainContainer").removeChild($(".modal")[0]),null!=n)for(const e of n)e()}))}n.d(t,{A:()=>p});const o=(e,t,n)=>{let a=document.createElement("div"),o=document.createElement("h5");o.textContent="Search by Date",a.append(o);let r=document.createElement("input");return a.append(r),r.type="date",r.name="searchDate",r.classList.add("form-control"),r.id="searchDate",r.addEventListener("change",(a=>{a.preventDefault(),""!==r.value&&$.ajax({method:"GET",url:e+r.value,success:e=>{t(e)},error:(e,t,a)=>{n()}})})),a},r=(e,t,n,a)=>{let o=document.createElement("div");o.id="containerSearchName";let r=document.createElement("h5");r.textContent="Search by Name",o.append(r),o.style.setProperty("margin-top","28px");let d=document.createElement("input");return o.append(d),d.type="text",d.name="name",d.placeholder="Fill me",d.autocomplete="off",d.setAttribute("list","datalistSearch"),d.classList.add("form-control"),d.id="searchName",d.addEventListener("input",(a=>{a.preventDefault(),""!==d.value&&$.ajax({method:"GET",url:e+d.value,success:function(e){t(e)},error:function(e,t,a){n()}})})),o.addEventListener("keyup",(e=>{e.preventDefault(),"Enter"===e.key&&a(d.value)})),o};var d;!function(e){e[e.DATE=0]="DATE",e[e.NAME=1]="NAME"}(d||(d={})),function(e){e.compare=(t,n=!1)=>(a,o)=>{let r=!1;switch(t){case e.DATE:r=new Date(a.datetime)<new Date(o.datetime);break;case e.NAME:r=a.name<o.name;break;default:return-1}return!n===r?1:-1}}(d||(d={}));const l=(e,t,n,a,o,r,l)=>{if(a!=e){t.textContent+="↓";for(const e of n)e.textContent=e.textContent.replace("↑",""),e.textContent=e.textContent.replace("↓","");a=e}o?(r=r.sort(d.compare(e)),t.textContent=t.textContent.replace("↑","↓"),o=!1):(r=r.sort(d.compare(e,!0)),t.textContent=t.textContent.replace("↓","↑"),o=!0);let i=r.map((e=>e.questionnaireId));for(const e of i){let t=document.querySelector(`[data-table-id='${e}']`);l.insertAdjacentElement("afterbegin",t)}return a},i=e=>{let t=document.getElementById("datalistSearch");if(null==t)t=document.createElement("datalist"),t.id="datalistSearch";else for(;t.lastElementChild;)t.removeChild(t.lastElementChild);return $.each(e,((e,n)=>{let a=document.createElement("option");a.value=n.name,t.append(a)})),t};let s=$("#mainContainer");document.documentElement.style.setProperty("--screen-y",window.innerHeight+"px"),window.onresize=()=>{0!==document.getElementsByClassName("col-table-8").length&&document.getElementsByClassName("col-table-8")[0].style.setProperty("max-height",window.innerHeight-150+"px"),document.getElementById("mainContainer").style.setProperty("max-height",window.innerHeight-150+"px")};let c=!1;window.addEventListener("popstate",(e=>{c=!0,null!=e.state.url?m(e.state.url,e.state.data):m("logout")}));const m=(e,t=null)=>{console.log("Changing tab to => "+e),c?c=!1:history.pushState({url:e,data:t},e),document.title="Admin: "+e;let m=s[0];null===e?document.body.removeChild(m):(s.addClass("slide-out"),m.addEventListener("animationend",(()=>{document.body.removeChild(m)})));let u=null;switch(e){case"creation":u=(()=>{const e=function(){let e=+sessionStorage.getItem("questionNumber")||1,t=document.createElement("input");return t.id="inputQuestion"+e,t.type="text",t.name="Question"+e,t.className="form-control question",t.placeholder="Question",document.getElementById("questionFormGroup").appendChild(t),e++,sessionStorage.setItem("questionNumber",e.toString()),!1};let t=document.createElement("form");t.id="mainForm";let n=document.createElement("div");n.classList.add("form-group"),t.append(n);let o=document.createElement("div");o.classList.add("form-row"),n.append(o);let r=document.createElement("div");r.classList.add("col-md-6"),o.append(r);let d=document.createElement("label");d.for="inputName",d.textContent="Name",r.append(d);let l=document.createElement("input");l.type="text",l.name="name",l.classList.add("form-control"),l.id="inputName",l.placeholder="Enter product name",l.required=!0,r.append(l);let i=document.createElement("div");i.classList.add("col-md-6"),i.style.setProperty("text-align","center"),o.append(i);let s=document.createElement("label");s.for="inputImageRow",s.textContent="Image",i.append(s);let c=document.createElement("div");c.classList.add("row","justify-content-center"),c.id="inputImageRow",i.append(c);let m=document.createElement("label");m.for="inputImage",m.id="imageFakeLabel",m.classList.add("btn","btn-outline-primary"),m.textContent="Browse for an image",m.style.setProperty("position","absolute"),m.style.setProperty("bottom","0"),m.style.setProperty("margin","0 0 0 0"),c.append(m);let u=document.createElement("input");u.type="file",u.classList.add("form-control"),u.addEventListener("change",(e=>{sessionStorage.setItem("imageUploaded","true")})),u.id="inputImage",u.name="image",u.required=!0,u.hidden=!0,m.append(u);let p=document.createElement("div");p.classList.add("form-group"),t.append(p);let f=document.createElement("label");f.for="inputDate",f.textContent="Date",p.append(f);let E=document.createElement("input");E.type="date",E.name="date",E.classList.add("form-control"),E.id="inputDate",E.required=!0,p.append(E);let g=document.createElement("label");g.for="inputQuestion0",g.textContent="Questions",t.append(g);let h=document.createElement("div");t.append(h),h.classList.add("form-group"),h.id="questionFormGroup";let y=document.createElement("input");y.type="text",y.name="Question0",y.classList.add("form-control","question"),l.id="inputQuestion0",y.placeholder="Question",y.required=!0,h.append(y);let b=document.createElement("button");b.classList.add("btn","btn-outline-primary"),b.addEventListener("click",(t=>{t.preventDefault(),e()})),b.id="addQuestionButton",b.textContent="Add Question",b.style.setProperty("margin-right","10px"),t.append(b);let v=document.createElement("button");return v.classList.add("btn","btn-outline-success"),v.type="submit",v.textContent="Create!",v.addEventListener("click",(e=>{null!==sessionStorage.getItem("imageUploaded")||a("Error","Please upload an image")})),t.append(v),$("#addQuestionButton").on("click",e),t})();break;case"inspection":u=(()=>{let e=document.createElement("div");e.classList.add("row");let t=document.createElement("div");t.classList.add("col-md-8","col-table-8");let n=document.createElement("div");n.classList.add("col-md-4"),n.classList.add("col-search");let s=document.createElement("table");s.classList.add("table","table-borderless"),e.append(t),e.append(n);let c=null;n.append(o("/GamifyUser/admin/getQuestionnaire?mode=1&date=",(e=>{p(e.questionnaireId)}),(()=>a("No result","Got nothing on that date.")))),n.append(r("/GamifyUser/admin/getQuestionnaire?mode=2&name=",(e=>{c=e,n.append(i(e))}),(()=>a("Error","Error")),(e=>{for(const t of c)if(t.name===e)return void p(t.questionnaireId)}))),t.append(s);let m=document.createElement("thead");m.classList.add("thead"),s.append(m);let u=document.createElement("tr"),f=document.createElement("th");f.textContent="Date ↓";let E=document.createElement("th");E.textContent="Product ";let g=document.createElement("th");g.textContent="Detail",m.append(u),u.append(f),u.append(E),u.append(g);let h=document.createElement("tbody");s.append(h);let y=null;$.getJSON("/GamifyUser/admin/listQuestionnaires?start=0&size=100",(function(e){y=e,$.each(e,(function(e,t){let n=document.createElement("tr");n.setAttribute("data-table-id",t.questionnaireId);let a=document.createElement("td");a.textContent=t.datetime.slice(0,12).replaceAll(",",""),n.append(a),a=document.createElement("td"),a.textContent=t.name,n.append(a),a=document.createElement("td");let o=document.createElement("button");o.classList.add("btn","btn-outline-primary"),o.addEventListener("click",(e=>{p(t.questionnaireId)}));let r=document.createElement("i");r.classList.add("fas","fa-newspaper"),r.textContent=" Open",r.style.setProperty("font-weight","lighter"),o.append(r),a.append(o),n.append(a),h.append(n)}))}));let b=!1,v=!1,L=d.DATE;return f.onclick=()=>{L=l(d.DATE,f,[E],L,b,y,h),b=!b},E.onclick=()=>{L=l(d.NAME,E,[f],L,v,y,h),v=!v},e})();break;case"deletion":u=(()=>{const e=e=>{$.ajax({url:"/GamifyUser/admin/delete?id="+e.questionnaireId,success:function(e){a("Success!","Questionnaire deleted correctly",[()=>location.reload()])},error:function(e,t,n){a("Error",e.responseText)}})};let t=document.createElement("div");t.classList.add("row");let n=document.createElement("div");n.classList.add("col-md-8","col-table-8-red");let s=document.createElement("div");s.classList.add("col-md-4"),s.classList.add("col-search");let c=document.createElement("table");c.classList.add("table","table-borderless"),t.append(n),t.append(s);let m=null;s.append(o("/GamifyUser/admin/getQuestionnaire?mode=3&date=",(t=>{e(t)}),(()=>a("No result","Got nothing on that date.")))),s.append(r("/GamifyUser/admin/getQuestionnaire?mode=4&name=",(e=>{m=e,s.append(i(e))}),(()=>a("Error","Error")),(t=>{for(const n of m)if(n.name===t)return void e(n)}))),n.append(c);let u=document.createElement("thead");u.classList.add("thead"),c.append(u);let p=document.createElement("tr"),f=document.createElement("th");f.textContent="Date ↓";let E=document.createElement("th");E.textContent="Product ";let g=document.createElement("th");g.textContent="Detail",u.append(p),p.append(f),p.append(E),p.append(g);let h=document.createElement("tbody");c.append(h);let y=null;$.getJSON("/GamifyUser/admin/listQuestionnaires?start=0&size=100&past=true",(function(t){y=t,$.each(t,(function(t,n){let a=document.createElement("tr");a.setAttribute("data-table-id",n.questionnaireId);let o=document.createElement("td");o.textContent=n.datetime.slice(0,12).replaceAll(",",""),a.append(o),o=document.createElement("td"),o.textContent=n.name,a.append(o),o=document.createElement("td");let r=document.createElement("button");r.classList.add("btn","btn-outline-danger");let d=document.createElement("i");r.addEventListener("click",(()=>e(n))),d.style.setProperty("font-weight","lighter"),d.classList.add("fas","fa-newspaper"),d.textContent=" Delete",r.append(d),o.append(r),a.append(o),h.append(a)}))}));let b=!1,v=!1,L=d.DATE;return f.onclick=()=>{L=l(d.DATE,f,[E],L,b,y,h),b=!b},E.onclick=()=>{L=l(d.NAME,E,[f],L,v,y,h),v=!v},t})();break;case"logout":window.location.pathname="/GamifyUser/LogOut";break;case"inspectionUserList":u=(e=>{const t="/GamifyUser/admin/listQuestionnaireCompletedUsers?start=0&size=100&id="+e,a="/GamifyUser/admin/listQuestionnaireCanceledUsers?start=0&size=100&id="+e;let o=document.createElement("div");o.classList.add("row"),o.id="mainRow",o.name=e;let r=document.createElement("div");r.classList.add("col-md-3");let d=document.createElement("ul");d.classList.add("list-group"),d.id="completedUsersList";let l=document.createElement("div");l.classList.add("col-md-3");let i=document.createElement("ul");i.classList.add("list-group"),i.id="canceledUsersList";let s=document.createElement("div");s.classList.add("col-md-6"),s.id="answersColumn";let c=document.createElement("h3");c.style.setProperty("text-align","center"),c.style.setProperty("margin-bottom","20px"),c.textContent="Completed";let m=document.createElement("h3");m.style.setProperty("text-align","center"),m.style.setProperty("margin-bottom","20px"),m.textContent="Canceled";let u=document.createElement("h3");return u.style.setProperty("text-align","center"),u.style.setProperty("margin-bottom","20px"),u.textContent="Answers",r.append(c),l.append(m),r.append(d),l.append(i),s.append(u),o.append(r),o.append(l),o.append(s),$.getJSON(t,(function(e){let t=document.getElementById("completedUsersList");t.classList.add("optional-answers-scrollable"),$.each(e,(function(e,n){let a=document.createElement("li");a.classList.add("list-group-item"),a.textContent=n.username,a.id=n.userId,t.append(a)})),n.e(832).then(n.bind(n,434)).then((e=>{e.default()}))})),$.getJSON(a,(function(e){let t=document.getElementById("canceledUsersList");t.classList.add("optional-answers-scrollable"),$.each(e,(function(e,n){let a=document.createElement("li");a.classList.add("list-group-item","canceled-users"),a.textContent=n.username,a.id=n.userId,t.append(a)}))})),o})(t);break;default:return}let f=document.createElement("div");f.classList.add("container","container-admin"),"creation"===e&&f.style.setProperty("overflow","auto"),f.id="mainContainer",f.append(u),f.classList.add("fade-in"),f.addEventListener("animationend",(e=>{f.classList.remove("fade-in")})),document.body.insertAdjacentElement("afterbegin",f),s=$(f)},u=(e,t=700)=>{$("body").fadeOut(t,(function(){document.getElementById("darkModeCSSLink").setAttribute("href","dark"===e?"css/dark-admin.css":""),$(this).fadeIn(t)}))};!function(){const e=Array.from(document.getElementsByClassName("sidenav-button"));document.addEventListener("mousedown",(t=>{let n=t.target;e.includes(n)&&(t.preventDefault(),m(n.id))}));const t=document.getElementById("gamifyLogo");if(null===localStorage.getItem("protipOpened")){let e=document.createElement("label");e.setAttribute("for","sidenav"),e.textContent="↓ ~try clicking here!~ ↓",e.classList.add("protip-div"),document.body.insertAdjacentElement("afterbegin",e)}const n=()=>localStorage.getItem("theme")||"light";"dark"===n()&&u("dark",0),t.addEventListener("click",(e=>{let t="light"===n()?"dark":"light";u(t),localStorage.setItem("theme",t),null===localStorage.getItem("protipOpened")&&(localStorage.setItem("protipOpened","true"),document.getElementsByClassName("protip-div")[0].remove())})),m("creation",null),$(document).on("submit","form",(function(e){e.preventDefault();let t=new Date($(this)[0][2].value),n=new Date;if(n.setHours(0,0,0,0),null==t||t<n)return void a("Error","Time travel doesn't exist yet, so please try entering a date that's not in the past.");if(null===sessionStorage.getItem("imageUploaded"))return void a("Error","Please upload an image");let o=new FormData($(this)[0]);$.ajax({method:"POST",url:"/GamifyUser/admin/create",data:o,processData:!1,contentType:!1,timeout:2e4,success:function(e){e.redirect?window.location.href=e.redirect:a("Success","Congrats! The questionnaire has been submitted successfully.")},error:function(e,t,n){a("Error",e.responseText)}})}))}();const p=e=>{m("inspectionUserList",e)}}},n={};function a(e){if(n[e])return n[e].exports;var o=n[e]={exports:{}};return t[e](o,o.exports,a),o.exports}a.m=t,a.d=(e,t)=>{for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},a.f={},a.e=e=>Promise.all(Object.keys(a.f).reduce(((t,n)=>(a.f[n](e,t),t)),[])),a.u=e=>"./inspectionUserPage.admin-78ec7e81e81c4c925317.js",a.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},a.l=(t,n,o)=>{if(e[t])e[t].push(n);else{var r,d;if(void 0!==o)for(var l=document.getElementsByTagName("script"),i=0;i<l.length;i++){var s=l[i];if(s.getAttribute("src")==t){r=s;break}}r||(d=!0,(r=document.createElement("script")).charset="utf-8",r.timeout=120,a.nc&&r.setAttribute("nonce",a.nc),r.src=t),e[t]=[n];var c=(n,a)=>{r.onerror=r.onload=null,clearTimeout(m);var o=e[t];if(delete e[t],r.parentNode&&r.parentNode.removeChild(r),o&&o.forEach((e=>e(a))),n)return n(a)},m=setTimeout(c.bind(null,void 0,{type:"timeout",target:r}),12e4);r.onerror=c.bind(null,r.onerror),r.onload=c.bind(null,r.onload),d&&document.head.appendChild(r)}},a.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;a.g.importScripts&&(e=a.g.location+"");var t=a.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");n.length&&(e=n[n.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),a.p=e})(),(()=>{var e={179:0};a.f.j=(t,n)=>{var o=a.o(e,t)?e[t]:void 0;if(0!==o)if(o)n.push(o[2]);else{var r=new Promise(((n,a)=>{o=e[t]=[n,a]}));n.push(o[2]=r);var d=a.p+a.u(t),l=new Error;a.l(d,(n=>{if(a.o(e,t)&&(0!==(o=e[t])&&(e[t]=void 0),o)){var r=n&&("load"===n.type?"missing":n.type),d=n&&n.target&&n.target.src;l.message="Loading chunk "+t+" failed.\n("+r+": "+d+")",l.name="ChunkLoadError",l.type=r,l.request=d,o[1](l)}}),"chunk-"+t)}};var t=(t,n)=>{for(var o,r,[d,l,i]=n,s=0,c=[];s<d.length;s++)r=d[s],a.o(e,r)&&e[r]&&c.push(e[r][0]),e[r]=0;for(o in l)a.o(l,o)&&(a.m[o]=l[o]);for(i&&i(a),t&&t(n);c.length;)c.shift()()},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})(),a(632)})();