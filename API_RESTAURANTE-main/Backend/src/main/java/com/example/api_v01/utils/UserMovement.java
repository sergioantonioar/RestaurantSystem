package com.example.api_v01.utils;

import com.example.api_v01.dto.entityLike.UserDTO;
import com.example.api_v01.model.User;

public class UserMovement {
    public static User createUser(UserDTO user) {
        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .role(user.role)
                .build();
    }
}
