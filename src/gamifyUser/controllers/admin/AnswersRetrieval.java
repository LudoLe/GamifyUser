package gamifyUser.controllers.admin;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import polimi.db2.gamifyDB.entities.Answer;
import polimi.db2.gamifyDB.entities.Questionnaire;
import polimi.db2.gamifyDB.entities.Review;
import polimi.db2.gamifyDB.entities.User;
import polimi.db2.gamifyDB.services.QuestionService;
import polimi.db2.gamifyDB.services.QuestionnaireService;
import polimi.db2.gamifyDB.services.ReviewService;
import polimi.db2.gamifyDB.services.UserService;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang3.RandomStringUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import gamifyUser.utility.AnswerSerialize;
import gamifyUser.utility.Utility;

import javax.servlet.http.Part;


@WebServlet("/admin/getAnswers")
@MultipartConfig
public class AnswersRetrieval extends HttpServlet {
	private static final long serialVersionUID = 123218111L;
	@EJB(name = "gamifyDB.services/UserService")
	private UserService userService;

	public AnswersRetrieval() {
		super();
	}

	public void init() {
	
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		List<String> mandatoryParams = new ArrayList<>(Arrays.asList("questionnaireId", "userId"));
		if(!Utility.paramExists(request, response, mandatoryParams) || Utility.paramIsEmpty(request, response, mandatoryParams)) return;
		
		int questionnaireId, userId;
		
		try{
			questionnaireId = Integer.parseInt(request.getParameter("questionnaireId"));
			userId = Integer.parseInt(request.getParameter("userId"));
			if (questionnaireId < 0 || userId < 0) throw new Exception();
		} catch (Exception e){
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request.");
			return;
		}

		List<Answer> answers;
		Optional<Review> optReview;
		User user;
		List<String> statistics = new ArrayList<>();
		try {
			Review review = null;
			user = userService.find(userId);
			if(user == null) throw new Exception();
			optReview = user.getReviews().stream().filter((Review r) -> r.getQuestionnaire().getQuestionnaireId() == questionnaireId).findAny();
			if(optReview.isEmpty()) throw new Exception();
			review = optReview.get();
			answers = review.getAnswers();
			if(review.getCanAccessAge() == 1) {
				long diff = (new Date()).getTime() - user.getBirth().getTime();
				diff = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);
				statistics.add(String.valueOf(diff));
			}
			else statistics.add(null);
			if(review.getCanAccessSex() == 1) {
				statistics.add(user.getSex());
			}
			else statistics.add(null);
			statistics.add(review.getExpertise());
			Gson gson = new GsonBuilder().registerTypeAdapter(Answer.class, new AnswerSerialize()).excludeFieldsWithoutExposeAnnotation().create();
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().print("{\"stats\":" + gson.toJson(statistics) + "," + "\"opt\":" + gson.toJson(answers) + "}");
			return;
		} catch (Exception e){
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request.");
		}
	}

	public void destroy() {
	}
}
