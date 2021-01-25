package gamifyUser.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.ejb.EJB;
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
import polimi.db2.gamifyDB.services.ReviewService;
import polimi.db2.gamifyDB.services.UserService;

@WebServlet("/GetLeaderboard")
@MultipartConfig
public class GetLeaderboard extends HttpServlet{
	private static final long serialVersionUID = 123211111L;
	@EJB(name = "gamifyDB.services/ReviewService")
	private ReviewService ReviewService;
	@EJB(name = "gamifyDB.services/UserService")
	private UserService UserService;
	
	int leaderboard_size = 10;
	
	
	public GetLeaderboard() {
		super();
	}

	public void init(){
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//get the product	
		try {
			List<Review> reviews=null;
			reviews = ReviewService.findAllToday();
			reviews.sort((r1, r2) -> Integer.compare(r2.getPoints(), r1.getPoints()));

			List<String> usernames = new ArrayList<>();
			List<Integer> points = new ArrayList<>();
			for(Review review: reviews) {
				System.out.println(review.getUser());
				System.out.println(review.getPoints());
				if(review.getUser().getBlocked() == 0 && review.getUser().getAdmin() == 0) {
					usernames.add(review.getUser().getUsername());
					points.add(review.getPoints());
				}
			}
			List<User> users = UserService.findAllNoBlockedNoAdmin();
			for(User user: users) {
				if(!usernames.contains(user.getUsername())) {
					usernames.add(user.getUsername());
					points.add(0);
				}
			}
			Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
			String ret = "{\"usernames\": "+gson.toJson(usernames)+", \"points\": "+gson.toJson(points)+" }";
			
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
	public void destroy(){
	}
}
	
