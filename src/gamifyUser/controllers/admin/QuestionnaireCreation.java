package gamifyUser.controllers.admin;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
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

import gamifyUser.utility.Utility;

import javax.servlet.http.Part;


@WebServlet("/admin/create")
@MultipartConfig
public class QuestionnaireCreation extends HttpServlet {
	private static final long serialVersionUID = 1231111L;
	@EJB(name = "gamifyDB.services/QuestionnaireService")
	private QuestionnaireService questionnaireService;
	@EJB(name = "gamifyDB.services/QuestionService")
	private QuestionService questionService;

	public QuestionnaireCreation() {
		super();
	}

	public void init() {
	
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		List<String> mandatoryParams = new ArrayList<>(Arrays.asList("name", "date", "Question0"));
		if(!Utility.paramExists(request, response, mandatoryParams) || Utility.paramIsEmpty(request, response, mandatoryParams)) return;
		Set<String> paramNames = request.getParameterMap().keySet();
		if (paramNames.size() > 150) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Too many questions.");
			return;
		}
		String question0, name;
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date date, currentTime = new Date();
		
		//TODO check if another questionnaire with the same date already exists 
		Calendar calendar = Calendar.getInstance();
		try{
			name = StringEscapeUtils.escapeJava(request.getParameter("name"));
			question0 = StringEscapeUtils.escapeJava(request.getParameter("Question0"));
			if (question0.length() > Utility.MAX_QUESTION_LENGTH) throw new Exception();
			date = simpleDateFormat.parse(request.getParameter("date"));
			calendar.setTime(date);
			currentTime = simpleDateFormat.parse(simpleDateFormat.format(currentTime));
			long milliseconds = (calendar.getTime().getTime() - currentTime.getTime());
			if (milliseconds < 0) throw new IllegalArgumentException();
		} catch (Exception e){
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request.");
			return;
		}

		List<String> questions = new ArrayList<>();

		questions.addAll(Utility.retrieveQuestions(request));

		Part part = request.getPart("image");
		
		if(part == null) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request.");
			return;
		}

		// gets absolute path of the web application
		String applicationPath = request.getServletContext().getInitParameter("uploadsLocation");
	
		// constructs path of the directory to save uploaded file
		String uploadFilePath = applicationPath + request.getServletContext().getInitParameter("campaignImagesFolder");
		

		String fileName = part.getSubmittedFileName();
		String contentType = part.getContentType();
		String generatedString = RandomStringUtils.randomAlphabetic(80);
		String ext = Utility.getFileExtension(fileName);
		String savedFileName = generatedString + "." + ext;

		// allows only JPEG HEIC and PNG files to be uploaded
		if (!contentType.equalsIgnoreCase("image/jpeg") && !contentType.equalsIgnoreCase("image/png") && !contentType.equalsIgnoreCase("image/heic")) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid image extension.");
			return;
		}
		File fileToSave = new File(uploadFilePath, savedFileName);
		int i = 0;
		while(fileToSave.exists()) {
			savedFileName = generatedString + i + "." + ext;
			fileToSave = new File(uploadFilePath, savedFileName);
			i++;
		}

		try {
			Questionnaire q = questionnaireService.createQuestionnaire(savedFileName, name, date, questions);
			if(q == null) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.setContentType("text/plain;charset=UTF-8");
				response.getWriter().println("A questionnaire already exists on this date.");
				return;
			}
			try (InputStream input = part.getInputStream()) {
			    Files.copy(input, fileToSave.toPath());
			}

			response.setStatus(HttpServletResponse.SC_OK);
			response.getWriter().println("OK");
			return;
		} catch (Exception e){
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal error.");
		}
	}

	public void destroy() {
	}
}

