package gamifyUser.controllers;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.ejb.EJB;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import polimi.db2.gamifyDB.entities.Answer;
import polimi.db2.gamifyDB.entities.Questionnaire;
import polimi.db2.gamifyDB.entities.Review;
import polimi.db2.gamifyDB.entities.User;
import polimi.db2.gamifyDB.services.QuestionService;
import polimi.db2.gamifyDB.services.QuestionnaireService;
import polimi.db2.gamifyDB.services.ReviewService;
import polimi.db2.gamifyDB.services.UserService;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang3.RandomStringUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import gamifyUser.utility.AnswerSerialize;
import gamifyUser.utility.Utility;

import javax.servlet.http.Part;


@WebServlet("/user")
@MultipartConfig
public class UserHome extends HttpServlet {
	private static final long serialVersionUID = 153218111L;

	public UserHome() {
		super();
	}

	public void init() {
	
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		ServletContext context= getServletContext();
		RequestDispatcher rd = context.getRequestDispatcher("/HomePage.html");
		rd.forward(request, response);		
	}

	public void destroy() {
	}
}

