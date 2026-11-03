package com.resource.server.config.repository.init;

import com.resource.server.entity.contract.goodsReceiptNote.*;
import com.resource.server.entity.contract.purchaseOrder.*;
import com.resource.server.entity.contract.ship.*;
import com.resource.server.entity.contract.supplierInformation.*;
import com.resource.server.entity.contract.warehouseContract.*;
import com.resource.server.entity.grantedAuthorities.*;
import com.resource.server.entity.product.*;
import com.resource.server.entity.user.*;
import com.resource.server.enums.*;
import com.resource.server.repository.warehousing.WarehousingContractRepositoryCreator;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.crypto.password.*;

import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import java.util.stream.*;

import com.resource.server.repository.*;

@RequiredArgsConstructor
public class RepositoryUserInit implements RepositoryInit {


    private final EntityManagerFactory entityManagerFactory;
    private final PasswordEncoder passwordEncoder;


    public void init()
    {
        user_RoleInit ();
        System.out.println("Users and roles initialized successfully");
    }

    private void user_RoleInit ()
    {
        EntityManager entityManager = entityManagerFactory.createEntityManager();

        entityManager.getTransaction().begin();

        Role adminRole = getRole(Role.AdminRole);
        Role agentRole = getRole(Role.AgentRole);
        Role userRole = getRole(Role.UserRole);


        User user0 = getUser("Ben","ben",adminRole);
        User user1 = getUser("Belisse","belisse",agentRole);
        User user2 = getUser("Iradukunda","iradukunda",userRole);

        List<User> users = List.of(user0, user1, user2);

        for (User user : users)
        {
            entityManager.persist(user.getRole());
            entityManager.persist(user);
        }

        MyRepositoryUtils.closeEntityManager(entityManager);
    }

    private Role getRole (String name)
    {
        Role role = new Role();
        role.setName(name);
        return role;
    }

    private User getUser (String name, String username, Role role)
    {
        User user = new User();

        user.setName(name);
        user.setRole(role);
        user.setPassword(passwordEncoder.encode("."));
        user.setUsername(username);
        user.setProfilePicture("https://images.pexels.com/photos/32703420/pexels-photo-32703420.jpeg");
        user.setCreatedAt(LocalDateTime.now());

        return user;
    }



}
