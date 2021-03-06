package gamifyUser.controllers;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.persistence.Column;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.StringEscapeUtils;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import gamifyUser.utility.Utility;
import polimi.db2.gamifyDB.entities.Answer;
import polimi.db2.gamifyDB.entities.Question;
import polimi.db2.gamifyDB.entities.Questionnaire;
import polimi.db2.gamifyDB.entities.Review;
import polimi.db2.gamifyDB.entities.User;
import polimi.db2.gamifyDB.entities.Log;

import polimi.db2.gamifyDB.services.AnswerService;
import polimi.db2.gamifyDB.services.LogService;
import polimi.db2.gamifyDB.services.QuestionService;
import polimi.db2.gamifyDB.services.QuestionnaireService;
import polimi.db2.gamifyDB.services.ReviewService;
import polimi.db2.gamifyDB.services.UserService;

@WebServlet("/RecordLog")
@MultipartConfig
public class RecordLog extends HttpServlet{
	private static final long serialVersionUID = 123211111L;
	@EJB(name = "gamifyDB.services/AnswerService")
	private AnswerService answerService;
	@EJB(name = "gamifyDB.services/ReviewService")
	private ReviewService reviewService;
	@EJB(name = "gamifyDB.services/QuestionnaireService")
	private QuestionnaireService questionnaireService;
	@EJB(name = "gamifyDB.services/QuestionService")
	private QuestionService questionService;
	@EJB(name = "gamifyDB.services/LogService")
	private LogService logService;
	@EJB(name = "gamifyDB.services/UserService")
	private UserService userService;
	

	/* devo:
	 * 1. registrare il log del cancel
	 */
	public RecordLog() {
		super();
	}
	
	public void init(){}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("log");
		Log log;
		Questionnaire questionnaire=null;	
		User user=null;
		Date date = null;
		
		try{ 
			  user= (User)request.getSession().getAttribute("user");
			  date= (Date)request.getSession().getAttribute("log");
	   }catch(Exception e){
			response.getWriter().println("Not possible to retrieve the user in the session.");
			return;
	   }
		
		try{ 
			questionnaire=questionnaireService.findByDate(new Date());
	   }catch(Exception e){
			response.getWriter().println("Not possible to retrieve the questionnaire of today.");
			return;
	
	   }
		if((questionnaire==null)||(user==null)){
			response.getWriter().println("Something went wrong.");
			return;
		}
		/* check whether the user has already submitted today's questionnaire */
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


		try {
			log=logService.createLog(questionnaire, user, date);
			if(log == null) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.setContentType("text/plain"); 
				response.getWriter().println("Something went poof server-side. Please try again.");
				return;
			}
		} catch (Exception e1) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.setContentType("text/plain"); 
			response.getWriter().println("Something went poof server-side. Please try again.");
			return;
		}
		
		
		response.setStatus(HttpServletResponse.SC_OK);
		return;
	      

	}


	
	public void destroy() {
	}
}
