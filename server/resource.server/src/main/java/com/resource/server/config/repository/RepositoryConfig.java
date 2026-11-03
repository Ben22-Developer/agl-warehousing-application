package com.resource.server.config.repository;

import com.resource.server.config.repository.init.*;
import com.zaxxer.hikari.*;
import jakarta.persistence.*;
import jakarta.persistence.spi.*;
import org.hibernate.jpa.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.*;

import javax.sql.*;
import java.util.*;

@Configuration
public class RepositoryConfig
{

    @Bean
    public DataSource dataSource (@Value("${spring.datasource.url}") String connectionUrl,
                                  @Value("${spring.datasource.username}") String username,
                                  @Value("${spring.datasource.password}") String password,
                                  @Value("${spring.datasource.driver-class-name}") String driverClassName)
    {
        var hikariConfig = new HikariConfig();

        hikariConfig.setJdbcUrl(connectionUrl);
        hikariConfig.setUsername(username);
        hikariConfig.setPassword(password);
        hikariConfig.setDriverClassName(driverClassName);

        return new HikariDataSource(hikariConfig);
    }

    @Bean
    public EntityManagerFactory entityManagerFactory (@Value("${spring.datasource.jpa.mysql.persistence-unit-name}") String persistenceUnitName,
                                                      @Value("${spring.datasource.jpa.show_sql}") String showSql,
                                                      @Value("${spring.datasource.jpa.ddl}") String ddl,
                                                      DataSource dataSource,
                                                      PasswordEncoder passwordEncoder)
    {

        PersistenceUnitInfo repositoryInit = new MyPersistenceUnitInfo(dataSource, persistenceUnitName);


        var entityManagerFactory = new HibernatePersistenceProvider()
                .createContainerEntityManagerFactory(repositoryInit, Map.of("hibernate.show_sql", showSql,
                        "hibernate.hbm2ddl.auto", ddl));

        if (ddl.equals("create") || ddl.equals("create-drop"))
            databaseInit (entityManagerFactory, passwordEncoder);

        return entityManagerFactory;
    }

    private void databaseInit (EntityManagerFactory entityManagerFactory, PasswordEncoder passwordEncoder)
    {
        new RepositoryUserInit(entityManagerFactory, passwordEncoder)
                .init();

        new RepositoryWarehousingContractInit(entityManagerFactory)
                .init();

        new RepositoryProductInStockInit(entityManagerFactory)
                .init();

    }
}