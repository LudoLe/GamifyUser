package gamifyUser.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
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

import gamifyUser.utility.Utility;

@WebServlet("/CheckSignUp")
@MultipartConfig
public class CheckSignUp extends HttpServlet {

	public static final int MAX_USERNAME_LENGTH = 40;
	public static final int MAX_EMAIL_LENGTH = 100;
	public static final int MAX_PWD_LENGTH = 100;

	private static final long serialVersionUID = 198237498L;
	@EJB(name = "polimi.db2.gamifyDB.services/UserService")
	private UserService usrService;

	public CheckSignUp() {
		super();
	}

	public void init() throws ServletException {
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// obtain and escape params
		String usrn, pwd, pwd2, email;

		List<String> mandatoryParams = new ArrayList<>(Arrays.asList("user2", "mail2", "pass2", "pass3"));
		if (!Utility.paramExists(request, response, mandatoryParams)
				|| Utility.paramIsEmpty(request, response, mandatoryParams))
			return;

		try {
			usrn = StringEscapeUtils.escapeJava(request.getParameter("user2"));
			email = StringEscapeUtils.escapeJava(request.getParameter("mail2"));
			if (!Utility.isValidMailAddress(email))
				throw new Exception();
			pwd = StringEscapeUtils.escapeJava(request.getParameter("pass2"));
			pwd2 = StringEscapeUtils.escapeJava(request.getParameter("pass3"));
		} catch (Exception e) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request");
			return;
		}

		if (!pwd2.contentEquals(pwd)) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request. Passwords do not match.");
			return;
		}

		if (usrn.length() >= MAX_USERNAME_LENGTH || email.length() > MAX_EMAIL_LENGTH
				|| pwd.length() > MAX_PWD_LENGTH) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid request. Passwords do not match.");
			return;
		}

		User user;
		try {
			user = usrService.createUser(usrn, pwd, email);
		} catch (Exception e) {
			response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					"Internal server error. Please try again later.");
			return;
		}
		if (user == null) {
			response.setStatus(HttpServletResponse.SC_CONFLICT);
			response.getWriter().println("Incorrect credentials");
			return;
		}

		request.getSession().setAttribute("user", user);
		response.setStatus(HttpServletResponse.SC_OK);
		response.setCharacterEncoding("UTF-8");
		String redirectPath = "GamifyUser/user";
		response.getWriter().print(redirectPath);

	}

	public void destroy() {

	}
}
