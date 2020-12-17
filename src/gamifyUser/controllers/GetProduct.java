package gamifyUser.controllers;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
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
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import gamifyUser.utility.Utility;
import polimi.db2.gamifyDB.entities.Questionnaire;
import polimi.db2.gamifyDB.services.*;

@WebServlet("/GetProduct")
@MultipartConfig
public class GetProduct extends HttpServlet{
	private static final long serialVersionUID = 123211111L;
	private static final List<Integer> allowedPageSizes = Arrays.asList(10,25,50,100);
	@EJB(name = "gamifyDB.services/ProductService")
	
	private QuestionnaireService questionnaireService;

		public GetProduct() {
			super();
		}

		public void init(){
		}
		
		public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
			
			// List<String> mandatoryParams = new ArrayList<>(Arrays.asList("date"));
			// if(!Utility.paramExists(request, response, mandatoryParams) || Utility.paramIsEmpty(request, response, mandatoryParams)) return;
			
			//get the product	
			Questionnaire questionnaire=null;

			try {
				  				
				
				questionnaire = questionnaireService.findByDate(new Date());
				Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
				String applicationPath = request.getServletContext().getRealPath("");
				String uploadFilePath = applicationPath + File.separator + "uploads/campaignImages";
				questionnaire.setImage(uploadFilePath);
				response.setStatus(HttpServletResponse.SC_OK);
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				response.getWriter().print(gson.toJson(questionnaire));
				return;
				
			} catch (Exception e){
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Not possible to find the product");
				return;			}

      }
}
		