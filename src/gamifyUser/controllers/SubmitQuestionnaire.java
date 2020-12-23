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
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
			List<Question> questions=null;
			List<Answer> answers= new ArrayList<Answer>();
			int canAccessAge=0;
			int canAccessSex=0;
			Review review=null;
			Questionnaire questionnaire;
			Date birthDate=null;
			String sex;
           
			
			List<String> mandatoryParams = new ArrayList<>(Arrays.asList("expertise"));
			/*
			if (!Utility.paramExists(request, response, mandatoryParams)
					|| Utility.paramIsEmpty(request, response, mandatoryParams))
				return;
			 */
			
			User user=(User) request.getSession().getAttribute("user");
			System.out.println(user.getUserId());
			System.out.println(user.getBirth());
			System.out.println(user.getSex());
			birthDate = user.getBirth();
			sex = user.getSex();
			
			//System.out.println(birthDate+" "+(StringEscapeUtils.escapeJava(request.getParameter("can_access_age")))+" "+sex+" "+(StringEscapeUtils.escapeJava(request.getParameter("can_access_sex"))));
			String age_string = (StringEscapeUtils.escapeJava(request.getParameter("can_access_age")));
			if(age_string != null && age_string.equals("on")) {
				if(birthDate == null) // non posso dare l'autorizzazione
					return;
				canAccessAge = 1;
			}
			String sex_string = (StringEscapeUtils.escapeJava(request.getParameter("can_access_sex")));
			if(sex_string != null && sex_string.equals("on")) {
				if(sex == null) // non posso dare l'autorizzazione
					return;
				canAccessSex = 1;
			}
			
 			String expertise = StringEscapeUtils.escapeJava(request.getParameter("expertise"));
 		    userService.updateProfile(user);
 			
 			questionnaire = questionnaireService.findByDate(new Date());

			//System.out.println(canAccessAge+" "+canAccessSex+" "+expertise+" "+user+" "+questionnaire);
			review = reviewService.createReview(canAccessAge, canAccessSex, new Date(), expertise, user, questionnaire);
			//System.out.println("ok");
			questions=questionnaire.getQuestions();
	 		int count=0;
	 		for(Question question : questions){     
	 			String content = StringEscapeUtils.escapeJava(request.getParameter("answer"+count));
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
	 		    answerService.createAnswers(answers);
	 			
			response.setStatus(HttpServletResponse.SC_OK);
			response.setCharacterEncoding("UTF-8");
		    response.getWriter().println("Thank you for your help ^^.");
	       }catch (Exception e){
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().println("Bad request.");
				return;
			}
	}
	
	public void destroy() {
	}
}
