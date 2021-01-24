package gamifyUser.controllers;

import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


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
		RequestDispatcher rd = context.getRequestDispatcher("/HomePage2.2.html");
		rd.forward(request, response);		
	}

	public void destroy() {
	}
}

