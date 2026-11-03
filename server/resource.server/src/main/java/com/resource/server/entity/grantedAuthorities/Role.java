package com.resource.server.entity.grantedAuthorities;

import com.resource.server.entity.user.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.*;

@Entity
@Table
@Getter
@Setter
public class Role
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    public static String AdminRole = "ADMIN";
    public static String AgentRole = "AGENT";
    public static String UserRole = "USER";
}
