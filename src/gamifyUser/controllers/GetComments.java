package gamifyUser.controllers;


import java.io.IOException;
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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import polimi.db2.gamifyDB.entities.Questionnaire;
import polimi.db2.gamifyDB.services.QuestionnaireService;

@WebServlet("/GetComments")
@MultipartConfig
public class GetComments extends HttpServlet{
	private static final long serialVersionUID = 123211111L;
	private static final List<Integer> allowedPageSizes = Arrays.asList(10,25,50,100);
	@EJB(name = "gamifyDB.services/ProductService")
	
	private QuestionnaireService questionnaireService;

		public GetComments() {
			super();
		}

		public void init(){
		}
		public void destroy() {
		}
	
}