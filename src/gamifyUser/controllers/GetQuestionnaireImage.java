package gamifyUser.controllers;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletContext;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringEscapeUtils;

@WebServlet("/uploads/campaignImages")
public class GetQuestionnaireImage extends HttpServlet {

	private static final long serialVersionUID = 4445907077835438779L;

	public void doGet(HttpServletRequest request, 
    		HttpServletResponse response) throws IOException
    {
    	ServletContext servletContext = request.getServletContext();
		String name = request.getParameter("name");
    	
		if(name == null || name.isBlank()) {
			response.setStatus(
		               HttpServletResponse.SC_BAD_REQUEST);
		            return;
		}
		
		try {
			name = StringEscapeUtils.escapeJava(name);
			if(name == null) throw new Exception();
		} catch(Exception e) {
			response.setStatus(
		               HttpServletResponse.SC_BAD_REQUEST);
		            return;
		}
		
        File uploadsFolder = new File(servletContext.getInitParameter("uploadsLocation"), servletContext.getInitParameter("campaignImagesFolder"));
        File file = new File(uploadsFolder, name);
        if(file == null || !file.exists()) {
			response.setStatus(
		               HttpServletResponse.SC_BAD_REQUEST);
		            return;
		}
        
        String mimeType = servletContext.getMimeType(file.getPath());
        if (mimeType == null)
        {
            response.setStatus(
               HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }
    
        // Set content type
        
        response.setContentType(mimeType);
            
        response.setContentLength((int)file.length());
        
        // Copy the contents of the file to the responses output stream
        	
        FileInputStream in = new FileInputStream(file);
        OutputStream out = response.getOutputStream();
        byte[] buf = new byte[1024];
        int len = 0;
        while ((len = in.read(buf)) >= 0)
        {
            out.write(buf, 0, len);
        }
        in.close();
        out.close();
    }

}

