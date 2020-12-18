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
	          figure.setAttribute('id', questionnaire.id);
			  var i = document.createElement("IMG");
			 
			  
      		  i.setAttribute("src", questionnaire.image);
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
			          item.setAttribute("class", "se");
				      item.appendChild(alert);
				      self.frame.appendChild(item);
		}else{
	 
        var prod=document.getElementById("questionnaireFrame")

        //first container which contains the whole internal part of the form
        containerDiv=document.createElement("div"); 
		containerDiv.setAttribute("class", "container");
		form=document.createElement("FORM"); 
		prod.appendChild(form);
		form.appendChild(containerDiv);
		fieldset=document.createElement("fieldset"); 
	
	    //first container which contains the just the fieldset
		fieldsetDiv=document.createElement("div"); 
		fieldsetDiv.setAttribute("class", "container");
		fieldsetDiv.appendChild(fieldset);
	
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
				  input.name="question";
				  
		          itemDiv.appendChild(label);
				  itemDiv.appendChild(input);
		
		          //add each question in the field set
		          fieldset.appendChild(itemDiv);
	              fieldset.appendChild(document.createElement("br"));
	    
	        });
    
      buttonDiv=document.createElement("div"); 
	  buttonDiv.setAttribute("class", "item");
	 
	  var button=document.createElement("button");
	  button.textContent="Go To Stats Section";
	  buttonDiv.appendChild(button);

	  
	  var errormessage=document.createElement("p");
	  errormessage.setAttribute("id","errormessage");
	  fieldset.appendChild(errormessage);
	  fieldset.appendChild(document.createElement("br"));
	  fieldsetDiv.appendChild(buttonDiv);
      
      self.registerEvents(button);
}

	      }

  this.registerEvents= function(element){
		  
		  var token =0;
	 	    
	    element.addEventListener("click", (e) => {	 
	    	 e.stopPropagation();
	    	  if(token===0){
	    			self.showStats(e.target);
	 		     	token=1;
				}
		    	else{ 	 
		         element.removeChild(ul);
		         token=0;
		    	} 
 			}, false);	  
	  }


 this.showStats = function(target){
			 var self = this;
			 questionnaireId=target.id;
			  makeCall("GET", "GetStats?questionnaireId="+questionnaireId, null,
				        function(req) {
				          if (req.readyState == 4) {
				            var message = req.responseText;
				            if (req.status == 200) {
				             self.showStaticsForm(JSON.parse(req.responseText),target); 
				            } else {
				              self.alert.textContent = message;
				            }
				          }
				        }
				      );
		  }	  

this.showStatiticsForm= function(array, target){
         
         var self=this;
		 var container=target.parentNode;

        //first container which contains the whole internal part of the form
        containerDiv=document.createElement("div"); 
		containerDiv.setAttribute("class", "container");
		form=document.createElement("FORM"); 
		prod.appendChild(form);
		form.appendChild(containerDiv);
		fieldset=document.createElement("fieldset"); 
	
	    //first container which contains the just the fieldset
		fieldsetDiv=document.createElement("div"); 
		fieldsetDiv.setAttribute("class", "container");
		fieldsetDiv.appendChild(fieldset);
	
        // for each question create label + input
		 // self visible here, not this
		
 
	  			  var input, age;

                  //each question (item)is contained in a div
				  itemDiv0=document.createElement("div"); 
				  itemDiv0.setAttribute("class", "item");	  
				  
				  age=document.createElement("label");
				  age.setAttribute("for", "age");
			      age.textContent="Age";
					
				  options=document.createElement("select");
						  option1=document.createElement("option");
						  option1.responseText("Female");
						  option1.value="Female";
						  option1.setAttribute("id", "age")


 						  option2=document.createElement("option");
						  option2.responseText("Male");
						  option2.value="Male";
						  option2.setAttribute("id", "age")


				          option3=document.createElement("option");
						  option3.responseText("Prefer not to tell");
				          option3.value="PreferNotToTell";
						  option3.setAttribute("id", "age")
				
				          options.addChild(option1);
						  options.addChild(option2);
						  options.addChild(option3);

		          itemDiv0.appendChild(age);
				  itemDiv0.appendChild(options);
		          
   				var input, sex;

                  //each question (item)is contained in a div
				  itemDiv1=document.createElement("div"); 
				  itemDiv1.setAttribute("class", "item");	  
				  
				  sex=document.createElement("label");
			      sex.textContent="sex";
		        
				  input=document.createElement("input");
				  input.setAttribute("placeholder","Insert Here Your Answer");
				  input.setAttribute("id", "sexInput");
				  input.required="required";
				  input.name="question";
		
				  
		            itemDiv1.appendChild(sex);
				    itemDiv1.appendChild(input);
		
		          var input2, expertise;

                  //each question (item)is contained in a div
				  itemDiv2=document.createElement("div"); 
				  itemDiv2.setAttribute("class", "item");	  
				  
				  expertise=document.createElement("label");
			      expertise.textContent="expertise"
				 
				  input2=document.createElement("input");
				  input2.setAttribute("placeholder","Insert Here Your Expertise Level");
				  input2.setAttribute("id", "expertiseInput");

				  input2.name="question";
	
				  
		          itemDiv2.appendChild(age);
				  itemDiv2.appendChild(input);
		
		
				
		
		          //add each question in the field set
		          fieldset.appendChild(itemDiv2);
	              fieldset.appendChild(document.createElement("br"));


				
           
	      
	  container.appendChild(form);

      var buttonsDiv=document.createElement("div"); 
	  
       buttonDiv.setAttribute("class", "container");
       buttonDiv.setAttribute("id", "buttonsStatContainer");

      buttonDiv=document.createElement("div"); 
	  buttonDiv.setAttribute("class", "item");
	  var button=document.createElement("button");
	  button.textContent="Back";
	  buttonDiv.appendChild(button);
     
      buttonDiv1=document.createElement("div"); 
	  buttonDiv1.setAttribute("class", "item");
	  var button1=document.createElement("button");
	  button1.textContent="Cancel";
	  buttonDiv1.appendChild(button);

      buttonDiv2=document.createElement("div"); 
	  buttonDiv2.setAttribute("class", "item");
	  var button2=document.createElement("button");
	  button2.textContent="Sumbit";
	  buttonDiv2.appendChild(button);

	  
	  var errormessage=document.createElement("p");
	  errormessage.setAttribute("id","errormessage");
	  fieldset.appendChild(errormessage);
	  
      fieldset.appendChild(document.createElement("br"));
	  
      buttonsDiv.appendChild(buttonDiv);
      buttonsDiv.appendChild(buttonDiv1);
      buttonsDiv.appendChild(buttonDiv2);

      fieldsetDiv.appendChild(buttonsDiv);
      


      
      self.registerEvents(button);


	         
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