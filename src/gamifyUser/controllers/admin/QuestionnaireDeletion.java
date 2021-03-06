package gamifyUser.controllers.admin;

import java.io.IOException;
import java.util.*;
import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import polimi.db2.gamifyDB.services.QuestionnaireService;

import gamifyUser.utility.Utility;


@WebServlet("/admin/delete")
@MultipartConfig
public class QuestionnaireDeletion extends HttpServlet {
	private static final long serialVersionUID = 12111411L;
	@EJB(name = "gamifyDB.services/QuestionnaireService")
	private QuestionnaireService questionnaireService;

	public QuestionnaireDeletion() {
		super();
	}

	public void init() {
	
	}

	protected void doDelete(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		List<String> mandatoryParams = new ArrayList<>(Arrays.asList("id"));
		if(!Utility.paramExists(request, response, mandatoryParams) || Utility.paramIsEmpty(request, response, mandatoryParams)) return;

		try{
			int id = Integer.parseInt(request.getParameter("id"));
			boolean result = questionnaireService.delete(id);
			if(result) {
				response.setStatus(HttpServletResponse.SC_OK);
				response.getWriter().print(("OK"));
			}
			else {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.setContentType("text/plain;charset=UTF-8");
				response.getWriter().println("Invalid request.");
				return;
			}
		} catch (Exception e){
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.setContentType("text/plain;charset=UTF-8");
			response.getWriter().println("Invalid request.");
			return;
		}

	}

	public void destroy() {
	}
}

