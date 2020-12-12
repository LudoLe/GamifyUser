package gamifyUser.utility;

import org.apache.commons.validator.routines.EmailValidator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Utility {
    public static final int MAX_QUESTION_LENGTH = 45;

    public static String getFileExtension(String fileName){
        if(fileName.lastIndexOf(".") != -1 && fileName.lastIndexOf(".") != 0)
            return fileName.substring(fileName.lastIndexOf(".")+1);
        else return "";
    }

    public static boolean isValidMailAddress(String email){
        return EmailValidator.getInstance().isValid(email);
    }

    public static boolean paramExists(HttpServletRequest req, HttpServletResponse resp, List<String> params) throws IOException {
        Map<String,String[]> parameterMap = req.getParameterMap();
        if(params.stream().anyMatch(parameter -> !parameterMap.containsKey(parameter))){
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return false;
        }
        return true;
    }
    public static boolean paramExists(HttpServletRequest req, HttpServletResponse resp, String param) throws IOException {
        if(!req.getParameterMap().containsKey(param)){
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Parameter " + param + " not found");
            return false;
        }
        return true;
    }


    public static boolean paramIsEmpty(HttpServletRequest req, HttpServletResponse resp, List<String> params) throws IOException{
        for (String param : params) {
            if (req.getParameter(param).isEmpty()) {
                resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Parameter " + param + " is empty");
                return true;
            }
        }
        return false;
    }
    public static boolean paramIsEmpty(HttpServletRequest req, HttpServletResponse resp, String param) throws IOException{
        if(req.getParameter(param).isEmpty()){
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Parameter " + param + " is empty");
            return true;
        }
        return false;
    }

    public static List<String> retrieveQuestions(HttpServletRequest req) {
        Map<String,String[]> parameterMap = req.getParameterMap();
        return parameterMap.keySet().stream().filter(name -> name.contains("Question")).map(parameterMap::get).map(contents -> contents[0]).filter(content -> !content.isEmpty() && !(content.length() > MAX_QUESTION_LENGTH)).collect(Collectors.toList());
    }

}
