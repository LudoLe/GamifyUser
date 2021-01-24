package gamifyUser.utility;

import java.io.File;

import javax.servlet.ServletContextEvent;

public class OnGamifyLoaded implements javax.servlet.ServletContextListener {
	@Override
	  public void contextInitialized(ServletContextEvent arg0) {
		// check whether the uploads folder and the campaign images folders exist and are writable
		// if they're not there (or aren't writable), try fixing it
		  File uploadsFolder = new File(arg0.getServletContext().getInitParameter("uploadsLocation"));

		  boolean result = false;
		  if(uploadsFolder.exists()) {
			  if(!uploadsFolder.canWrite()) {
				  try {
					 result = uploadsFolder.setWritable(true);
					 if (!result) throw new Exception();
				  } catch(Exception e) {
					  System.err.println("[CRITICAL] Uploads folder exists but isn't writable. Please chmod it.");
					  System.exit(-1);
				  }
			  }
			  checkCampaignImagesFolder(arg0, uploadsFolder);
		  }
		  else {
			  try {
				  result = uploadsFolder.mkdir();
				  if (!result) throw new Exception();
					 else result = false;
				  result = uploadsFolder.setWritable(true);
				  if (!result) throw new Exception();
			  } catch (Exception e) {
				  System.err.println("[CRITICAL] Uploads folder can't be created. Please chmod the parent folder.");
				  System.exit(-1);
			  }
			  checkCampaignImagesFolder(arg0, uploadsFolder);
		  }
	}
	
	private void checkCampaignImagesFolder(ServletContextEvent arg0, File uploadsFolder) {
		boolean result = false;
		File campaignImagesFolder = new File(uploadsFolder, arg0.getServletContext().getInitParameter("campaignImagesFolder"));
		if(!campaignImagesFolder.exists()) {
			  try {
				  result = campaignImagesFolder.mkdir();
				  if (!result) throw new Exception();
					 else result = false;
				  result = campaignImagesFolder.setWritable(true);
				  if (!result) throw new Exception();
			  } catch(Exception e) {
				  System.err.println("[CRITICAL] Campaign images folder can't be created. Please chmod the uploads folder.");
				  System.exit(-1);
			  }
		  }
		else if (!campaignImagesFolder.canWrite()) {
			try {
				result = campaignImagesFolder.setWritable(true);
				if (!result) throw new Exception();
			  } catch(Exception e) {
				  System.err.println("[CRITICAL] Campaign images folder exists but isn't writable. Please chmod it.");
				  System.exit(-1);
			  }
		}
	}
}
