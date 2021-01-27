package gamifyUser.controllers;

import java.io.IOException;
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
import polimi.db2.gamifyDB.entities.Review;
import polimi.db2.gamifyDB.entities.User;
import polimi.db2.gamifyDB.services.*;

@WebServlet("/CheckSubmit")
@MultipartConfig
public class CheckSubmit extends HttpServlet{
	private static final long serialVersionUID = 123211111L;
	@EJB(name = "gamifyDB.services/ReviewService")
	
	private ReviewService reviewService;

		public CheckSubmit() {
			super();
		}

		public void init(){
		}
		
		public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
			
			//check if user already submitted 
			List<Review> reviews=null;
		    User user=(User) request.getSession().getAttribute("user");
		    Boolean bol=false;
		    int submit=0;
		    int userSubmit= user.getUserId();

		    try {		  				
				reviews = reviewService.findAllToday();
				
				for(Review review : reviews){
					submit=review.getUser().getUserId();
					if(submit==userSubmit){
						bol=true;
					}
				}
			
				
				Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();	
				response.setStatus(HttpServletResponse.SC_OK);
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				response.getWriter().print(gson.toJson(bol));
				return;
				
			} catch (Exception e){
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Something went wrong");
				return;			}

      }
		public void destroy() {
		}
}
		