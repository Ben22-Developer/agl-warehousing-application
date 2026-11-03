package com.authorization.server.repository;

import com.sun.tools.javac.*;
import lombok.*;
import org.springframework.jdbc.core.*;
import org.springframework.stereotype.*;
import org.springframework.security.core.userdetails.*;

import java.util.*;

@Repository
@RequiredArgsConstructor
public class UserDetailsRepository {

    private final JdbcTemplate jdbcTemplate;

    public User getUserLoginCredentialsByUsername (String username)
    {
        String sql = "SELECT username, password FROM user WHERE username=?";

        RowMapper<User> rowMapper= (resultSet, rowNumber) -> new User(resultSet.getString(1), resultSet.getString(2), List.of());

        return jdbcTemplate.queryForObject(sql, rowMapper, username);
    }

    public Map<String, Object> getUserInfo (String username)
    {
        String sql =
        """
            SELECT u.name, u.profilePicture, r.name FROM user u
            JOIN role r ON r.id = u.role_id
            WHERE u.username=?
        """;

        RowMapper<Map<String, Object>> rowMapper= (resultSet, rowNumber) ->
        {
            String name = resultSet.getString(1);
            String profilePicture = resultSet.getString(2);
            String role = resultSet.getString(3);

            return Map.of("name", name,
                    "username", username,
                    "profilePicture", profilePicture,
                    "scope", role);
        };
        return jdbcTemplate.queryForObject(sql, rowMapper, username);
    }
}
