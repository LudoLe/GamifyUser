package gamifyUser.filters;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import polimi.db2.gamifyDB.entities.User;

import java.io.IOException;

/**
 * Servlet Filter implementation class checker
 */

public class Checker implements Filter {

    /**
     * Default constructor.
     */
    public Checker() {
    }

    /**
     * @see Filter#destroy()
     */
    public void destroy() {
    }

    /**
     * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
     */
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {


        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
    	ServletContext context = req.getServletContext();

        String loginPath = context.getContextPath() + "/";

        HttpSession s = req.getSession();
        
        Object user = s.getAttribute("user");
    	String URI = req.getRequestURI();

        if (s.isNew() || user == null) {
        	if(!(URI.equals(loginPath) || URI.equals(loginPath + "CheckLogin") || URI.equals(loginPath + "loginManagement2.js") || URI.equals(loginPath + "utils.js") || URI.equals(loginPath + "login.css") || URI.equals(loginPath + "CheckSignUp"))) {
        		res.sendRedirect(loginPath);
                return;          
                }
        	else if(user != null) {
        		context.removeAttribute("user");
        		res.sendRedirect(loginPath);
                return;
        	}
        }
        
        else if(URI.equals(loginPath)) {
        	String redPath = loginPath + (((User) user).getAdmin() == 1 ? "admin" : "user");
        	res.sendRedirect(redPath);
        	return;
        }
        
        // pass the request along the filter chain
        chain.doFilter(request, response);
    }

    /**
     * @see Filter#init(FilterConfig)
     */
    public void init(FilterConfig fConfig) throws ServletException {
    }

}
