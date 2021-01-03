package gamifyUser.controllers;

import java.io.IOException;
import java.util.Date;
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
import polimi.db2.gamifyDB.services.*;

@WebServlet("/GetProduct")
@MultipartConfig
public class GetProduct extends HttpServlet{
	private static final long serialVersionUID = 123211111L;
	@EJB(name = "gamifyDB.services/ProductService")
	
	private QuestionnaireService questionnaireService;

		public GetProduct() {
			super();
		}

		public void init(){
		}
		
		public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
			
			//get the product	
			Questionnaire questionnaire=null;

			try {		  				
				questionnaire = questionnaireService.findByDate(new Date());
				Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
				
				
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
		public void destroy() {
		}
}
		