package com.resource.server.service.user;

import com.resource.server.entity.user.*;
import com.resource.server.repository.user.*;
import lombok.*;
import org.springframework.stereotype.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfile getContextUserProfile () {
        var user = userRepository.getUserInContext();
        return new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getRole(), user.getProfilePicture());
    }
}
