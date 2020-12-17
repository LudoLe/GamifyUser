package gamifyUser.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
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
import gamifyUser.utility.Utility;

import polimi.db2.gamifyDB.entities.Question;
import polimi.db2.gamifyDB.entities.Questionnaire;
import polimi.db2.gamifyDB.services.QuestionService;
import polimi.db2.gamifyDB.services.QuestionnaireService;

@WebServlet("/GetQuestionnaire")
@MultipartConfig
public class GetQuestionnaire extends HttpServlet{
	private static final long serialVersionUID = 123211111L;
	@EJB(name = "gamifyDB.services/QuestionnaireService")
	private QuestionnaireService questionnaireService;
	@EJB(name = "gamifyDB.services/QuestionService")
	private QuestionService questionService;

		public GetQuestionnaire() {
			super();
		}

		public void init(){
		}
		
		public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
			
			
			
			//get the product	
			List<Question> questions=null;
			Questionnaire questionnaire;

			try {
		        
				questionnaire = questionnaireService.findByDate(new Date());
				Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
				response.setStatus(HttpServletResponse.SC_OK);
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				
				if(questionnaire!=null){
						questions=questionnaire.getQuestions();
						response.getWriter().print(gson.toJson(questions));
				}else  response.getWriter().print(gson.toJson(questionnaire));

				return;
				
			} catch (Exception e){
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Not possible to retrieve the questionnaire");
				return;			}

      }
}
	
