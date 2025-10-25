package org.alumnet.infrastructure.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.MongoCredential;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoConfig {
    @Value("${MONGODB_HOST:localhost}")
    private String host;
    @Value("${MONGODB_PORT:27017}")
    private int port;
    @Value("${MONGODB_DB:alum-net}")
    private String database;
    @Value("${MONGODB_USER:admin}")
    private String username;
    @Value("${MONGODB_PASS:admin}")
    private String password;
    @Value("${MONGODB_AUTHDB:admin}")
    private String authDatabase;

    @Bean
    public MongoClient mongoClient() {
        // Crear credenciales
        MongoCredential credential = MongoCredential.createCredential(
                username,
                authDatabase,
                password.toCharArray()
        );

        // Crear la URI de conexión
        String connectionString = String.format("mongodb://%s:%d/%s", host, port, database);

        // Configurar el cliente
        MongoClientSettings settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .credential(credential)
                .build();

        return MongoClients.create(settings);
    }

    @Bean
    public MongoDatabaseFactory mongoDatabaseFactory(MongoClient mongoClient) {
        return new SimpleMongoClientDatabaseFactory(mongoClient, database);
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoDatabaseFactory mongoDatabaseFactory) {
        MongoTemplate template = new MongoTemplate(mongoDatabaseFactory);
        System.out.println("✅ MongoTemplate configurado para base de datos: " + template.getDb().getName());
        return template;
    }
}
