package gamifyUser.controllers;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.StringEscapeUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import gamifyUser.exceptions.NoBirthException;
import gamifyUser.exceptions.NoSexException;
import polimi.db2.gamifyDB.entities.Answer;
import polimi.db2.gamifyDB.entities.Question;
import polimi.db2.gamifyDB.entities.Questionnaire;
import polimi.db2.gamifyDB.entities.Review;
import polimi.db2.gamifyDB.entities.User;
import polimi.db2.gamifyDB.services.AnswerService;
import polimi.db2.gamifyDB.services.LogService;
import polimi.db2.gamifyDB.services.QuestionService;
import polimi.db2.gamifyDB.services.QuestionnaireService;
import polimi.db2.gamifyDB.services.ReviewService;
import polimi.db2.gamifyDB.services.UserService;

@WebServlet("/SubmitQuestionnaire")
@MultipartConfig
public class SubmitQuestionnaire extends HttpServlet{
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

	public SubmitQuestionnaire() {
		super();
	}
	
	public void init(){}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {	
	
		
		try {
			List<Question> questions=null;
			List<Answer> answers= new ArrayList<Answer>();
			int canAccessAge=0;
			int canAccessSex=0;
			Review review=null;
			Questionnaire questionnaire;
			
			List<Review> reviews=null;
		    User user=null;
		    Boolean bol=false;
		    int submit=0;
		    int userSubmit= user.getUserId();
		  
		   	try{ 
		   		reviews = reviewService.findAllToday();

			   }catch(Exception e){
					response.getWriter().println("Not possible to retrieve the reviews");
			   }

		   	
		   	try{ 
				  user=(User) request.getSession().getAttribute("user");

			   }catch(Exception e){
					response.getWriter().println("Not possible to retrieve the user in the session.");
			   }
					
					

			
		   
	   //controlla che non submitti se gia hai submittato				
	    	for(Review review : reviews){
					submit=review.getUser().getUserId();
					if(submit==userSubmit){
						bol=true;
					}
				}
				if(bol) {
					response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				    response.getWriter().println("Something went wrong");
				}
				
				
			 	try{ 
					String birth_string = (StringEscapeUtils.escapeJava(request.getParameter("birth")));
					String can_age_string = (StringEscapeUtils.escapeJava(request.getParameter("can_access_age")));
					String can_sex_string = (StringEscapeUtils.escapeJava(request.getParameter("can_access_sex")));
		 			String expertise = StringEscapeUtils.escapeJava(request.getParameter("expertise"));
				   }catch(Exception e){
						response.getWriter().println("Not possible to retrieve the user in the session.");
				   }
						
							
			
			
			Date birthDate = null;
			if(birth_string != null && !birth_string.equals("")) {
				birthDate = new SimpleDateFormat("yyyy-MM-dd").parse(birth_string);
			}

						
			//System.out.println(birthDate+" "+(StringEscapeUtils.escapeJava(request.getParameter("can_access_age")))+" "+sex+" "+(StringEscapeUtils.escapeJava(request.getParameter("can_access_sex"))));
			if(can_age_string != null && can_age_string.equals("on")) {
				if(birthDate == null) {
					System.out.println("NoBirthException");
					throw new NoBirthException();
				}
				canAccessAge = 1;
			}
			if(can_sex_string != null && can_sex_string.equals("on")) {
				if(sex == null) {
					System.out.println("NoSexException");
					throw new NoSexException();
				}
				canAccessSex = 1;
			}
			
			
			try{ 
	 			questionnaire = questionnaireService.findByDate(new Date());
			   }catch(Exception e){
					response.getWriter().println("Not possible to find the questionnaire.");
			   }

			
			questions=questionnaire.getQuestions();
	 		int count=0;
	 		for(Question question : questions){     
	 			try{ 
		 			String content = StringEscapeUtils.escapeJava(request.getParameter("answer"+count));
				   }catch(Exception e){
						response.getWriter().println("Not possible to retrieve the answers content.");
				   }
	 		    if(content==null||content.isEmpty()){
	 		    	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	 		    	response.setCharacterEncoding("UTF-8");
					response.getWriter().println("");
					return;
		
	 		    }
	 		    Answer answer= new Answer();
	 		    answer.setContent(content);
	 		    answer.setQuestion(question);
	 		    answer.setReview(review);
	 		    answers.add(answer);
	 			count++;
	 		}
	 		try{ 
		 		review = reviewService.createReview(canAccessAge, canAccessSex, new Date(), expertise, user, questionnaire, answers, sex, birthDate);
			   }catch(Exception e){
					response.getWriter().println("Not possible to create the review.");
			   }
			response.setStatus(HttpServletResponse.SC_OK);
			response.setCharacterEncoding("UTF-8");
			response.setContentType("text/plain"); 
		    response.getWriter().println("Thank you for your help ^^.");
		    
	       }catch (NoBirthException e){
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.setContentType("text/plain"); 
				response.getWriter().println("No birth to be given access");
				return;
	       }catch (NoSexException e){
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.setContentType("text/plain"); 
				response.getWriter().println("No sex to be given access");
				return;
	       }catch (Exception e){
	    	   	String mex = "Bad request.";
    		    if (e instanceof NoBirthException || e instanceof NoSexException) {
    		        mex = e.getMessage();
    		    } 
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.setContentType("text/plain"); 
				response.getWriter().println(mex);
				return;
	       }
	}
	
	public void destroy() {
	}
}
