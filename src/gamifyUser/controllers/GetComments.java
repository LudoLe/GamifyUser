package gamifyUser.controllers;


import java.io.IOException;
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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import polimi.db2.gamifyDB.entities.Questionnaire;
import polimi.db2.gamifyDB.entities.Review;
import polimi.db2.gamifyDB.entities.User;
import polimi.db2.gamifyDB.services.QuestionnaireService;
import polimi.db2.gamifyDB.services.ReviewService;

@WebServlet("/GetComments")
@MultipartConfig
public class GetComments extends HttpServlet{
	private static final long serialVersionUID = 123211111L;
	private static final List<Integer> allowedPageSizes = Arrays.asList(10,25,50,100);
	@EJB(name = "gamifyDB.services/ReviewService")
	private ReviewService ReviewService;
	@EJB(name = "gamifyDB.services/QuestionnaireService")
	private QuestionnaireService QuestionnaireService;

	public GetComments() {
		super();
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//get the reviews	
		try {
			List<Review> reviews=null;
			reviews = ReviewService.findAllToday();
			if(reviews.size()>5)
				reviews = reviews.subList(0, 5);
			Questionnaire questionnaire = QuestionnaireService.findByDate(new Date());
			
			Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
			String ret = gson.toJson(reviews);
			
			System.out.println(gson.toJson(questionnaire));
			System.out.println(ret);
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().print(ret);
			return;	
		} catch (Exception e){
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to retrieve the leadearboard");
			return;			
		}
	}
	
	public void init(){
	}
	public void destroy() {
	}
	
}