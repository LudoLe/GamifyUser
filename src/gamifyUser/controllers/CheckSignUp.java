package gamifyUser.controllers;

import java.io.IOException;
import polimi.db2.gamifyDB.services.UserService;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.StringEscapeUtils;

@WebServlet("/CheckSignUp")
@MultipartConfig
public class CheckSignUp extends HttpServlet {
	private static final long serialVersionUID = 198237498L;
	@EJB(name = "polimi.db2.gamifyDB.services/UserService")
	private UserService usrService;

	public CheckSignUp(){
		super();
	}

	public void init() throws ServletException {
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// obtain and escape params
		String usrn = null;
		String pwd = null;
		String pwd2 = null;
		usrn = StringEscapeUtils.escapeJava(request.getParameter("user2"));
		pwd = StringEscapeUtils.escapeJava(request.getParameter("pass2"));
		pwd2 = StringEscapeUtils.escapeJava(request.getParameter("pass3"));

		if (usrn == null || pwd == null || usrn.isEmpty() || pwd.isEmpty() || pwd2.isEmpty()|| pwd2 == null) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Credentials must be not null");
			return;
		}
		if (!pwd2.contentEquals(pwd)) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Uuups something went wrong!");
			return;
		}
		
		//TODO metodi per controllare il signup
		UserService user = new UserService();
		try {
			user.createUser(usrn, pwd, usrn);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	
			

				request.getSession().setAttribute("user", usrn);
				response.setStatus(HttpServletResponse.SC_OK);
				response.setContentType("application/json");
				response.setCharacterEncoding("UTF-8");
				response.getWriter().println(usrn);
				
		
  }
	

	public void destroy(){
	
	}
  }
