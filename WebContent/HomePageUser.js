/**
 * 
 */
(function() { // avoid variables ending up in the global scope
    // page components
    var productFrame, leaderBoardFrame, questionnaireFrame, logout, homeButton, questionnaireButton, leaderBoardButton, mainFrame;

    orchestrator = new PageOrchestrator();



    function PersonalMessage(_username, messagecontainer) {
        this.username = _username;
        this.show = function() {
            messagecontainer.textContent = this.username;
        }
    }


    function HomeButton() {
        var home = document.getElementById("home");
        home.addEventListener("click", (e) => {
            orchestrator.refresh(0);
        }, false);

    }

    function QuestionnaireButton() {
        var questionnaire = document.getElementById("questionnaireButton");
        questionnaire.addEventListener("click", (e) => {
            orchestrator.refresh(1);
        }, false);
    }

    function LeaderBoardButton() {
        var home = document.getElementById("leaderBoardButton");
        home.addEventListener("click", (e) => {
            orchestrator.refresh(2);
        }, false);
    }

    function Logout() {
        var button = document.getElementById("logout");
        button.addEventListener("click", (e) => {
            makeCall("GET", "LogOut", null,
                function(req) {
                    if (req.readyState == 4) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            window.location.href = "index.html";
                        } else {
                            var alertContainer = document.getElementById("id_alert");
                            self.alert.textContent = message;
                        }
                    }
                }
            );


        }, false)
    }

    window.addEventListener("load", () => {
        orchestrator.start();
        orchestrator.refresh(0); // initialize the components
    }, false);

    /************************************************BEGIN PRODUCT***************************************************************** */
    function ProductFrame(_frame) {
        this.frame = _frame[0];
        var self = this;


        this.show = function(questionnaire) {

            if (questionnaire == null) {
                var self = this;
                var alert = document.createElement("p");
                alert.textContent = "Nothing to display!";
                item = document.createElement("div");
                item.setAttribute("class", "se");
                item.appendChild(alert);
                self.frame.appendChild(item);
            } else {
                var self = this;
                // build the figure with the product image and product image
                var figure = document.createElement("FIGURE");
                figure.textContent = questionnaire.name
                figure.setAttribute('id', questionnaire.questionnaireId);
                var i = document.createElement("IMG");


                i.setAttribute("src", "uploads/campaignImages/" + questionnaire.image);
                i.setAttribute("width", "250");
                i.setAttribute("height", "200");
                i.setAttribute("alt", questionnaire.name);
                figure.appendChild(i);

                //  var c = document.createElement("FIGCAPTION");
                //  var t = document.createTextNode(questionnaire.details);
                //  c.appendChild(t);
                //  figure.appendChild(c);

                // build the the button that, if clicked, make you see the reviews 
                var button = document.createElement("button");
                button.setAttribute("open", "0");
                button.setAttribute("class", "btn");
                button.setAttribute('id', questionnaire.questionnaireId);
                //set the icon
                var fafas = document.createElement("i");
                fafas.setAttribute("class", "fas fa-comments");
                button.appendChild(fafas);

                //retrieve the div dedicated to the product visualition and fills it with the newly created elements        

                self.frame.appendChild(figure);
                self.frame.appendChild(button);
                self.registerEvents(button);
            }
        }



        this.registerEvents = function(element) {

            let token = 0;

            element.addEventListener("click", (e) => {
                e.stopPropagation();
                if (token === 0) {
                    self.showComments(e.target);
                    token = 1;
                } else {
                    element.removeChild(ul);
                    token = 0;
                }
            }, false);
        }




        this.showComments = function(target) {
            var self = this;
            questionnaireId = target.id;
            makeCall("GET", "GetComments?questionnaireId=" + questionnaireId, null,
                function(req) {
                    if (req.readyState == 4) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            self.updateCommentSection(JSON.parse(req.responseText), target);
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                }
            );
        }




        this.updateCommentSection = function(array, target) {
            var self = this;
            var l = arrayComment.length,
                ul, element, commentV;
            ul = document.createElement("ul");
            ul.setAttribute("id", "s" + target.id);
            if (l = !0) {

                array.forEach(function(comment) { // self visible here, not this
                    element = document.createElement("li");
                    commentV = document.createElement("i");
                    commentV.textContent = comment.content;
                    commentV.setAttribute("class", "comments");
                    element.appendChild(commentV);
                    commentV.setAttribute('id', comment.id);
                    ul.appendChild(element);

                });
            }

            target.appendChild(ul);


        }
    }
    /************************************************END PRODUCT***************************************************************** */




    /************************************************BEGIN QUESTIONNAIRE***************************************************************** */

    function QuestionnaireFrame(_frame) {
        this.frame = _frame[0];
        var self = this;

        this.show = function(response) {
            if (response.questions == null) {
                var self = this;
                var alert = document.createElement("p");
                alert.textContent = "Nothing to display!";
                item = document.createElement("div");
                item.setAttribute("class", "container");
                item.appendChild(alert);
                self.frame.appendChild(item);
            } else {
                var self = this;
                //container that contains the form fields
                containerDiv = document.createElement("div");
                containerDiv.setAttribute("class", "container");
                containerDiv.setAttribute("id", "formContainer");
                form = document.createElement("FORM");
                form.appendChild(containerDiv);
                //the fieldset of the questions
                fieldset = document.createElement("fieldset");
                fieldset.setAttribute("id", "questionsForm");
                //the fieldset of the statistics
                fieldset2 = document.createElement("fieldset");
                fieldset2.setAttribute("id", "statsForm");

                self.frame.appendChild(form);
                //first container which contains the just the fieldset
                fieldsetQuestionsDiv = document.createElement("div");
                fieldsetQuestionsDiv.setAttribute("class", "container");
                fieldsetQuestionsDiv.setAttribute("id", "fieldsetQuestionsDiv");
                fieldsetQuestionsDiv.appendChild(fieldset);
                //second container that contains the stats fieldset
                fieldsetStatsDiv = document.createElement("div");
                fieldsetStatsDiv.setAttribute("class", "container");
                fieldsetStatsDiv.setAttribute("id", "fieldsetStatsDiv");
                fieldsetStatsDiv.appendChild(fieldset2);
                //we append both of the fieldset at the main container
                containerDiv.appendChild(fieldsetQuestionsDiv);
                containerDiv.appendChild(fieldsetStatsDiv);
                count = 0;
                // for each question create label + input
                response.questions.forEach(function(question) { // self visible here, not this
                    var input, label, mex;
                    //each question (item)is contained in a div
                    itemDiv = document.createElement("div");
                    itemDiv.setAttribute("class", "item");
                    label = document.createElement("label");
                    label.textContent = question.content;
                    input = document.createElement("input");
                    input.setAttribute("placeholder", "Insert Here Your Answer");
                    input.setAttribute("id", question.id);
                    input.required = "required";
                    input.name = "answer" + count;
                    itemDiv.appendChild(label);
                    itemDiv.appendChild(input);
                    //add each question in the field set
                    fieldset.appendChild(itemDiv);
                    fieldset.appendChild(document.createElement("br"));
                    count++;
                });


                 fieldset = document.getElementById("statsForm")

                //sex
                var sex;
                itemDiv0autofill = document.createElement("div");
                itemDiv0autofill.setAttribute("class", "item");

                sex = document.createElement("label");
                sex.textContent = "Sex:";

                sex_x = document.createElement("input");
                sex_x.name = "sex";
                sex_y = document.createElement("input");
                sex_y.name = "sex";

                sex_x.setAttribute("type", "radio");
                sex_x.setAttribute("value", "male");
                sex_xl = document.createElement("label");
                sex_xl.textContent = "Male";
                itemx_sex = document.createElement("div");
                itemx_sex.setAttribute("class", "item");
                itemx_sex.appendChild(sex_x);
                itemx_sex.appendChild(sex_xl);

                sex_y.setAttribute("type", "radio");
                sex_y.setAttribute("value", "female");
                sex_yl = document.createElement("label");
                sex_yl.textContent = "Female";
                itemy_sex = document.createElement("div");
                itemy_sex.setAttribute("class", "item");
                itemy_sex.appendChild(sex_y);
                itemy_sex.appendChild(sex_yl);

                if(response.user.sex != null){
                    //it is set in db
                    if(response.user.sex == "male"){
                        sex_x.checked = true;
                        sex_y.disabled = true;
                    }else {
                        sex_y.checked = true;
                        sex_x.disabled = true;
                    }
                }

                itemDiv0autofill.appendChild(sex);

                itemDiv0autofill.appendChild(itemx_sex);
                itemDiv0autofill.appendChild(itemy_sex);
                //allow sex access
                var can_access_sex, can_access_sex_label;

                itemDiv0 = document.createElement("div");
                itemDiv0.setAttribute("class", "item");

                can_access_sex = document.createElement("input");
                can_access_sex.setAttribute("type", "checkbox");
                can_access_sex.setAttribute("id", "can_access_sex_checkbox");
                can_access_sex.name = "can_access_sex";

                can_access_sex_label = document.createElement("label");
                can_access_sex_label.setAttribute("for", "can_access_sex_checkbox");
                can_access_sex_label.innerHTML = "I allow access to my sex";


                itemDiv0.appendChild(can_access_sex);
                itemDiv0.appendChild(can_access_sex_label);
                //age

                var age;
                itemDiv1autofill = document.createElement("div");
                itemDiv1autofill.setAttribute("class", "item");

                age = document.createElement("label");
                age.textContent = "Date of birth:";

                birth = document.createElement("input");
                birth.setAttribute("type", "date");
                birth.name = "birth";

                if(response.user.birth != null){
                    d = new Date(response.user.birth)
                    month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();

                    if (month.length < 2) 
                        month = '0' + month;
                    if (day.length < 2) 
                        day = '0' + day;

                    var date=[year, month, day].join('-');
                    //it is set in db
                    birth.setAttribute("value", date)
                    birth.readOnly = true;
                }

                itemDiv1autofill.appendChild(age);
                itemDiv1autofill.appendChild(birth);
                //allow age access
                var can_access_age, can_access_age_label;

                itemDiv1 = document.createElement("div");
                itemDiv1.setAttribute("class", "item");

                can_access_age = document.createElement("input");
                can_access_age.setAttribute("type", "checkbox");
                can_access_age.setAttribute("id", "can_access_age_checkbox");
                can_access_age.name = "can_access_age";


                can_access_age_label = document.createElement("label");
                can_access_age_label.setAttribute("for", "can_access_age_checkbox");
                can_access_age_label.innerHTML = "I allow access to my age";

                itemDiv1.appendChild(can_access_age);
                itemDiv1.appendChild(can_access_age_label);
                //expertise
                var input2, expertise;
                //be replaced with radiobuttons
                itemDiv2 = document.createElement("div");
                itemDiv2.setAttribute("class", "item");

                expertise = document.createElement("label");
                expertise.textContent = "expertise";

                x = document.createElement("input");
                x.name = "expertise";
                y = document.createElement("input");
                y.name = "expertise";
                z = document.createElement("input");
                z.name = "expertise";

                x.setAttribute("type", "radio");
                x.setAttribute("value", "low");
                xl = document.createElement("label");
                xl.textContent = "low";
                itemx = document.createElement("div");
                itemx.setAttribute("class", "item");
                itemx.appendChild(x);
                itemx.appendChild(xl);

                y.setAttribute("type", "radio");
                y.setAttribute("value", "medium");
                yl = document.createElement("label");
                yl.textContent = "medium";
                itemy = document.createElement("div");
                itemy.setAttribute("class", "item");
                itemy.appendChild(y);
                itemy.appendChild(yl);

                z.setAttribute("type", "radio");
                z.setAttribute("value", "high");
                zl = document.createElement("label");
                zl.textContent = "high";
                itemz = document.createElement("div");
                itemz.setAttribute("class", "item");
                itemz.appendChild(z);
                itemz.appendChild(zl);

                itemDiv2.appendChild(expertise);
                itemDiv2.appendChild(itemx);
                itemDiv2.appendChild(itemy);
                itemDiv2.appendChild(itemz);

                fieldset.appendChild(itemDiv0autofill);
                fieldset.appendChild(itemDiv0);
                fieldset.appendChild(itemDiv1autofill);
                fieldset.appendChild(itemDiv1);
                fieldset.appendChild(itemDiv2);

                fieldset.appendChild(document.createElement("br"));

                //here we create the buttons   
                var buttonsDiv = document.createElement("div");
                
                //this button gets you back to the product section
                buttonDiv1 = document.createElement("div");
                buttonDiv1.setAttribute("class", "item");
                var button1 = document.createElement("button");
                button1.textContent = "back to product";
                buttonDiv1.appendChild(button1);
                
                //this button makes you submit your answers 
                buttonDiv2 = document.createElement("div");
                buttonDiv2.setAttribute("class", "item");
                var button2 = document.createElement("button");
                button2.textContent = "Submit";
                buttonDiv2.appendChild(button2);

                var errormessage = document.createElement("p");
                errormessage.setAttribute("id", "errormessage");
                fieldset.appendChild(errormessage);
                fieldset.appendChild(document.createElement("br"));

                //this button makes you clear your answers
                var reset = document.createElement("input");
                reset.type = "reset";
                reset.value = "clean";
                reset.required = "required";

                buttonsDiv.appendChild(reset);
                buttonsDiv.appendChild(buttonDiv1);
                buttonsDiv.appendChild(buttonDiv2);
                document.getElementById("formContainer").appendChild(buttonsDiv);

                self.registerEventCancel(button1);
                self.registerEventSubmit(button2);
            }

           

        }

        var user;

        this.registerEvents = function(element) {
            //TODO servlet that checks if age etc already insterted if so
            element.addEventListener("click", (e) => {
                e.stopPropagation();
                element.parentNode.removeChild(element);
            }, false);
        }


        //on click, reaload the product page
        this.registerEventCancel = function(element) {
        
            console.log("cancel");
            element.addEventListener("click", (e) => {
                e.stopPropagation();
                if (window.confirm("Are you sure you want to cancel the questionnaire? You will be redirected to the product")) {
                    makeCall("Get", "RecordLog", null,
                        function(req) {
                            if (req.readyState == 4) {
                                var message = req.responseText;
                                if (req.status == 200) {
                                    orchestrator.refresh(0);
                                } else {
                                    var alertContainer = document.getElementById("id_alert");
                                    self.alert.textContent = message;

                                }
                            }
                        }
                    );
                }
            }, false);
        }


        //on click submit the questionnaire and display a "Thanks for having submitted the questionnaire ^^"
        this.registerEventSubmit = function(element) {
            console.log("invio");
            element.addEventListener("click", (e) => {
                    
                if (element.closest("form").checkValidity()) {
                
                    console.log("invio1");
                    e.stopPropagation();
                    makeCall("POST", "SubmitQuestionnaire", e.target.closest("form"),
                        function(req) {

                            if (req.readyState == 4) {
                                var message = req.responseText;
                                if (req.status == 200) {
                                	//var yourDataStr = JSON.stringify(req.responseText);
                                    //self.update(JSON.parse(yourDataStr), state);
                                    //var alertContainer = document.getElementById("id_alert");
                                    //self.alert.textContent = message;
                                    console.log(message);
                                } else {
                                    //var alertContainer = document.getElementById("id_alert");
                                    //self.alert.textContent = message;
                                    console.log("error: "+message);
                                }
                            }
                        }
                    );

                }
            }, false);
        }

    }




    /************************************************END QUESTIONNAIRE***************************************************************** */


    /************************************************BEGIN LEADERBOARDFRAME***************************************************************** */

    function LeaderBoardFrame(_frame) {
        this.frame = _frame[0];
        var self = this;

        this.show = function(players) {
        	console.log(players);
            if (players == null) {
                var self = this;
                var alert = document.createElement("p");
                alert.textContent = "Nothing to display yet!";
                item = document.createElement("div");
                item.setAttribute("class", "container");
                item.appendChild(alert);
                self.frame.appendChild(item);
            } else {
                var self = this;
                //container that contains the the 
                containerDiv = document.createElement("div");
                containerDiv.setAttribute("class", "container");
                containerDiv.setAttribute("id", "formContainer");

                players.forEach(function(player) { // self visible here, not this
					console.log(player.username)
                    //each question (item)is contained in a div
                    itemDiv = document.createElement("div");
                    itemDiv.setAttribute("class", "item");
                    p = document.createElement("p");
                    p.textContent = player.username + " " +player.points;
                    itemDiv.appendChild(p);
                    containerDiv.appendChild(itemDiv);
                });
				self.frame.appendChild(containerDiv);
            }

        }


    }

    /************************************************END LEADERBOARDFRAME***************************************************************** */




    //Questa funzione gestisce tutta la pagina in generale (tramite il page orchestrator), ha una lista degli stati in cui
    //può trovarsi la pagina e a seconda dei parametri che le vengono passati nelle varie fnuzioni costruisce
    //il giusto template
    function MainFrame(_framecontainer) {



        this.frameContainer = _framecontainer;
        var self = this;
        this.alertContainer = document.getElementById("id_alert");


        this.show = function(state) {
            var url;
            var self = this;

            switch (state) {
                case 0:
                    productFrame = new ProductFrame(document.getElementsByClassName("mainContent"));
                    url = "GetProduct";
                    break;
                case 1:
                    questionnaireFrame = new QuestionnaireFrame(document.getElementsByClassName("mainContent"));
                    url = "GetQuestionnaire";

                    break;
                case 2:
                    leaderBoardFrame = new LeaderBoardFrame(document.getElementsByClassName("mainContent"));
                    url = "GetLeaderboard";
                    break;

            }
            makeCall("GET", url, null,
                function(req) {
                    if (req.readyState == 4) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            self.update(JSON.parse(req.responseText), state);
                        } else {

                            self.alertContainer.textContent = message;
                        }
                    }
                }
            );

        }


        this.update = function(array, state) {



            switch (state) {
                case 0:
                    document.getElementById("id_alert").innerHTML = "";

                    document.getElementsByClassName("mainContent")[0].innerHTML = "";
                    productFrame.show(array)

                    break;
                case 1:

                    document.getElementById("id_alert").innerHTML = "";

                    document.getElementsByClassName("mainContent")[0].innerHTML = "";

                    console.log(array);
                    questionnaireFrame.show(array);

                    break;
                case 2:

                    document.getElementById("id_alert").innerHTML = "";

                    document.getElementsByClassName("mainContent")[0].innerHTML = "";

                    leaderBoardFrame.show(array);

                    break;
            }

        }

    }


    var state = 0;

    function PageOrchestrator() {

        this.start = function() {


            //messaggio di welcome back
            /*personalMessage = new PersonalMessage(sessionStorage.getItem('username'),  document.getElementById("id_username"));
            personalMessage.show();*/

            //struttura principale
            mainFrame = new MainFrame(document.getElementsByClassName("main")[0]);

            //directory coi bottoni
            questionnaireButton = new QuestionnaireButton(state);
            leaderBoardButton = new LeaderBoardButton(state);

            homeButton = new HomeButton(state);
            logout = new Logout();
        }


        this.refresh = function(state) {
            openTab();
            mainFrame.show(state);
            closeTab();



        }

    }

    function closeTab() {
        document.getElementsByClassName("main")[0].style.width = "60vw";
        document.getElementsByClassName("tab")[0].style.right = "-20vw";
        //document.getElementsByClassName("banner")[0].style.right = "20%";
    }

    function openTab() {
        document.getElementsByClassName("main")[0].style.width = "50vw";
        document.getElementsByClassName("tab")[0].style.right = "0vw";
        // document.getElementsByClassName("banner")[0].style.right = "40%";
    }




})()