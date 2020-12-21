package gamifyUser.controllers;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import polimi.db2.gamifyDB.entities.User;
import polimi.db2.gamifyDB.services.UserService;

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

@WebServlet("/AutoFill")
@MultipartConfig
public class AutoFill extends HttpServlet {

	public static final int MAX_USERNAME_LENGTH = 40;
	public static final int MAX_EMAIL_LENGTH = 100;
	public static final int MAX_PWD_LENGTH = 100;

	private static final long serialVersionUID = 198237498L;
	
	public AutoFill() {
		super();
	}

	public void init() throws ServletException {
	}
	
	

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// obtain and escape params	
		try {
			
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

			User user=(User) request.getSession().getAttribute("user");
			//String date = simpleDateFormat.format(user.getBirth());
			
			

			Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
			response.setStatus(HttpServletResponse.SC_OK);
			response.setCharacterEncoding("UTF-8");
			response.setContentType("application/json");
			response.getWriter().print(gson.toJson(user));
		} catch (Exception e) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request");
			return;
		}

	}

	public void destroy() {

	}
}