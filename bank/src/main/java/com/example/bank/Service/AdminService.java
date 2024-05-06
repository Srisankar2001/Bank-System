package com.example.bank.Service;

import com.example.bank.Config.Response;
import com.example.bank.Entity.Role;
import com.example.bank.Entity.User;
import com.example.bank.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {
    @Autowired
    UserRepository userRepository;

    public Response<?> unblockUser(Integer userId) {
        Optional<User> existingUser = userRepository.findById(userId);
        if(existingUser.isPresent()){
            User user = existingUser.get();
            if(!user.getIs_active()){
                user.setIs_active(true);
                userRepository.save(user);
                return Response.builder()
                        .status(true)
                        .build();
            }else{
                return Response.builder()
                        .status(false)
                        .error("User not blocked")
                        .build();
            }
        }else{
            return Response.builder()
                    .status(false)
                    .error("User not found")
                    .build();
        }
    }

    public Response<?> blockUser(Integer userId) {
        Optional<User> existingUser = userRepository.findById(userId);
        if(existingUser.isPresent()){
            User user = existingUser.get();
            if(user.getIs_active()){
                user.setIs_active(false);
                userRepository.save(user);
                return Response.builder()
                        .status(true)
                        .build();
            }else{
                return Response.builder()
                        .status(false)
                        .error("User already blocked")
                        .build();
            }
        }else{
            return Response.builder()
                    .status(false)
                    .error("User not found")
                    .build();
        }
    }

    public Response<?> getAllUsers() {
        List<User> users = userRepository.findAllByRole(Role.USER);
        return Response.builder()
                .status(true)
                .data(users)
                .build();
    }

    public Response<?> getAllAdmins() {
        List<User> admins = userRepository.findAllByRole(Role.ADMIN);
        return Response.builder()
                .status(true)
                .data(admins)
                .build();
    }

    public Response<?> getAllBlockedUsers() {
        List<User> users = userRepository.findAllByRole(Role.USER);
        List<User> blockedUsers = users.stream()
                .filter(user -> !user.getIs_active())
                .collect(Collectors.toList());

        return Response.builder()
                .status(true)
                .data(blockedUsers)
                .build();
    }

    public Response<?> getAllUnblockedUsers() {
        List<User> users = userRepository.findAllByRole(Role.USER);
        List<User> unblockedUsers = users.stream()
                .filter(user -> user.getIs_active())
                .collect(Collectors.toList());

        return Response.builder()
                .status(true)
                .data(unblockedUsers)
                .build();
    }
}
