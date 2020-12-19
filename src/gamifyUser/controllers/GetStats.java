package gamifyUser.controllers;

import java.io.IOException;
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

import polimi.db2.gamifyDB.entities.Question;
import polimi.db2.gamifyDB.entities.Questionnaire;
import polimi.db2.gamifyDB.entities.Review;
import polimi.db2.gamifyDB.entities.User;
import polimi.db2.gamifyDB.services.QuestionService;
import polimi.db2.gamifyDB.services.QuestionnaireService;
import polimi.db2.gamifyDB.services.UserService;

@WebServlet("/GetStats")
@MultipartConfig
public class GetStats extends HttpServlet{
	private static final long serialVersionUID = 123211111L;
	@EJB(name = "gamifyDB.services/UserService")
	private QuestionnaireService questionnaireService;
	@EJB(name = "gamifyDB.services/ReviewService")
	private QuestionService questionService;

		public GetStats() {
			super();
		}

		public void init(){
		}
		
		public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
			
			String expertise = null;
			String age = null;
			String sex = null;
			User user = null;
			UserService userService=null;
			

			try {
				age = StringEscapeUtils.escapeJava(request.getParameter("age"));
				sex = StringEscapeUtils.escapeJava(request.getParameter("sex"));
				expertise = StringEscapeUtils.escapeJava(request.getParameter("expertise"));
				
			// If the user exists, add info to the session and go to home page, otherwise
			// show login page with error message
			
				
				
				user.setSex(sex);
				userService.updateProfile(user);


				response.setStatus(HttpServletResponse.SC_OK);
				response.setCharacterEncoding("UTF-8");}
				catch (Exception e) {
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
					response.getWriter().println("Bad request.");
					return;
				}
		}

		public void destroy() {
		}
}