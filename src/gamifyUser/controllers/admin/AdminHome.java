package gamifyUser.controllers.admin;

import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/admin")
@MultipartConfig
public class AdminHome extends HttpServlet {
	private static final long serialVersionUID = 153218111L;

	public AdminHome() {
		super();
	}

	public void init() {
	
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		ServletContext context= getServletContext();
		RequestDispatcher rd = context.getRequestDispatcher("/admin.html");
		rd.forward(request, response);		
	}

	public void destroy() {
	}
}

