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

import polimi.db2.gamifyDB.entities.User;
import polimi.db2.gamifyDB.services.QuestionnaireService;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import gamifyUser.utility.Utility;


@WebServlet("/admin/listQuestionnaireCompletedUsers")
@MultipartConfig
public class QuestionnaireCompletedUsers extends HttpServlet {
	private static final long serialVersionUID = 123019711L;
	private static final List<Integer> allowedPageSizes = Arrays.asList(10,25,50,100);
	@EJB(name = "gamifyDB.services/QuestionnaireService")
	private QuestionnaireService questionnaireService;

	public QuestionnaireCompletedUsers() {
		super();
	}

	public void init() {
	
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		System.out.println("Completed questionnaire");
		List<String> mandatoryParams = new ArrayList<>(Arrays.asList("id","start","size"));
		if(!Utility.paramExists(request, response, mandatoryParams) || Utility.paramIsEmpty(request, response, mandatoryParams)) return;
		
		int start, size, id;
		
		try{
			start = Integer.parseInt(request.getParameter("start"));
			size = Integer.parseInt(request.getParameter("size"));
			id = Integer.parseInt(request.getParameter("id"));
			if (!allowedPageSizes.stream().anyMatch(e -> e == size) || start < 0) throw new Exception();
		} catch (Exception e){
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request.");
			return;
		}

		Set<User> users;
		try {
			users = questionnaireService.getCompletedUsers(id);
			if(users == null) {
				response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request.");
				return;
			}
			Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
			System.out.println(gson.toJson(users));
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().print(gson.toJson(users));
			return;
		} catch (Exception e){
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request.");
		}
	}

	public void destroy() {
	}
}

