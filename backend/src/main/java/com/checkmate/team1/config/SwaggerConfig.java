package com.checkmate.team1.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Checkmate API")
                        .description("학생 출결, 휴가, 공지사항 관리 API 문서")
                        .version("v1.0.0"));
    }
}