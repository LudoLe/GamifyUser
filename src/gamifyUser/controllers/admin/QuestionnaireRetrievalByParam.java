package gamifyUser.controllers.admin;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;

import java.util.*;
import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import polimi.db2.gamifyDB.entities.Questionnaire;
import polimi.db2.gamifyDB.services.QuestionService;
import polimi.db2.gamifyDB.services.QuestionnaireService;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang3.RandomStringUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import gamifyUser.utility.Utility;

import javax.servlet.http.Part;


@WebServlet("/admin/getQuestionnaire")
@MultipartConfig
public class QuestionnaireRetrievalByParam extends HttpServlet {
	private static final long serialVersionUID = 123211111L;
	@EJB(name = "gamifyDB.services/QuestionnaireService")
	private QuestionnaireService questionnaireService;

	public QuestionnaireRetrievalByParam() {
		super();
	}

	public void init() {
	
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		List<String> mandatoryParams = new ArrayList<>(Arrays.asList("mode"));
		if(!Utility.paramExists(request, response, mandatoryParams) || Utility.paramIsEmpty(request, response, mandatoryParams)) return;
		
		int mode;
		List<Integer> allowedModes = new ArrayList<>();
		allowedModes.add(RetrievalMode.DATE);
		allowedModes.add(RetrievalMode.FILL);
		allowedModes.add(RetrievalMode.DATE_DELETION);
		allowedModes.add(RetrievalMode.FILL_DELETION);

		try{
			mode = Integer.parseInt(request.getParameter("mode"));
			if(!allowedModes.contains(mode)) throw new Exception();
		} catch (Exception e){
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request.");
			return;
		}

		try {
			Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			if(mode == RetrievalMode.DATE) {
				SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
				Date date = simpleDateFormat.parse(request.getParameter("date"));
				if(date == null) throw new Exception();
				Questionnaire questionnaire = questionnaireService.findByDate(date);
				if(mode == RetrievalMode.DATE_DELETION) {
					Date parsedDate = simpleDateFormat.parse(simpleDateFormat.format(new Date()));
					if(date.after(parsedDate) || date.equals(parsedDate)) {
						response.setStatus(HttpServletResponse.SC_NOT_FOUND);
						response.getWriter().print("Questionnaire not found");
						return;
					}
				}
				if(questionnaire == null) {
					response.setStatus(HttpServletResponse.SC_NOT_FOUND);
					response.getWriter().print("Questionnaire not found");
				}
				else response.getWriter().print(gson.toJson(questionnaire));
			}
			else if(mode == RetrievalMode.FILL || mode == RetrievalMode.FILL_DELETION) {
				String input = StringEscapeUtils.escapeJava(request.getParameter("name"));
				if(input == null || input.isEmpty()) return;
				else {
					List<Questionnaire> questionnaires = questionnaireService.getQuestionnairesFill(input, mode == RetrievalMode.FILL_DELETION);
					if(questionnaires == null) {
						response.setStatus(HttpServletResponse.SC_NOT_FOUND);
						response.getWriter().print("Questionnaire not found");
					}
					else response.getWriter().print(gson.toJson(questionnaires));
				}
			}
			return;
		} catch (Exception e){
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request.");
		}
	}

	public void destroy() {
	}
}

class RetrievalMode {
	public static final int DATE = 1;
	public static final int FILL = 2;
	public static final int DATE_DELETION = 3;
	public static final int FILL_DELETION = 4;

}

