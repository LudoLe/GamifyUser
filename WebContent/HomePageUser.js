/**
 * 
 */(function() { // avoid variables ending up in the global scope
// page components
    var productFrame, leaderBoardFrame, questionnaireFrame, logout, homeButton, questionnaireButton, leaderBoardButton, mainFrame;

    orchestrator = new PageOrchestrator(); 
   


 function PersonalMessage(_username, messagecontainer) {
	    this.username = _username;
	    this.show = function() {
	      messagecontainer.textContent = this.username;
	    }
 } 


 function HomeButton(){
	 var home = document.getElementById("home");
	 home.addEventListener("click", (e)=>{	
 	 orchestrator.refresh(0); 
   }, false);
  
	 }

function QuestionnaireButton(){
	 var questionnaire = document.getElementById("questionnaireButton");
	 questionnaire.addEventListener("click", (e)=>{	
	           	   orchestrator.refresh(1); 
 }, false);
	 }

function LeaderBoardButton(){
	 var home = document.getElementById("leaderBoardButton");
	 home.addEventListener("click", (e)=>{	
	 orchestrator.refresh(2); 
 }, false);
	 }
 
 function Logout(){
	 var button = document.getElementById("logout");
	 button.addEventListener("click", (e)=>{
		 makeCall("GET", "LogOut", null,
			        function(req){
	          if (req.readyState == 4) {
	            var message = req.responseText;
	            if (req.status == 200){
	                window.location.href = "index.html";
	            } else {
		          var alertContainer = document.getElementById("id_alert");
	              self.alert.textContent = message;
	            }
	          }
	        }
	      );
		 
		 
	 }, false )
 }
 
  window.addEventListener("load", () => {
	   orchestrator.start(); 
	   orchestrator.refresh(0); // initialize the components
	  }, false); 
  

/************************************************BEGIN PRODUCT***************************************************************** */
  function ProductFrame(_frame){
	      this.frame=_frame;
	   var self = this;
 
	  
  this.show= function(questionnaire){
	 
        var prod=document.getElementById("productFrameImage")

		if(questionnaire==null){
			  var self=this;
		    	      var alert= document.createElement("p");
			          alert.textContent = "Nothing to display!";	
			          item= document.createElement("div");
			          item.setAttribute("class", "se");
				      item.appendChild(alert);
				      self.frame.appendChild(item);
		}
		   else{
	      var self = this;
	        // build the figure with the product image and product image
	          var figure = document.createElement("FIGURE");
	          figure.textContent= questionnaire.name
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
              button.setAttribute("open","0");
			  button.setAttribute("class","btn");
	          button.setAttribute('id', questionnaire.questionnaireId); 
             //set the icon
			  var fafas=document.createElement("i");
			  fafas.setAttribute("class","fas fa-comments");
	          button.appendChild(fafas);

             //retrieve the div dedicated to the product visualition and fills it with the newly created elements		

	          self.frame.appendChild(figure);	
	          self.frame.appendChild(button);	
	          self.registerEvents(button); 
             }
	      }       
	  

	  
	  this.registerEvents= function(element){
		  
		  let token =0;
	 	    
	    element.addEventListener("click", (e) => {	 
	    	 e.stopPropagation();
	    	  if(token ===0){
	    			self.showComments(e.target);
	 		     	token=1;
				}
		    	else{ 	 
		         element.removeChild(ul);
		         token=0;
		    	} 
 			}, false);	  
	  }

   
	
	  
	  this.showComments = function(target){
			 var self = this;
			 questionnaireId=target.id;
			  makeCall("GET", "GetComments?questionnaireId="+questionnaireId, null,
				        function(req) {
				          if (req.readyState == 4) {
				            var message = req.responseText;
				            if (req.status == 200) {
				             self.updateCommentSection(JSON.parse(req.responseText),target); 
				            } else {
				              self.alert.textContent = message;
				            }
				          }
				        }
				      );
		  }	  




this.updateCommentSection= function(array, target){
          var self=this;
		  var l = arrayComment.length,
		  ul, element, commentV;
		  ul = document.createElement("ul");
	      ul.setAttribute("id", "s"+target.id);
	      if (l =! 0) {
	      
	          array.forEach(function(comment) { // self visible here, not this
	          element = document.createElement("li");	          
	          commentV = document.createElement("i");
	          commentV.textContent= comment.content;
	          commentV.setAttribute("class","comments");
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

  function QuestionnaireFrame(_frame){
	    this.frame=_frame;
	    var self = this;
  
this.show= function(questions){
	if(questions==null){
		 var self=this;
		 var alert= document.createElement("p");
		 alert.textContent = "Nothing to display!";	
		 item= document.createElement("div");
		 item.setAttribute("class", "container");
		 item.appendChild(alert);
		 self.frame.appendChild(item);
		}else{
		var self=this;
        //container that contains the form fields
        containerDiv=document.createElement("div"); 
		containerDiv.setAttribute("class", "container");
		containerDiv.setAttribute("id", "formContainer");
		form=document.createElement("FORM"); 		
		form.appendChild(containerDiv);
		//the fieldset of the questions
		fieldset=document.createElement("fieldset"); 
		fieldset.setAttribute("id", "questionsForm");
		//the fieldset of the statistics
	    fieldset2=document.createElement("fieldset"); 
	    fieldset2.setAttribute("id", "statsForm");
	    
		self.frame.appendChild(form);
	    //first container which contains the just the fieldset
		fieldsetQuestionsDiv=document.createElement("div"); 
		fieldsetQuestionsDiv.setAttribute("class", "container");
		fieldsetQuestionsDiv.setAttribute("id", "fieldsetQuestionsDiv");
		fieldsetQuestionsDiv.appendChild(fieldset);
		//second container that contains the stats fieldset
		fieldsetStatsDiv=document.createElement("div"); 
		fieldsetStatsDiv.setAttribute("class", "container");
		fieldsetStatsDiv.setAttribute("id", "fieldsetStatsDiv");
		fieldsetStatsDiv.appendChild(fieldset2);
		//we append both of the fieldset at the main container
		containerDiv.appendChild(fieldsetQuestionsDiv);
		containerDiv.appendChild(fieldsetStatsDiv);
		count=0;
        // for each question create label + input
		questions.forEach(function(question) { // self visible here, not this
	  			  var input, label, mex;
                  //each question (item)is contained in a div
				  itemDiv=document.createElement("div"); 
				  itemDiv.setAttribute("class", "item");	  		  
				  label=document.createElement("label");
			      label.textContent=question.content;
				  input=document.createElement("input");
				  input.setAttribute("placeholder","Insert Here Your Answer");
				  input.setAttribute("id", question.id);
				  input.required="required";
				  input.name="answer"+count;  
		          itemDiv.appendChild(label);
				  itemDiv.appendChild(input);
		          //add each question in the field set
		          fieldset.appendChild(itemDiv);
	              fieldset.appendChild(document.createElement("br")); 
	              count++;
	        });
    
     //button to show the stats container
     //everytime, this button calls a servlet that checks if the user has already
     //entered data about sex age etc, if so,
     // a pop up shows up asking for permission to autofill the data
	 //a button with "allow/not allow" there will be always there
	 //
	  buttonDiv=document.createElement("div"); 
	  buttonDiv.setAttribute("class", "item");
	  var button=document.createElement("button");
	  button.textContent="Show To Stats Section";
	  buttonDiv.appendChild(button);  
	  //
	  var errormessage=document.createElement("p");
	  errormessage.setAttribute("id","errormessage");
	  //
	  fieldset.appendChild(errormessage);
	  fieldset.appendChild(document.createElement("br"));
	  fieldsetStatsDiv.appendChild(buttonDiv);
	  //
      self.registerEvents(button);
  }

}	      

var user;

this.registerEvents=function(element){    
		//TODO servlet that checks if age etc already insterted if so
	    element.addEventListener("click", (e) => {	 	    	
	    	 e.stopPropagation();
	         element.parentNode.removeChild(element);
	         self.showStatiticsForm();
	         self.waitAlreadyIn();
	
 			}, false);	    
  }
  
this.waitAlreadyIn=function(){
	
	
	makeCall("Get", "AutoFill", null,
		        function(req){
        if (req.readyState == 4) {
          var alreadyIn=0;
          var message = req.responseText;
          if (req.status == 200){
		        user = JSON.parse(req.responseText); 
				if((user.sex!=null)||(user.birth!=null)){	
					alreadyIn=1;
				}
          } else {
	          var alertContainer = document.getElementById("id_alert");
              self.alert.textContent = message;
              
          }
        }
        if(alreadyIn){
	         if(window.confirm("Can we autofill the stats with your data sweetie? Let us in <3\n")){
	 			  self.autoFill();
	 		  }}
         });
	
	
}
  
this.autoFill=function(){
		var sex=user.sex;
		var age=user.birth;
	    var d = new Date(age)


		if(sex!=null){
			switch(sex){
			case "female": document.getElementById("female").checked="true";
    		break; 
			case "male":document.getElementById("male").checked="true";
    		break; 
			case "prefer not to tell":document.getElementById("prefer not to tell").checked="true";
    		break; 

			} 
		}
		if(age!=null){
			 month = '' + (d.getMonth() + 1),
				        day = '' + d.getDate(),
				        year = d.getFullYear();

				    if (month.length < 2) 
				        month = '0' + month;
				    if (day.length < 2) 
				        day = '0' + day;

		    var date=[year, month, day].join('-');
			document.getElementById('age').value=date;
		
		}
			
			 
		}
	
	
  
  
this.showStatiticsForm= function(array, target){
   fieldset=document.getElementById("statsForm") 
	
    
	buttonDiv=document.createElement("div"); 
	buttonDiv.setAttribute("class", "item");
	var autofill=document.createElement("button");
	autofill.textContent="autofill";
	buttonDiv.appendChild(autofill);  
	fieldset.appendChild(buttonDiv);
	
		   
   var input, sex;
   //we have three fields
   //sex
	itemDiv0=document.createElement("div"); 
	itemDiv0.setAttribute("class", "item");	 
	
	sex=document.createElement("label");
    sex.textContent="select your sex";
    
    w=document.createElement("input");
	w.name="sex";  
    k=document.createElement("input");
	k.name="sex";  
    s=document.createElement("input");
	s.name="sex";  
    
    w.setAttribute("type", "radio");
    w.setAttribute("value", "female");
    w.setAttribute("id", "female");
    wl=document.createElement("label");
    wl.textContent="female";
    itemw=document.createElement("div"); 
    itemw.setAttribute("class", "item");
    itemw.appendChild(w);
    itemw.appendChild(wl);
    
    k.setAttribute("type", "radio");
    k.setAttribute("value", "male");
    kl=document.createElement("label");
    k.setAttribute("id", "male");
    kl.textContent="female";
    itemk=document.createElement("div"); 
    itemk.setAttribute("class", "item");
    itemk.appendChild(k);
    itemk.appendChild(kl);

    s.setAttribute("type", "radio");
    s.setAttribute("value", "prefer not to tell");
    s.setAttribute("id", "prefer not to tell");
    sl=document.createElement("label");
    sl.textContent="prefer not to tell";
    items=document.createElement("div"); 
    items.setAttribute("class", "item");
    items.appendChild(s);
    items.appendChild(sl);
 
    itemDiv0.appendChild(sex);
    itemDiv0.appendChild(itemw);
    itemDiv0.appendChild(itemk);
    itemDiv0.appendChild(items);
   
    //age
	var input, age;
	
    itemDiv1=document.createElement("div"); 
    itemDiv1.setAttribute("class", "item");	  
 
    age=document.createElement("label");
    age.textContent="age";

    input=document.createElement("input");
    input.setAttribute("type", "date");
    input.setAttribute("id", "age");
    input.max="2010-12-31";
    input.min="1930-12-31";
    input.name="age";

    itemDiv1.appendChild(age);
    itemDiv1.appendChild(input);

    //expertise
    var input2, expertise;
    //be replaced with radiobuttons
    itemDiv2=document.createElement("div"); 
    itemDiv2.setAttribute("class", "item");	  
  
    expertise=document.createElement("label");
    expertise.textContent="expertise";
    
    x=document.createElement("input");
	x.name="expertise";  
    y=document.createElement("input");
	y.name="expertise";  
    z=document.createElement("input");
	z.name="expertise";  
    
    x.setAttribute("type", "radio");
    x.setAttribute("value", "low");
    xl=document.createElement("label");
    xl.textContent="low";
    itemx=document.createElement("div"); 
    itemx.setAttribute("class", "item");
    itemx.appendChild(x);
    itemx.appendChild(xl);
    
    y.setAttribute("type", "radio");
    y.setAttribute("value", "medium");
    yl=document.createElement("label");
    yl.textContent="medium";
    itemy=document.createElement("div"); 
    itemy.setAttribute("class", "item");
    itemy.appendChild(y);
    itemy.appendChild(yl);

    z.setAttribute("type", "radio");
    z.setAttribute("value", "high");
    zl=document.createElement("label");
    zl.textContent="high";
    itemz=document.createElement("div"); 
    itemz.setAttribute("class", "item");
    itemz.appendChild(z);
    itemz.appendChild(zl);
 
    itemDiv2.appendChild(expertise);
    itemDiv2.appendChild(itemx);
    itemDiv2.appendChild(itemy);
    itemDiv2.appendChild(itemz);
    
    fieldset.appendChild(itemDiv0);
    fieldset.appendChild(itemDiv1);
    fieldset.appendChild(itemDiv2);
    
    fieldset.appendChild(document.createElement("br"));
    
    //here we create the buttons   
    var buttonsDiv=document.createElement("div"); 
    //this button gets you back to the product section
    buttonDiv1=document.createElement("div"); 
    buttonDiv1.setAttribute("class", "item");
    var button1=document.createElement("button");
    button1.textContent="back to product";
    buttonDiv1.appendChild(button1);
    //this button makes you submit your answers 
    buttonDiv2=document.createElement("div"); 
    buttonDiv2.setAttribute("class", "item");
    var button2=document.createElement("button");
    button2.textContent="Sumbit";
    buttonDiv2.appendChild(button2);

    var errormessage=document.createElement("p");
    errormessage.setAttribute("id","errormessage");
    fieldset.appendChild(errormessage); 
    fieldset.appendChild(document.createElement("br"));
   
    //this button makes you clear your answers
    var reset=document.createElement("input");
    reset.type="reset";
    reset.value="clean";
    reset.required="required";
 
    buttonsDiv.appendChild(reset);
    buttonsDiv.appendChild(buttonDiv1);
    buttonsDiv.appendChild(buttonDiv2);
    document.getElementById("formContainer").appendChild(buttonsDiv);

    reset=document.createElement("input");
    
 
    self.registerEventCancel(button1);
    self.registerEventSubmit(button2);
    self.registerAutoFill(autofill);
         
	  }

//on click, reaload the product page
this.registerAutoFill=function(element){
token=0;
element.addEventListener("click", (e) => {	 
	    	 e.stopPropagation();
	    	if(!token) {
		         document.getElementById("male").checked=false;
		         document.getElementById("female").checked=false;
		         document.getElementById("prefer not to tell").checked=false;
		         document.getElementById("age").value="yyyy-mm-dd";
		         token=1;
		         }
	    	else{
	    		self.autoFill();
	    		token=0;
	    	}

			}, false);	  
	  }

//on click, reaload the product page
this.registerEventCancel=function(element){
element.addEventListener("click", (e) => {	 
	    	 e.stopPropagation();
	     	 orchestrator.refresh(0); 
  			}, false);	  
	  }
	  

//on click submit the questionnaire and display a "Thanks for having submitted the questionnaire ^^"
this.registerEventSubmit=function(element){
if(element.closest("form").checkValidity()){
	element.addEventListener("click", (e) => {	 
	    	 e.stopPropagation();
	    	    makeCall("POST", "SubmitQuestionnaire", e.target.closest("form"),
			        function(req){
	    	
	          if (req.readyState == 4) {
	            var message = req.responseText;
	            if (req.status == 200){
			        self.update(JSON.parse(req.responseText),state); 
	            } else {
		          var alertContainer = document.getElementById("id_alert");
	              self.alert.textContent = message;
	            }
	          }
	    	    }
	        
	      );	 
	    	 
 			}, false);	}  
	  }
	  




 }  


  
	 


/************************************************END QUESTIONNAIRE***************************************************************** */


/************************************************BEGIN LEADERBOARDFRAME***************************************************************** */

 function LeaderBoardFrame(_frame){
	    this.frame=_frame;
	   var self = this;
}

/************************************************END LEADERBOARDFRAME***************************************************************** */





//Questa funzione gestisce tutta la pagina in generale (tramite il page orchestrator), ha una lista degli stati in cui
//può trovarsi la pagina e a seconda dei parametri che le vengono passati nelle varie fnuzioni costruisce
//il giusto template
function MainFrame(_framecontainer){



      productFrame = new ProductFrame(document.getElementById("productFrame"));
	  questionnaireFrame = new QuestionnaireFrame(document.getElementById("questionnaireFrame"));
	  leaderBoardFrame = new LeaderBoardFrame(document.getElementById("leaderBoardFrame"));
 
	  this.frameContainer = _framecontainer;
	  var self=this;
	  this.alertContainer = document.getElementById("id_alert");

	  
	 this.show = function(state){
		 var url;
		 var self=this;
	 
		 switch(state){
	    	case 0: url="GetProduct";
	    		break; 
	    	case 1: url="GetQuestionnaire";
	    		break;
	    	case 2: url="GetLeaderBoard";
	    		break;
	    	
		 }
		  makeCall("GET", url, null,
			        function(req) {
			          if (req.readyState == 4) {
			            var message = req.responseText;
			            if (req.status == 200) {
			              self.update(JSON.parse(req.responseText),state); 
			            } else {
			            	
			              self.alertContainer.textContent = message;
			            }
			          }
			        }
			      );
	  
	 }
	 
	 
	 this.update= function(array,state){
		 
	
	
	switch(state){
	    	case 0: 
                     document.getElementById("id_alert").innerHTML="";

					 document.getElementById("productFrame").innerHTML = "";
					 document.getElementById("questionnaireFrame").innerHTML = "";
					 document.getElementById("leaderBoardFrame").innerHTML = "";
				     productFrame.show(array)

			    break; 
	    	case 1: 
                    
                    document.getElementById("id_alert").innerHTML="";

					 document.getElementById("questionnaireFrame").innerHTML = "";
					 document.getElementById("productFrame").innerHTML = "";
					 document.getElementById("leaderBoardFrame").innerHTML = "";
					 questionnaireFrame.show(array);
					

	    		break;
	    	case 2: 
                      
                    document.getElementById("id_alert").innerHTML="";

					 document.getElementById("productFrame").innerHTML = "";
					 document.getElementById("questionnaireFrame").innerHTML = "";
					 document.getElementById("leaderBoardFrame").innerHTML = "";
					 leaderBoardFrame.show(array);
			           
	    		break;	         
		 }
			 
		 }

	  } 	


var state=0;

 function PageOrchestrator(){
	 
	    this.start = function(){
		    
           
	    	//messaggio di welcome back
			personalMessage = new PersonalMessage(sessionStorage.getItem('username'),  document.getElementById("id_username"));
	        personalMessage.show();

	       //struttura principale
	        mainFrame=new MainFrame(document.getElementById("mainFrame"));

		  //directory coi bottoni
           questionnaireButton= new QuestionnaireButton(state);
           leaderBoardButton= new LeaderBoardButton(state);

		   homeButton=new HomeButton(state);
	       logout= new Logout();
        }
	    
	    
	        this.refresh = function(state){
	    	mainFrame.show(state);
	    
	
	     }
 }
  
  	   

})()