package com.resource.server.entity.user;

import com.resource.server.entity.contract.goodsReceiptNote.*;
import com.resource.server.entity.contract.warehouseContract.*;
import com.resource.server.entity.grantedAuthorities.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.*;
import java.util.*;

@Entity
@Table
@Getter
@Setter
public class User
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(nullable = false)
    @ToString.Exclude
    private Role role;

    @Basic(fetch = FetchType.LAZY)
    private String password;

    private String profilePicture;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public UserProfile userProfile() {
        return new UserProfile(id, username, name, role, profilePicture);
    }

}
