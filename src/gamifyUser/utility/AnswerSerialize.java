package gamifyUser.utility;

import java.lang.reflect.Type;

import org.apache.commons.lang.StringEscapeUtils;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import polimi.db2.gamifyDB.entities.Answer;
import polimi.db2.gamifyDB.entities.Question;

public class AnswerSerialize implements JsonSerializer<Answer> {

@Override
    public JsonElement serialize(Answer obj, Type foo, JsonSerializationContext context) {

         JsonObject object = new JsonObject();
         Question question = obj.getQuestion();
         if(question == null) return null;
         String otherValue = question.getContent();
         object.addProperty("question", StringEscapeUtils.unescapeJava(otherValue));
         object.addProperty("content", StringEscapeUtils.unescapeJava(obj.getContent()));
         return object;
    }
  }