package gamifyUser.filters;

import java.io.IOException;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import polimi.db2.gamifyDB.entities.User;

public class UserChecker implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        HttpServletResponse res = (HttpServletResponse) servletResponse;
        String redirectPath = req.getServletContext().getContextPath() + "/";

        HttpSession session = req.getSession();
        User user = (User) session.getAttribute("user");
        if (user.getAdmin() == 1) {
            res.sendRedirect(redirectPath);
            return;
        }
        //  filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void destroy() {

    }
}
