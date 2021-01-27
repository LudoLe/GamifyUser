package gamifyUser.controllers;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import polimi.db2.gamifyDB.entities.Review;
import polimi.db2.gamifyDB.entities.User;
import polimi.db2.gamifyDB.services.*;

@WebServlet("/CheckSubmit")
@MultipartConfig
public class CheckSubmit extends HttpServlet{
	private static final long serialVersionUID = 123211111L;
	@EJB(name = "gamifyDB.services/ReviewService")
	private ReviewService reviewService;
	@EJB(name = "gamifyDB.services/QuestionnaireService")
	private QuestionnaireService questionnaireService;

		public CheckSubmit() {
			super();
		}

		public void init(){
		}
		
		public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
			
			//check if user already submitted 
			List<Review> reviews=null;
		    User user=null;;
		    Questionnaire questionnaire= null;
		    
		    try{
		    	user=(User) request.getSession().getAttribute("user");
			   	
		   	} catch(Exception e) {
		   		response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.setContentType("text/plain"); 
				response.getWriter().println("Something went poof server-side. Please try again.( we couldnt find the user!)");
				return;
		   	}
	    
		   	try{
		    	questionnaire=questionnaireService.findByDate(new Date());
			   	
		   	} catch(Exception e) {
		   		response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.setContentType("text/plain"); 
				response.getWriter().println("Something went poof server-side. Please try again.( we couldnt find the user!)");
				return;
		   	}
		    try {
		   		if(reviewService.checkIfAlreadySubmitted(user, questionnaire)) {
		   			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
					response.setContentType("text/plain"); 
					response.getWriter().println("You've already submitted today's questionnaire. Come back tomorrow!");
					return;
			   	}
		   	} catch(Exception e) {
		   		response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.setContentType("text/plain"); 
				response.getWriter().println("Something went poof server-side. Please try again.");
				return;
		   	}

      }
		public void destroy() {
		}
}
		