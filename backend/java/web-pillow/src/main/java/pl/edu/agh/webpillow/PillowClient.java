package pl.edu.agh.webpillow;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import pl.edu.agh.webpillow.dto.ImageEnhanceDto;
import pl.edu.agh.webpillow.dto.ImageFilterDto;
import pl.edu.agh.webpillow.dto.ImageResponseDto;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Component
public class PillowClient {

    @Value("${pillow.host}")
    private String pillowHost;

    @Value("${pillow.port}")
    private String pillowPort;

    private static String BASE_PATH;
    private static final String ENHANCE_PATH = "enhance";
    private static final String FILTER_PATH = "filter";
    private static final String ALL_PATH = "all";
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder().build();

    @PostConstruct
    private void init() {
        BASE_PATH = "http://" + pillowHost + ":" + pillowPort;
    }

    public ImageResponseDto enhanceImage(ImageEnhanceDto imageEnhanceDto) throws IOException, InterruptedException {
        OBJECT_MAPPER.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        String requestBody = OBJECT_MAPPER.writerWithDefaultPrettyPrinter()
                .writeValueAsString(imageEnhanceDto);
        HttpResponse<String> response = sendModifyImageRequest(ENHANCE_PATH, requestBody);
        return OBJECT_MAPPER.readValue(response.body(), OBJECT_MAPPER.getTypeFactory().constructType(ImageResponseDto.class));
    }

    public ImageResponseDto applyFilter(ImageFilterDto imageFilterDto) throws IOException, InterruptedException {
        OBJECT_MAPPER.setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
        String requestBody = OBJECT_MAPPER.writerWithDefaultPrettyPrinter()
                .writeValueAsString(imageFilterDto);
        HttpResponse<String> response = sendModifyImageRequest(FILTER_PATH, requestBody);
        return OBJECT_MAPPER.readValue(response.body(), OBJECT_MAPPER.getTypeFactory().constructType(ImageResponseDto.class));
    }

    private HttpResponse<String> sendModifyImageRequest(String path, String requestBody) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_PATH + "/" + path))
                .header("Content-Type", "application/json")
                .PUT(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
        return HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
    }

    public List<String> getAvailableFilters() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_PATH + "/" + FILTER_PATH + "/" + ALL_PATH))
                .GET()
                .build();
        HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
        return OBJECT_MAPPER.readValue(response.body(), OBJECT_MAPPER.getTypeFactory().constructCollectionType(List.class, String.class));
    }
}
