package com.hoatv.template.management.config;

import lombok.SneakyThrows;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.net.ssl.*;
import java.net.Socket;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;

@Configuration
public class ESConfig extends ElasticsearchConfiguration {

    @Value("${spring.elasticsearch.rest.uri}")
    private String elasticSearchURL;

    @Value("${spring.elasticsearch.rest.username}")
    private String elasticSearchUsername;

    @Value("${spring.elasticsearch.rest.password}")
    private String elasticSearchPassword;

    @Override
    public ClientConfiguration clientConfiguration() {
        final ClientConfiguration clientConfiguration = ClientConfiguration.builder()
                .connectedTo(elasticSearchURL)
                .usingSsl(getSSLContext(), NoopHostnameVerifier.INSTANCE)
                .withBasicAuth(elasticSearchUsername, elasticSearchPassword)
                .build();
        return clientConfiguration;
    }

    @SneakyThrows
    private SSLContext getSSLContext() {
        var trustManager = new X509ExtendedTrustManager() {
            @Override
            public X509Certificate[] getAcceptedIssuers() {
                return new X509Certificate[]{};
            }

            @Override
            public void checkClientTrusted(X509Certificate[] chain, String authType) {
            }

            @Override
            public void checkServerTrusted(X509Certificate[] chain, String authType) {
            }

            @Override
            public void checkClientTrusted(X509Certificate[] chain, String authType, Socket socket) {
            }

            @Override
            public void checkServerTrusted(X509Certificate[] chain, String authType, Socket socket) {
            }

            @Override
            public void checkClientTrusted(X509Certificate[] chain, String authType, SSLEngine engine) {
            }

            @Override
            public void checkServerTrusted(X509Certificate[] chain, String authType, SSLEngine engine) {
            }
        };
        var sslContext = SSLContext.getInstance("TLS");
        sslContext.init(null, new TrustManager[]{trustManager}, new SecureRandom());
        return sslContext;
    }
}
