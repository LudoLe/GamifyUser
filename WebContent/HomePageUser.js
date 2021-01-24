/**
 * 
 */
(function() { // avoid variables ending up in the global scope
    // page components
    var productFrame, leaderBoardFrame, questionnaireFrame, logout, homeButton, questionnaireButton, leaderBoardButton, mainFrame;

    orchestrator = new PageOrchestrator();



 

    
    function SwitchButton(_switch, state) {
        var switchbutton = _switch;   
        var  left = document.getElementsByClassName("leftsidecontent")[0];  
        left.innerHtml="";
        content = document.getElementById("switchbuttoncontent");  
        content.textContent="SHOW QUESTIONNAIRE"
        

        switchbutton.addEventListener("click", (e) => {
     	if(state){         
                  content = document.getElementById("switchbuttoncontent");  
                  content.textContent="SHOW QUESTIONNAIRE"
     		      leaderBoardFrame.call();
     		      state=0;
     		      }
        		else{
        			 content = document.getElementById("switchbuttoncontent");  
                     content.textContent="SHOW LEADERBOARD"
                     questionnaireFrame.call();
                     state=1;
                     }    	
        }, false);
        
    }

   

    function Logout(_button) {
       _button.addEventListener("click", (e) => {
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
    }, false);

    /************************************************BEGIN PRODUCT***************************************************************** */
    function ProductFrame(_frame) {
        this.frame = _frame;
        var self = this;
        
        this.call = function() {
            var self = this;
            makeCall("GET", "GetProduct", null,
                function(req) {
                    if (req.readyState == 4) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            self.show(JSON.parse(req.responseText));
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                }
            );
        }


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
               /* var button = document.createElement("button");
                button.setAttribute("open", "0");
                button.setAttribute("class", "btn");
                button.setAttribute('id', questionnaire.questionnaireId);
                //set the icon
                var fafas = document.createElement("i");
                fafas.setAttribute("class", "fas fa-comments");
                button.appendChild(fafas);*/

                //retrieve the div dedicated to the product visualition and fills it with the newly created elements        

                self.frame.appendChild(figure);
            }
        }
    }


       /* this.registerEvents = function(element) {

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
        */


 function CommentsFrame(_frame){
	 this.frame = _frame;
     var self = this;
	 
	 

     this.call = function() {
         var self = this;
         makeCall("GET", "GetComments", null,
             function(req) {
                 if (req.readyState == 4) {
                     var message = req.responseText;
                     if (req.status == 200) {
                         self.updateCommentSection(JSON.parse(req.responseText));
                     } else {
                         self.alert.textContent = message;
                     }
                 }
             }
         );
     }




     this.updateCommentSection = function(array) {
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

         self.frame.appendChild(ul);

     }
	 
 }

    
    /************************************************END PRODUCT***************************************************************** */




    /************************************************BEGIN QUESTIONNAIRE***************************************************************** */

    function QuestionnaireFrame(_frame) {
        this.frame = _frame;
        var self = this;
        
        this.call = function() {
            var self = this;
            makeCall("GET", "GetQuestionnaire", null,
                function(req) {
                    if (req.readyState == 4) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            self.show(JSON.parse(req.responseText));
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                }
            );
        }

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
                    itemDiv.setAttribute("class", "questionscontainer");
                    label = document.createElement("label");
                    label.setAttribute("class", "questioncontent");
                    label.textContent = question.content;
                    input = document.createElement("input");
                   // input.setAttribute("placeholder", "Insert Here Your Answer");
                    input.setAttribute("id", question.id);
                    input.setAttribute("class", "questioninput");
                    input.required = "required";
                    input.name = "answer" + count;
                    itemDiv.appendChild(label);
                    itemDiv.appendChild(document.createElement("br"));
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
                itemDiv0autofill.setAttribute("class", "box");

                sex = document.createElement("label");
                sex.setAttribute("class", "sexlabel");
                sex.textContent = "sex:";

                sex_x = document.createElement("input");
                sex_x.name = "sex";
                sex_y = document.createElement("input");
                sex_y.name = "sex";

                sex_x.setAttribute("type", "radio");
                sex_x.setAttribute("value", "male");
                sex_xl = document.createElement("label");
                sex_xl.textContent = "Male";
                itemx_sex = document.createElement("div");
                itemx_sex.setAttribute("class", "sexitem");
                itemx_sex.appendChild(sex_x);
                itemx_sex.appendChild(sex_xl);

                sex_y.setAttribute("type", "radio");
                sex_y.setAttribute("value", "female");
                sex_yl = document.createElement("label");
                sex_yl.textContent = "Female";
                itemy_sex = document.createElement("div");
                itemy_sex.setAttribute("class", "sexitem");
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
                itemDiv0autofill.appendChild(document.createElement("br"));
                itemDiv0autofill.appendChild(itemx_sex);
                itemDiv0autofill.appendChild(document.createElement("br"));
                itemDiv0autofill.appendChild(itemy_sex);
                //allow sex access
                var can_access_sex, can_access_sex_label;

                itemDiv0 = document.createElement("div");
                itemDiv0.setAttribute("class", "access");

                can_access_sex = document.createElement("input");
                can_access_sex.setAttribute("type", "checkbox");
                can_access_sex.setAttribute("id", "can_access_sex_checkbox");
                can_access_sex.name = "can_access_sex";

                can_access_sex_label = document.createElement("label");
                can_access_sex_label.setAttribute("for", "can_access_sex_checkbox");
                can_access_sex_label.innerHTML = "I allow access to my sex";

                itemDiv0autofill.appendChild(document.createElement("br"));
                itemDiv0.appendChild(can_access_sex);
                itemDiv0.appendChild(can_access_sex_label);
                itemDiv0autofill.appendChild(itemDiv0);
                //age

                var age;
                itemDiv1autofill = document.createElement("div");
                itemDiv1autofill.setAttribute("class", "box");

                age = document.createElement("label");
                age.setAttribute("class", "agelabel")
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

                
                //allow age access
                var can_access_age, can_access_age_label;

                itemDiv1 = document.createElement("div");
                itemDiv1.setAttribute("class", "ageaccess");

                can_access_age = document.createElement("input");
                can_access_age.setAttribute("type", "checkbox");
                can_access_age.setAttribute("id", "can_access_age_checkbox");
                can_access_age.name = "can_access_age";


                can_access_age_label = document.createElement("label");
                can_access_age_label.setAttribute("for", "can_access_age_checkbox");
                can_access_age_label.innerHTML = "I allow access to my age";
                
               
                itemDiv1.appendChild(can_access_age);
                itemDiv1.appendChild(can_access_age_label);
                
                itemDiv1autofill.appendChild(age);
                itemDiv1autofill.appendChild(document.createElement("br"));
                itemDiv1autofill.appendChild(birth);
                itemDiv1autofill.appendChild(document.createElement("br"));
                itemDiv1autofill.appendChild(itemDiv1);
                
                
                //expertise
                var input2, expertise;
                //be replaced with radiobuttons
                itemDiv2 = document.createElement("div");
                itemDiv2.setAttribute("class", "box");

                expertise = document.createElement("label");
                expertise.setAttribute("class","expertiselabel");

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
                itemx.setAttribute("class", "expertiseitem");
                itemx.appendChild(x);
                itemx.appendChild(xl);

                y.setAttribute("type", "radio");
                y.setAttribute("value", "medium");
                yl = document.createElement("label");
                yl.textContent = "medium";
                itemy = document.createElement("div");
                itemy.setAttribute("class", "expertiseitem");
                itemy.appendChild(y);
                itemy.appendChild(yl);

                z.setAttribute("type", "radio");
                z.setAttribute("value", "high");
                zl = document.createElement("label");
                zl.textContent = "high";
                itemz = document.createElement("div");
                itemz.setAttribute("class", "expertiseitem");
                itemz.appendChild(z);
                itemz.appendChild(zl);

                itemDiv2.appendChild(expertise);
                itemDiv2.appendChild(itemx);
                itemDiv2.appendChild(itemy);
                itemDiv2.appendChild(itemz);
                
                
                fieldset.setAttribute("class", "questionnairefieldset");

                fieldset.appendChild(itemDiv0autofill);
                
                fieldset.appendChild(document.createElement("br"));

                fieldset.appendChild(itemDiv1autofill);
                
                fieldset.appendChild(document.createElement("br"));

                fieldset.appendChild(itemDiv2);

                fieldset.appendChild(document.createElement("br"));

                //here we create the buttons   
                var buttonsDiv = document.createElement("div");
                
                //this button gets you back to the product section
               
                
                //this button makes you submit your answers 
                
                buttonDiv1 = document.createElement("div");
                buttonDiv1.setAttribute("class", "button");
                var button1 = document.createElement("span");
                button1.textContent = "Cancel";
                buttonDiv1.appendChild(button1);
                
                buttonDiv2 = document.createElement("div");
                buttonDiv2.setAttribute("class", "button");
                var button2 = document.createElement("span");
                button2.textContent = "Submit";
                buttonDiv2.appendChild(button2);

                var errormessage = document.createElement("p");
                errormessage.setAttribute("id", "errormessage");
                fieldset.appendChild(errormessage);
                fieldset.appendChild(document.createElement("br"));

                //this button makes you clear your answers
                resetDiv = document.createElement("div");
                resetDiv.setAttribute("class", "button");
                var reset = document.createElement("input");
                reset.setAttribute("class", "reset-Button");
                reset.type = "reset";
                reset.value = "clean";
                reset.required = "required";

                resetDiv.appendChild(reset);

                buttonsDiv.appendChild(resetDiv);
                buttonsDiv.appendChild(buttonDiv1);

                buttonsDiv.appendChild(buttonDiv2);
                document.getElementById("formContainer").appendChild(buttonsDiv);

                self.registerEventCancel(buttonDiv1);
                self.registerEventSubmit(buttonDiv2);
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
                if (window.confirm("Are you sure you want to cancel the questionnaire?")) {
                    makeCall("Get", "RecordLog", null,
                        function(req) {
                            if (req.readyState == 4) {
                                var message = req.responseText;
                                if (req.status == 200) {
                                	let e= new Event("click");
                                	(document.getElementById("switchbutton")).dispatchEvent(e);
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
        this.frame = _frame;
        var self = this;
        
        
        this.call = function() {
            var self = this;
            makeCall("GET", "GetLeaderBoard", null,
                function(req) {
                    if (req.readyState == 4) {
                        var message = req.responseText;
                        if (req.status == 200) {
                            self.show(JSON.parse(req.responseText));
                        } else {
                            self.alert.textContent = message;
                        }
                    }
                }
            );
        }

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
    function MainFrame(_mainpage) {



        this.mainpage = _mainpage;
        var self = this;
        this.alertContainer = document.getElementById("id_alert");
        
        this.create = function() {
      
                   logout = new Logout(document.getElementById("logoutbutton"));
                   messagecontainer = document.getElementsByClassName("messagecontainer")[0];


                    switchButton = new SwitchButton(document.getElementById("switchbutton"), 0);

        	
                    productFrame = new ProductFrame(document.getElementsByClassName("productframe")[0]);
                    productFrame.call();
                
                    
                    //commentsFrame = new CommentsFrame(document.getElementsByClassName("commentsframe")[0]);
                    //commentsFrame.call();

               
                    questionnaireFrame = new QuestionnaireFrame(document.getElementsByClassName("leftsidecontent")[0]);
                    
                    leaderBoardFrame = new LeaderBoardFrame(document.getElementsByClassName("leftsidecontent")[0]);
                    leaderBoardFrame.call();


                   
                  /*  leaderBoardFrame = new LeaderBoardFrame(document.getElementsByClassName("mainContent"));
                    url = "GetLeaderboard";
                    break;
                    */

            }
        
    }


    var state = 0;

    function PageOrchestrator() {

        this.start = function() {


            //messaggio di welcome back
            /*personalMessage = new PersonalMessage(sessionStorage.getItem('username'),  document.getElementById("id_username"));
            personalMessage.show();*/

            //struttura principale
            mainFrame = new MainFrame(document.getElementsByClassName("mainpage")[0]);
            mainFrame.create();
           

            //directory coi bottoni
           // questionnaireButton = new QuestionnaireButton(state);
           // leaderBoardButton = new LeaderBoardButton(state);

           // homeButton = new HomeButton(state);
        
        }

    }

   
})()