package gamifyUser.controllers;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.StringEscapeUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import gamifyUser.exceptions.NoBirthException;
import gamifyUser.exceptions.NoSexException;
import polimi.db2.gamifyDB.entities.Answer;
import polimi.db2.gamifyDB.entities.Offensive_word;
import polimi.db2.gamifyDB.entities.Question;
import polimi.db2.gamifyDB.entities.Questionnaire;
import polimi.db2.gamifyDB.entities.Review;
import polimi.db2.gamifyDB.entities.User;
import polimi.db2.gamifyDB.services.AnswerService;
import polimi.db2.gamifyDB.services.LogService;
import polimi.db2.gamifyDB.services.Offensive_wordService;
import polimi.db2.gamifyDB.services.QuestionService;
import polimi.db2.gamifyDB.services.QuestionnaireService;
import polimi.db2.gamifyDB.services.ReviewService;
import polimi.db2.gamifyDB.services.UserService;

@WebServlet("/SubmitQuestionnaire")
@MultipartConfig
public class SubmitQuestionnaire extends HttpServlet {
    private static final long serialVersionUID = 123211111L;
    @EJB(name = "gamifyDB.services/AnswerService")
    private AnswerService answerService;
    @EJB(name = "gamifyDB.services/ReviewService")
    private ReviewService reviewService;
    @EJB(name = "gamifyDB.services/QuestionnaireService")
    private QuestionnaireService questionnaireService;
    @EJB(name = "gamifyDB.services/QuestionService")
    private QuestionService questionService;
    @EJB(name = "gamifyDB.services/LogService")
    private LogService logService;
    @EJB(name = "gamifyDB.services/UserService")
    private UserService userService;
    @EJB(name = "gamifyDB.services/Offensive_wordService")
    private Offensive_wordService offensive_wordService;

    public SubmitQuestionnaire() {
        super();
    }

    public void init() {}

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {


        try {
            List < Question > questions = null;
            List < Answer > answers = new ArrayList < Answer > ();
            int canAccessAge = 0;
            int canAccessSex = 0;
            Review review = null;
            Questionnaire questionnaire;
            User user = null;

            try {
                user = (User) request.getSession().getAttribute("user");
                if (user == null) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.setContentType("text/plain");
                    response.getWriter().println("Not possible to retrieve the user in the session.");
                    return;
                }

            } catch (Exception e) {
            	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.setContentType("text/plain");
                response.getWriter().println("Not possible to retrieve the user in the session.");
                return;
            }


            try {
                questionnaire = questionnaireService.findByDate(new Date());
                if (questionnaire == null) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.setContentType("text/plain");
                    response.getWriter().println("Not possible to find the questionnaire.");
                    return;
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.setContentType("text/plain");
                response.getWriter().println("Not possible to find the questionnaire.");
                return;
            }

            /* check whether the user has already submitted today's questionnaire */
            try {
                if (reviewService.checkIfAlreadySubmitted(user, questionnaire)) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.setContentType("text/plain");
                    response.getWriter().println("You've already submitted today's questionnaire. Come back tomorrow!");
                    return;
                }
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.setContentType("text/plain");
                response.getWriter().println("Something went poof server-side. Please try again.");
                return;
            }

            String sex = null;
            String birth_string = null;
            String can_age_string = null;
            String can_sex_string = null;
            String expertise = null;
            try {
                sex = (StringEscapeUtils.escapeJava(request.getParameter("sex")));
                birth_string = (StringEscapeUtils.escapeJava(request.getParameter("birth")));
                can_age_string = (StringEscapeUtils.escapeJava(request.getParameter("can_access_age")));
                can_sex_string = (StringEscapeUtils.escapeJava(request.getParameter("can_access_sex")));
                expertise = StringEscapeUtils.escapeJava(request.getParameter("expertise"));
            } catch (Exception e) {
                response.getWriter().println("Not possible to retrieve the data.");
            }


            Date birthDate = null;
            if (birth_string != null && !birth_string.equals("")) {
                birthDate = new SimpleDateFormat("yyyy-MM-dd").parse(birth_string);
            }
            
            //check birthDate<=today
            if(birthDate != null && birthDate.compareTo(new Date())>=0) {
            	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.setCharacterEncoding("UTF-8");
                response.getWriter().println("Couldn't insert a birth > today ");
                return;
            }
            System.out.println(birthDate+" "+(StringEscapeUtils.escapeJava(request.getParameter("can_access_age")))+" "+sex+" "+(StringEscapeUtils.escapeJava(request.getParameter("can_access_sex"))));
            if (can_age_string != null && can_age_string.equals("on")) {
                if (birthDate == null) {
                    System.out.println("NoBirthException");
                    throw new NoBirthException();
                }
                canAccessAge = 1;
            }
            if (can_sex_string != null && can_sex_string.equals("on")) {
                if (sex == null) {
                    System.out.println("NoSexException");
                    throw new NoSexException();
                }
                canAccessSex = 1;
            }
            
            List<Offensive_word> offensive_words = null;
            try {

            	offensive_words = offensive_wordService.getWords();
            } catch (Exception e) {
                response.getWriter().println("Not possible to retrieve offensive words.");
                return;
            }

            questions = questionnaire.getQuestions();
            int count = 0;

            boolean block = false;
            for (Question question: questions) {
                String content = null;
                try {
                    content = StringEscapeUtils.escapeJava(request.getParameter("answer" + count));
                } catch (Exception e) {

                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.getWriter().println("Not possible to retrieve the answers content.");
                    return;
                }
                if (content == null || content.isEmpty()) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().println("An answer in empty!");
                    return;

                }
                
                for(Offensive_word w: offensive_words) {
                	if(content.contains(w.getWord()))
                		block = true;
                }
                
                Answer answer = new Answer();
                answer.setContent(content);
                answer.setQuestion(question);
                answer.setReview(review);
                answers.add(answer);
                count++;
            }
            
            //the user must be blocked
            if(block) {
            	System.out.println("Blocking "+user.getUsername()+" ...");
            	user = userService.blockUser(user);
            	response.setStatus(HttpServletResponse.SC_OK);
                response.setCharacterEncoding("UTF-8");
                response.setContentType("text/plain");
                response.getWriter().println("blocked");
                return;
            }
            try {
                review = reviewService.createReview(canAccessAge, canAccessSex, new Date(), expertise, user, questionnaire, answers, sex, birthDate);
            } catch (Exception e) {
                response.getWriter().println("Couldn't create review due to some dark magic tricking our servers. Please try again.");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.setCharacterEncoding("UTF-8");
                response.setContentType("text/plain");
                return;
            }
            response.setStatus(HttpServletResponse.SC_OK);
            response.setCharacterEncoding("UTF-8");
            response.setContentType("text/plain");
            response.getWriter().println("Thank you for your help ^^.");

        } catch (NoBirthException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("text/plain");
            response.getWriter().println("No birth to be given access");
            return;
        } catch (NoSexException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("text/plain");
            response.getWriter().println("No sex to be given access");
            return;
        } catch (Exception e) {
            String mex = "Bad request.";
            if (e instanceof NoBirthException || e instanceof NoSexException) {
                mex = e.getMessage();
            }
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("text/plain");
            response.getWriter().println(mex);
            return;
        }
    }

    public void destroy() {}
}