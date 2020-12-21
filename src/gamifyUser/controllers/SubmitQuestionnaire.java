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
	
	/*devo: 
	 * 1.creare una lista di domande
	 * 2. prendere il questionario di oggi e vedere quante domande ci stanno
	 * 3.creare una review
	 * 4. per ogni domanda, leggere la risposta, creare una Answer, riempire i campi e metterli nei db
	 * 5. prendere i dati di stats e se non sono nulli, metterli nello user
	 * 
	 *      
	//se è la prima volta che entro, allora 
	*/
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {	
	
		try {
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
			List<Question> questions=null;
			List<Answer> answers=null;
			int canAccessAge=0;
			int canAccessSex=0;
			int reviewId;
			Review review=null;
			Questionnaire questionnaire;
			Date birthDate=null;
			String sexIn;
			Integer pointsFirst=0;
			Integer pointsSecond=0;

			//List<String> mandatoryParams = new ArrayList<>(Arrays.asList("user2", "mail2", "pass2", "pass3"));
			//if (!Utility.paramExists(request, response, mandatoryParams)
			//		|| Utility.paramIsEmpty(request, response, mandatoryParams))
			//	return;

					
			User user=(User) request.getSession().getAttribute("user");
			birthDate= user.getBirth();
			sexIn= user.getSex();
		
 			String age = StringEscapeUtils.escapeJava(request.getParameter("age"));
 			
 			if(age!=null){
 				canAccessAge=1;
 				Date todate=simpleDateFormat.parse(age);
 	 			if(birthDate==null){user.setBirth(todate);}
	 			 pointsSecond=+1;
 				}
 			String sex = StringEscapeUtils.escapeJava(request.getParameter("sex"));
 			if(sex!=null){
 				canAccessSex=1;
 				if(sexIn==null){user.setSex(sex);
	 			 pointsSecond=+1;}
 			} 		
 			String expertise = StringEscapeUtils.escapeJava(request.getParameter("expertise"));
 			if(expertise!=null){			
	 			 pointsSecond=+1;
 			} 	
 		    userService.updateProfile(user);
 			
 			questionnaire = questionnaireService.findByDate(new Date());
			reviewId = reviewService.createReview(canAccessAge, canAccessSex, new Date(), expertise, user, questionnaire, pointsFirst, pointsSecond);

			questions=questionnaire.getQuestions();
	 		int count=0;
	 		for(Question question : questions){ 
	 			String content = StringEscapeUtils.escapeJava(request.getParameter("answer"+count));
	 			answerService.createAnswer(content, question, reviewId);
	 			count++;
	 			pointsFirst=+2;
	 			}
	 			
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
