package gamifyUser.controllers.admin;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.util.*;
import javax.ejb.EJB;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import gamifyUser.utility.Utility;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang3.RandomStringUtils;
import polimi.db2.gamifyDB.services.UserService;
import polimi.db2.gamifyDB.entities.User;
import javax.persistence.NonUniqueResultException;
import javax.servlet.http.Part;


@WebServlet("/admin/create")
@MultipartConfig
public class QuestionnaireCreation extends HttpServlet {
	private static final long serialVersionUID = 1L;
	@EJB(name = "polimi.db2.gamifyDB.services/QuestionnaireService")
	private QuestionnaireService qstService;

	public QuestionnaireCreation() {
		super();
	}

	public void init() throws ServletException {
	
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		List<String> mandatoryParams = new ArrayList<>(Arrays.asList("name", "date", "image", "Question0"));
		if(!Utility.paramExists(request, response, mandatoryParams) || Utility.paramIsEmpty(request, response, mandatoryParams)) return;
		Set<String> paramNames = request.getParameterMap().keySet();
		if (paramNames.size() > 150) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Too many questions.");
			return;
		}
		String question0 = null;
		String name = null;
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date date, currentTime = new Date();
		Calendar calendar = Calendar.getInstance();
		try{
			name = StringEscapeUtils.escapeJava(request.getParameter("name"));
			question0 = StringEscapeUtils.escapeJava(request.getParameter("Question0"));
			if (question0.length() > Utility.MAX_QUESTION_LENGTH) throw new Exception();
			date = simpleDateFormat.parse(request.getParameter("date"));
			calendar.setTime(date);
			long milliseconds = (calendar.getTime().getTime() - currentTime.getTime());
			if (milliseconds < 0) throw new IllegalArgumentException();
		} catch (Exception e){
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request.");
			return;
		}

		List<String> questions = new ArrayList<String>();
		questions.add(question0);
		questions.addAll(Utility.retrieveQuestions(request));

		Part part = request.getPart("image");

		// gets absolute path of the web application
		String applicationPath = request.getServletContext().getRealPath("");
		// constructs path of the directory to save uploaded file
		String uploadFilePath = applicationPath + File.separator + "uploads/campaignImages";
		// creates upload folder if it does not exists
		File uploadFolder = new File(uploadFilePath);
		if (!uploadFolder.exists()) {
			uploadFolder.mkdirs();
		}

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
		String finalPath = uploadFilePath + File.separator + savedFileName;
		File check = new File(uploadFilePath + File.separator + savedFileName);
		int i = 0;
		while(check.exists()) {
			savedFileName = generatedString + i + "." + ext;
			finalPath = uploadFilePath + File.separator + savedFileName;
			check = new File(finalPath);
			i++;
		}

		try {
			part.write(finalPath);
			qstService.createQuestionnaire(savedFileName, name);
			response.sendRedirect(getServletContext().getContextPath() + "/greetins.html");
		} catch (Exception e){
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal error.");
		}
	}

	public void destroy() {
	}
}

