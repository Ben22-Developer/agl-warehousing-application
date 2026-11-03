package com.resource.server.repository.user;

import com.resource.server.entity.user.*;
import jakarta.persistence.*;
import lombok.*;
import com.resource.server.service.security.*;
import org.springframework.stereotype.*;
import com.resource.server.repository.*;

import java.util.*;

@Repository
@RequiredArgsConstructor
public class UserRepository {

    private final EntityManagerFactory entityManagerFactory;

    public User getUserInContext ()
    {
        String username = SecurityContextUtils.getUsername();
        return getUserByUsername(username);
    }

    public User getUserByUsername (String username)
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        User user = entityManager.createQuery(String.format("SELECT u FROM %s u WHERE u.%s = :username", MyRepositoryUtils.User, MyRepositoryUtils.UserUsername), User.class)
                .setParameter("username", username)
                .getSingleResult();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return user;
    }

    public List<User> getAllUsers ()
    {
        var entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        List<User> user = entityManager.createQuery(String.format("SELECT u FROM %s u", MyRepositoryUtils.User), User.class)
                .getResultList();

        MyRepositoryUtils.closeEntityManager(entityManager);

        return user;
    }

}
