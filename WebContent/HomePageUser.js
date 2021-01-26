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
        left.innerHTML="";
        content = document.getElementById("switchbuttoncontent");  
        content.textContent="SHOW QUESTIONNAIRE"
        

        switchbutton.addEventListener("click", (e) => {
     	if(state){         
                  content = document.getElementById("switchbuttoncontent");  
                  message = document.getElementById("questionnairemessage");  
                  $('#questionnairemessage').css('border','none').css('padding','none');
                  $('#questionnairemessage').css('display', 'none');


                  var  left = document.getElementsByClassName("leftsidecontent")[0];  
                  left.innerHTML="";
                  message.innerHTML="";

                  
                  content.textContent="SHOW QUESTIONNAIRE"
     		      leaderBoardFrame.call();
     		      state=0;
     		      }
        		else{
        			 content = document.getElementById("switchbuttoncontent");
        			 message = document.getElementById("leaderboardmessage"); 
                     $('#leaderboardmessage').css('border','none').css('padding','none');
                     $('#leaderboardmessage').css('display', 'none');


        			 var  left = document.getElementsByClassName("leftsidecontent")[0];  
        		     left.innerHTML="";
        			
                     message.innerHTML="";
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
                        if (req.status == 200) {
                            self.show(JSON.parse(req.responseText));
                        } 
                    }
                }
            );
        }


        this.show = function(questionnaire) {

            if (questionnaire == null) {
                var self = this;
                var container = document.getElementById("productmessage");
                container.innerHtml="";
                $('#productmessage').css('border','5px solid white').css('padding','10px');

                var alert = document.createElement("span");
                alert.textContent = "No product published today yet!";
                container.appendChild(alert);
               
            } else {
                var self = this;
                // build the span with product name and the product image
                var span = document.createElement("span");
                span.setAttribute("id", "productspan");

                span.textContent = questionnaire.name
                var i = document.createElement("IMG");


                i.setAttribute("src", "uploads/campaignImages?name=" + questionnaire.image);
                i.setAttribute("id", "productimage");

                i.setAttribute("width", "250");
                i.setAttribute("height", "200");
                i.setAttribute("alt", questionnaire.name);
                
                span.style.border='5px solid white';
                span.style.padding=' 1vh 2vw';
                
                i.style.border='5px solid white';
                i.style.padding=' 1vh 2vw';
                i.style.objectfit = 'cover';

                self.frame.appendChild(span);
                self.frame.appendChild(document.createElement("br"));
                self.frame.appendChild(i);
                
                commentsFrame.call();
                leaderBoardFrame.call();

            }
        }
    }


  

 function CommentsFrame(_frame){
	 this.frame = _frame;
     var self = this;
	 
	 

     this.call = function() {
         var self = this;
         makeCall("GET", "GetComments", null,
             function(req) {
                 if (req.readyState == 4) {
                     if (req.status == 200) {
                         self.updateCommentSection(JSON.parse(req.responseText));
                     } 
                 }
             }
         );
         self.updateCommentSection(null);

     }




     this.updateCommentSection = function(array) {
    	 
    	 if(array == null) {
    		 	
    		 
         	var self = this;
            var container = document.getElementById("commentsmessage");
            container.innerHtml="";
            $('#commentsmessage').css('border','5px solid white').css('padding','10px');

            var alert = document.createElement("span");
            alert.textContent = "no comments on this product yet!";
            container.appendChild(alert);
    	 }
    	 else {
    		 var self = this;
             var l = array.length, ul, element, commentV;
             ul = document.createElement("ul");
             //ul.setAttribute("id", "s" + target.id);
             if (l = !0) {

				array.forEach(function(review) { // self visible here, not this
					console.log(review);
					
					var containerReview = document.createElement("div");
					var user = document.createElement("li");
					user.innerHTML = "User: "+review["user"]["username"];
					
					containerReview.appendChild(user);
					
					review["answers"].forEach(function(answer){
						var quest = document.createElement("div");
						quest.innerHTML = answer["question"]["content"];
						containerReview.appendChild(quest);
						var ans = document.createElement("div");
						ans.innerHTML = answer["content"];
						containerReview.appendChild(ans);
					});
					
					/*
                     element = document.createElement("li");
                     commentV = document.createElement("i");
                     commentV.textContent = comment.content;
                     commentV.setAttribute("class", "comments");
                     element.appendChild(commentV);
                     commentV.setAttribute('id', comment.id);
                     ul.appendChild(element);
					*/
					ul.appendChild(containerReview);
                 });
             }
			
             self.frame.appendChild(ul);
    	 }
         

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
                        if (req.status == 200) {
                            self.show(JSON.parse(req.responseText));
                        } 
                    }
                }
            );
        }

        this.show = function(response) {
            if (response.questions == null) {
            	var self = this;
                var container = document.getElementById("questionnairemessage");
                container.innerHtml="";
                $('#questionnairemessage').css('border','5px solid white').css('padding','10px');
                $('#questionnairemessage').css('display', 'block');


                var alert = document.createElement("span");
                alert.textContent = "no questionnaire today :(!";
                container.appendChild(alert);
               
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
                    input.setAttribute("placeholder", "Insert Here Your Answer");
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

                var buttonsDiv = document.createElement("div");
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
                                if (req.status == 200) {
                                	let e= new Event("click");
                                	(document.getElementById("switchbutton")).dispatchEvent(e);
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
                    form= element.closest("form");
                if (form.checkValidity()) {
                
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
                                    form.reportValidity();
                                }
                            }
                        }
                    );

                } else {
                   
                    form.reportValidity();
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
            self.show(null);
            makeCall("GET", "GetLeaderboard", null,
                function(req) {
                    if (req.readyState == 4) {
                        if (req.status == 200) {
                            self.show(JSON.parse(req.responseText));
                        } 
                    }
                }
            );
        }

        this.show = function(players) {
        	console.log("ok "+players);
            if (players == null) {
            	var self = this;
                var container = document.getElementById("leaderboardmessage");
               // container.innerHtml="";
               // $('#leaderboardmessage').css('border','5px solid white').css('padding','10px');
               // $('#leaderboardmessage').css('display', 'block');
                var alert = document.createElement("span");
                //alert.textContent = "Nothing to display1!";
				console.log("nothing");
                container.appendChild(alert);

				console.log("noth "+container.innerHtml);
            } else {
                var self = this;
                //container that contains the the 
                containerDiv = document.createElement("div");
                containerDiv.setAttribute("class", "container");
                containerDiv.setAttribute("id", "formContainer");


				var table = document.createElement("table");
				var th = document.createElement("th");
				
				var tdUser = document.createElement("td");
				tdUser.innerHTML = "Username";
				
				var tdPoints = document.createElement("td");
				tdPoints.innerHTML = "Points";
				th.appendChild(tdUser);
				th.appendChild(tdPoints);
				table.appendChild(th);
				containerDiv.appendChild(table);
                var cont = 0;
                players.usernames.forEach(function(username) { // self visible here, not this
					console.log(username)
                    //each question (item)is contained in a div
                    itemDiv = document.createElement("div");
                    itemDiv.setAttribute("class", "item");
					var tr = document.createElement("tr");
									
					var tdUser = document.createElement("td");
					tdUser.innerHTML = username;
					
					var tdPoints = document.createElement("td");
					tdPoints.innerHTML = players.points[cont];
					
					tr.appendChild(tdUser);
					tr.appendChild(tdPoints);
					table.appendChild(tr);
					
                    cont +=1;
                });
				self.frame.appendChild(containerDiv);
				
				var container = document.getElementById("leaderboardmessage");
				
				container.innerHtml="";
            }

        }


    }

    /************************************************END LEADERBOARDFRAME***************************************************************** */


    
    


    //this is the "MAINFRAME" function, it gets access to the whole page 
    //and initializes the components 
    //only the productFrame component is called in order to create itself
    function MainFrame(_mainpage) {
       
    	this.mainpage = _mainpage;
  
        this.create = function() {
                    logout = new Logout(document.getElementById("logoutbutton"));
                    messagecontainer = document.getElementsByClassName("messagecontainer")[0];
                    switchButton = new SwitchButton(document.getElementById("switchbutton"), 0);	
                    productFrame = new ProductFrame(document.getElementsByClassName("productframe")[0]);
                    commentsFrame = new CommentsFrame(document.getElementsByClassName("commentsframe")[0]);
                    questionnaireFrame = new QuestionnaireFrame(document.getElementsByClassName("leftsidecontent")[0]);
                    leaderBoardFrame = new LeaderBoardFrame(document.getElementsByClassName("leftsidecontent")[0]);
                    productFrame.call();             
            }
        
    }

    //this is the "PAGEORCHESTRATO" function, it gets access to the whole page 
    //it initializes the mainframe 
    //which is then able to create itself
    function PageOrchestrator() {
        this.start = function() {
            mainFrame = new MainFrame(document.getElementsByClassName("mainpage")[0]);
            mainFrame.create();    
        }

    }

   
})()