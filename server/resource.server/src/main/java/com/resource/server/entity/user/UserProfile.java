package com.resource.server.entity.user;

import com.resource.server.entity.grantedAuthorities.*;

public record UserProfile (long id, String username, String name, Role role, String profilePicture){}