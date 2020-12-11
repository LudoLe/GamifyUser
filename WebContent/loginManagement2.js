/**
 * Login management
 */

(function() { // avoid variables ending up in the global scope

  document.getElementById("loginbutton").addEventListener('click', (e) => {
    var form = e.target.closest("form");
    if (form.checkValidity()) {
      makeCall("POST", 'CheckLogin', e.target.closest("form"),
        function(req) {
          if (req.readyState == XMLHttpRequest.DONE) {
            var message = req.responseText;
            switch (req.status) {
              case 200:
            	sessionStorage.setItem('username', message);
                window.location.href = "HomePage.html";
                break;
              case 400: // bad request
                document.getElementById("errormessage").textContent = message;
                break;
              case 401: // unauthorized
                  document.getElementById("errormessage").textContent = message;
                  break;
              case 500: // server error
            	document.getElementById("errormessage").textContent = message;
                break;
            }
          }
        }
      );
    } else {
    	 form.reportValidity();
    }
  });
  
  
  var token=1;
   document.getElementById("signin").addEventListener("click",(e) => {
	if(token){
	  var div, form, fieldset, input, input2, input2, label3, label, label2, action, mex;
	  div=document.createElement("div"); 
	  div.setAttribute("class", "container");
	  form=document.getElementById("form"); 
	  form.appendChild(div);
	  field=document.createElement("fieldset"); 
	  
	  div.appendChild(field);
	  mex= document.createElement("p");
	  mex.setAttribute("id","errormessage2");

	  div2=document.createElement("div"); 
	  div2.setAttribute("class", "item");
	  div3=document.createElement("div"); 
	  div3.setAttribute("class", "item");
	  div4=document.createElement("div"); 
	  div4.setAttribute("class", "item");
	  
	  label=document.createElement("label");
	  
	  label2=document.createElement("label");
	  
	  label3=document.createElement("label");

	  

	 
	  label.textContent="Email";
	  label2.textContent="Password";
	  label3.textContent="Confirm Password";

	  	  
	  input=document.createElement("input");
	  input.setAttribute("placeholder","Enter Username");
	  input.setAttribute("id","user2");
	  input.setAttribute("type", "email");
	  input.required="required";
	  input.name="user2";
	  div2.appendChild(input);

	  
	 



	  input2=document.createElement("input");
	  input2.setAttribute("placeholder","Enter a Password");
	  input2.setAttribute("id","pass2");
	  input2.setAttribute("type", "password");
	  input2.required="required";
	  input2.name="pass2";
	  div3.appendChild(input2);

	  
	  
	  input3=document.createElement("input");
	  input3.setAttribute("placeholder","Enter a Password");
	  input3.setAttribute("id","pass3");
	  input3.setAttribute("type", "password");
	  input3.required="required";
	  input3.name="pass3";
	  div4.appendChild(input3);

	 



	  field.appendChild(label);
	  field.appendChild(div2);
	  field.appendChild(document.createElement("br"));
	  field.appendChild(label2);
	  field.appendChild(div3);
	  field.appendChild(document.createElement("br"));

	  field.appendChild(label3);
	  field.appendChild(div4);
	  
	  div5=document.createElement("div"); 
	  div5.setAttribute("class", "item");
	  
	  
	  var button=document.createElement("button");
	  button.textContent="Done";
	  div5.appendChild(button);

	  
	  var errormessage=document.createElement("p");
	  errormessage.setAttribute("id","errormessage2");
	  field.appendChild(errormessage);
	  field.appendChild(document.createElement("br"));
	  field.appendChild(div5);
	 
	  button.addEventListener("click",(e) => {
		  
		 
		 e.preventDefault();
		  e.stopPropagation();
		  
		  
		  var form = e.target.closest("form");
		  var password2 = document.getElementById("pass2");
		  var password3 = document.getElementById("pass3");
		  
		  if(password2.value === password3.value){ var ok = 1;}
		  else{ var ok= 0;}

		  if(ok){
		    if (form.checkValidity()) {
		      makeCall("POST", 'CheckSignUp',form,
		        function(req) {
		          if (req.readyState == XMLHttpRequest.DONE) {
		            var message = req.responseText;
		            switch (req.status) {
		              case 200:
		            	sessionStorage.setItem('username', message);
		                window.location.href = "HomePage.html";
		                break;
		              case 400: // bad request
		                document.getElementById("errormessage2").textContent = message;
		                break;
		              case 401: // unauthorized
		                  document.getElementById("errormessage2").textContent = message;
		                  break;
		              case 500: // server error
		            	document.getElementById("errormessage2").textContent = message;
		                break;
		            }
		          }
		        }
		      );
		     
		    } else {
		    	 form.reportValidity();
		    }
		  }else{
          	document.getElementById("errormessage2").textContent = "passwords don't match";

		  }
	
		  
	  }, false);
	  token=0;  
	}
	 
	else{
		 
		  form=document.getElementById("form");
		  kids=Array.from(form.children);
		  kids.forEach(function(kid){
			  form.removeChild(kid);
		  });
		  token=1;

		}	
  }, false);


	  
  

})();