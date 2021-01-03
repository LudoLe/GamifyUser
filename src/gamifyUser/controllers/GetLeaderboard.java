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

import org.apache.commons.lang.StringEscapeUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import gamifyUser.utility.Utility;
import polimi.db2.gamifyDB.entities.Leaderboard;
import polimi.db2.gamifyDB.entities.Question;
import polimi.db2.gamifyDB.entities.Questionnaire;
import polimi.db2.gamifyDB.entities.User;
import polimi.db2.gamifyDB.services.LeaderboardService;

@WebServlet("/GetLeaderboard")
@MultipartConfig
public class GetLeaderboard extends HttpServlet{
	private static final long serialVersionUID = 123211111L;
	@EJB(name = "gamifyDB.services/LeaderboardService")
	private LeaderboardService LeaderboardService;

	
	int leaderboard_size = 10;
	
	
	public GetLeaderboard() {
		super();
	}

	public void init(){
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//get the product	
		try {
			List<Leaderboard> usernames_points=null;
			//int page = Integer.parseInt(StringEscapeUtils.escapeJava(request.getParameter("page")));
			//usernames_points = LeaderboardService.findBetween((page-1)*leaderboard_size, (page)*leaderboard_size);
			usernames_points = LeaderboardService.findBetween(0, 5);
			Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
			
			String ret = gson.toJson(usernames_points);
			
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
	
